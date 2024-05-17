import { useState, useEffect, useContext, ChangeEvent, KeyboardEvent, Key } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Checkbox from "@mui/material/Checkbox";
import { Eye } from "phosphor-react";

import { MHeader } from "../../components/MHeader";
import { MTable } from "../../components/MTable";

import { api } from "../../services/api";
import { ResourceModel } from "../../models/ResourceModel";
import { ClassModel } from "../../models/ClassModel";

import { LoadingContext, ClassRDFContext } from "../../App";
import { double_encode_uri, getContextFromURI, getsetRepositoryLocalStorage, printt, setRepositoryLocalStorage } from "../../commons/utils";
import { COLORS, NUMBERS, ROUTES } from "../../commons/constants";

import styles from '../../styles/global.module.css';
import { RepositoryModel } from "../../models/RepositoryModel";



export function Repositories() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { contextClassRDF, setContextClassRDF } = useContext(ClassRDFContext);
  const [page, setPage] = useState(0);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedClassRDF, setSelectedClassRDF] = useState<ClassModel>();
  const [selectedRepository, setSelectedRepository] = useState<RepositoryModel>();
  const [repositories, setRepositories] = useState<RepositoryModel[]>([]);
  const [labelToSearch, setLabelToSearch] = useState<string>("");
  const [runingSearch, setRuningSearch] = useState<boolean>(false);
  const [totalOfResources, setTotalOfResources] = useState<number>(0);


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

  // async function getTotalResources(RDFClass: string) {
  //   let response: any
  //   try {
  //     // let uri = double_encode_uri(RDFClass)
  //     let uri = double_encode_uri(contextClassRDF.classURI.value)
  //     response = await api.get(`/resources/count/?classURI=${uri}&label=${labelToSearch.toLowerCase()}`)
  //   } catch (error) {
  //     console.log(`><`, error);
  //   } finally {
  //     setTimeout(() => {
  //       setTotalOfResources(response.data)
  //       console.log(`total: `, response.data)
  //       console.log(`total: `, typeof response.data)
  //     }, NUMBERS.TIME_OUT_FROM_REQUEST)
  //   }
  // }



  // useEffect(() => {
  //   function onEdit() {
  //     console.log('CLASS RDF CONTEXTO', contextClassRDF)
  //     try {
  //       if (location.state) {
  //         let classRDF = location.state as ClassModel;
  //         let classURI = classRDF.classURI?.value as string
  //         console.log("1. CLASSE ESCOLHIDA", classRDF.classURI?.value)
  //         setSelectedClass(classURI)
  //         setSelectedClassRDF(classRDF)
  //         loadRepositories()
  //       } else {
  //         loadRepositories()
  //       }
  //     } catch (err) {
  //       printt("Erro", err)
  //     } finally {
  //       window.scrollTo(0, 0)
  //     }
  //   }
  //   onEdit();
  // }, [location.state, runingSearch]);


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
  };
  return (
    <div className={styles.container}>
      <Grid container spacing={1} sx={{ p: '2px 0' }}>
        <Grid item xs={6} sx={{ bgcolor: null }}>
          <MHeader
            title={`Seleção de Repositório`}
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