import { useState, useEffect, useContext, ChangeEvent, KeyboardEvent } from "react";
import Grid from '@mui/material/Grid'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Checkbox from "@mui/material/Checkbox";

import { useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'


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
  const global_context = useSelector((state: RootState) => state.globalContext)
  const [page, setPage] = useState(0);
  const [repositories, setRepositories] = useState<RepositoryModel[]>([]);
  const [labelToSearch, setLabelToSearch] = useState<string>("");
  const [runingSearch, setRuningSearch] = useState<boolean>(false);
  const estaEmPortugues = global_context.language == 'pt'


  async function loadRepositories() {
    let response: any
    try {
      setIsLoading(true)
      response = await api.get(`/repositories`)
      setRepositories(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log('ERROR', error);
    } finally {
      window.scrollTo(0, 0)
    }
  }


  useEffect(() => {
    loadRepositories()
    let localstorageRepository = getsetRepositoryLocalStorage()
    setChecked(localstorageRepository)
  }, [runingSearch]);



  /**Pagination */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    loadRepositories()
  };

  const [rowsPerPage, setRowsPerPage] = useState(NUMBERS.INICIAL_ROWS_PER_PAGE);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setRuningSearch(!runingSearch)
  };



  const handleSearchResourceLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelToSearch((event.target as HTMLInputElement).value);
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
            title={languages.repository.title(global_context.language)}
            hasButtonBack
          />
        </Grid>

        <Grid item xs={6} display='flex' justifyContent='flex-end' sx={{ bgcolor: null }}>
          <TextField sx={{ width: 450 }}
            id="outlined-basic" label={estaEmPortugues ? "Pesquisar somente pelo nome do recurso" : "Search only by name"} variant="outlined" size="small"
            value={labelToSearch}
            onChange={handleSearchResourceLabel}
            helperText={(labelToSearch.length > 1 && repositories.length == 0) ? "Sem corespondência." : false}
            onKeyUp={handleSearchEscape}
          />
        </Grid>
      </Grid>


      {
        !isLoading && <Grid container spacing={4} sx={{ mb: 1 }}>
          {/* REPOSITORIES IN THE TRIPLE STORE */}
          <Grid item sm={12} justifyContent={'center'}>
            <MTable
              header={[[estaEmPortugues ? "Repositórios" : "Repositories", "left"], [estaEmPortugues ? "Descrição" : "Description", "left"]]}
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