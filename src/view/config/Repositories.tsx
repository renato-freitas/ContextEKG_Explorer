import { useState, useEffect, useContext, ChangeEvent, KeyboardEvent } from "react";
import Grid from '@mui/material/Grid'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Checkbox from "@mui/material/Checkbox";

import { MHeader } from "../../components/MHeader";
import { MTable } from "../../components/MTable";

import { api } from "../../services/api";

import { LoadingContext } from "../../App";
import { getsetRepositoryLocalStorage, setRepositoryLocalStorage } from "../../commons/utils";
import { NUMBERS } from "../../commons/constants";
import { languages } from "../../commons/languages";

import styles from '../../styles/global.module.css';
import { RepositoryModel } from "../../models/RepositoryModel";



export function Repositories() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [page, setPage] = useState(0);
  const [repositories, setRepositories] = useState<RepositoryModel[]>([]);
  const [labelToSearch, setLabelToSearch] = useState<string>("");
  const [runingSearch, setRuningSearch] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("pt");


  async function loadRepositories() {
    let response: any
    try {
      setIsLoading(true)
      response = await api.get(`/repositories`)
      console.log(`2. RECURSOS DA CLASSE`, response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      window.scrollTo(0, 0)
      setTimeout(() => {
        setIsLoading(false)
        setRepositories(response.data)
        // setPage(0)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  useEffect(() => {
    let b:string = window.localStorage.getItem('LANGUAGE') as string
    setSelectedLanguage(b)
  }, []);


  useEffect(() => {
    loadRepositories()
    let localstorageRepository = getsetRepositoryLocalStorage()
    setChecked(localstorageRepository)

  }, [runingSearch]);


  const [selectedIndex, setSelectedIndex] = useState<Number>(1);
  


  /**Pagination */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    loadRepositories()
  };

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
    setRuningSearch(!runingSearch)
  };



  const handleSearchResourceLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelToSearch((event.target as HTMLInputElement).value);
    console.log((event.target as HTMLInputElement).value)
  };
  const handleSearchEscape = (event: KeyboardEvent) => {
    if (event.key == 'Escape') {
      setLabelToSearch("")
      setPage(0)
      if (labelToSearch != "") {
        setRuningSearch(!runingSearch)
      }
    }
    if (event.key == "Enter") {
      setRuningSearch(!runingSearch)
    }
  };


  const [checked, setChecked] = useState("");
  const handleChangeRepository = (event: React.ChangeEvent<HTMLInputElement>, repository:string) => {
    setChecked(repository);
    setRepositoryLocalStorage(repository)
    api.defaults.headers.common['repo'] = repository
    window.scrollTo(0,0)
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={1} sx={{ p: '2px 0' }}>
        <Grid item xs={6} sx={{ bgcolor: null }}>
          <MHeader
            title={languages.repository.title(selectedLanguage)}
            hasButtonBack
          />
        </Grid>

        <Grid item xs={6} display='flex' justifyContent='flex-end' sx={{ bgcolor: null }}>
          <TextField sx={{ width: 450 }}
            id="outlined-basic" label="Pesquisar somente pelo nome do recurso" variant="outlined" size="small"
            value={labelToSearch}
            onChange={handleSearchResourceLabel}
            helperText={(labelToSearch.length > 1 && repositories.length == 0) ? "Sem corespondência." : false}
            onKeyUp={handleSearchEscape}
          />
        </Grid>
      </Grid>


      {
        !isLoading && <Grid container spacing={4} sx={{ mb: 1 }}>
          {/* DATA SOURCES */}
          <Grid item sm={12} justifyContent={'center'}>
            <MTable
              header={[["Repositórios", "left"], ["Descrição", "left"]]}
              size={repositories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              hasActions
              alignActions='right'
              loading={false}
            >
              {

                repositories.length > 0 && repositories.map((resource, idx) => (
                  <TableRow key={idx} >
                    <TableCell>
                      <Typography>{resource.id.value}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" component="div" color="gray">
                        {resource?.title?.value}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={checked == resource.id.value ? true : false}
                        onChange={(e) => handleChangeRepository(e, resource.id.value)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </MTable>
          </Grid>
        </Grid>
      }
    </div >
  )
}