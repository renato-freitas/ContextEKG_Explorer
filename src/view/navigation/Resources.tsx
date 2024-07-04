import { useState, useEffect, useContext, ChangeEvent, KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Eye } from "phosphor-react";

import { MHeader } from "../../components/MHeader";
import { MTable } from "../../components/MTable";

import { api } from "../../services/api";
import { ResourceModel } from "../../models/ResourceModel";
import { ClassModel } from "../../models/ClassModel";

import { LoadingContext, ClassRDFContext } from "../../App";
import { double_encode_uri, getContextFromURI, printt } from "../../commons/utils";
import { COLORS, NUMBERS, ROUTES } from "../../commons/constants";
import stylesGlobal from '../../styles/global.module.css';
import styles from './navigation.module.css';



export function Resources() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { contextClassRDF } = useContext(ClassRDFContext);
  const [page, setPage] = useState(0);
  // const [, setSelectedClass] = useState<string>("");
  const [selectedClassRDF, setSelectedClassRDF] = useState<ClassModel>();
  const [selectedResource, setSelectedResource] = useState<ResourceModel>();
  const [resources, setResources] = useState<ResourceModel[]>([]);
  const [labelToSearch, setLabelToSearch] = useState<string>("");
  const [typeOfSelectedClass, setTypeOfSelectedClass] = useState<string>("");
  const [runingSearch, setRuningSearch] = useState<boolean>(false);
  const [totalOfResources, setTotalOfResources] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState(window.localStorage.getItem('LANGUAGE'));


  async function loadResourcesOfSelectedClass(classURI: string, typeOfClass: string, newPage: number) {
    let response: any
    try {
      setIsLoading(true)
      console.log('nome procurado:', labelToSearch)
      // let uri = double_encode_uri(contextClassRDF.classURI.value)
      let uri = double_encode_uri(classURI)
      if (typeOfClass == NUMBERS.CODE_UNIFICATION_VIEW || typeOfClass == NUMBERS.CODE_FUSION_VIEW) {
        response = await api.get(`/resources/generalization?classRDF=${uri}&page=${newPage}&rowPerPage=${rowsPerPage}&label=${labelToSearch}&language=${selectedLanguage}`)
      }
      else {
        response = await api.get(`/resources/?classRDF=${uri}&page=${newPage}&rowPerPage=${rowsPerPage}&label=${labelToSearch}&language=${selectedLanguage}`)
      }
      console.log('recursos da classe:', response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      window.scrollTo(0, 0)
      setIsLoading(false)
      setResources(response.data)
      // setTimeout(() => {

      // setPage(0)
      // }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  /**Esse total de recursos é para saber até onde paginar */
  async function getTotalResources(classURI: string, typeOfClass: string) {
    let response: any
    try {
      let uri = double_encode_uri(classURI)
      // let uri = double_encode_uri(contextClassRDF.classURI.value)
      let if_sameas = typeOfClass == NUMBERS.CODE_UNIFICATION_VIEW ? true : false
      response = await api.get(`/resources/count/?classURI=${uri}&label=${labelToSearch.toLowerCase()}&sameas=${if_sameas}`)
      console.log(`total:`, response.data)
      setTotalOfResources(response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      // setTimeout(() => {
        // console.log(`total: `, typeof response.data)
        // setPage(0);
      // }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }



  useEffect(() => {
    function onEdit() {
      try {
        const _repo_in_api_header = api.defaults.headers.common['repo']
        console.log('repositório no api.header:', _repo_in_api_header)
        if (_repo_in_api_header) {
          if (location.state) {
            let _state = location.state as any;
            console.log('^^', _state)
            let classURI = _state.classRDF.classURI?.value as string
            // console.log('classe escolhida:', classRDF.classURI?.value)
            // setSelectedClass(classURI)
            setSelectedClassRDF(_state.classRDF)
            setTypeOfSelectedClass(_state.typeOfClass)
            loadResourcesOfSelectedClass(classURI, _state.typeOfClass, page)
            getTotalResources(classURI, _state.typeOfClass)
          }
          else {
            console.log('react.context class rdf:', contextClassRDF)
            loadResourcesOfSelectedClass(contextClassRDF.classURI.value, typeOfSelectedClass, page)
            getTotalResources(contextClassRDF.classURI.value, typeOfSelectedClass)
          }
        }
        else {
          navigate(ROUTES.REPOSITORY_LIST)
        }
      } catch (err) {
        printt("Erro", err)
      } finally {
        window.scrollTo(0, 0)
      }
    }
    onEdit();
  }, [location.state, runingSearch]);



  const [selectedIndex, setSelectedIndex] = useState<Number>(1);
  const handleListOfResourcesClick = (event: any, idx: Number, resource: ResourceModel) => {
    setSelectedIndex(idx);
    setSelectedResource(resource)
    navigate(ROUTES.PROPERTIES, { state: { resource_uri: resource.uri.value, typeOfClass: typeOfSelectedClass } })
  };



  /**Pagination */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    loadResourcesOfSelectedClass(selectedClassRDF?.classURI?.value as string, typeOfSelectedClass, newPage)
  };

  const [rowsPerPage, setRowsPerPage] = useState(6);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
    setRuningSearch(!runingSearch)
    // setPage(0);
  };



  const handleSearchResourceLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelToSearch((event.target as HTMLInputElement).value);
    console.log((event.target as HTMLInputElement).value)
  };
  const handleSearchEscape = (event: KeyboardEvent) => {
    if (event.key == 'Escape') {
      setLabelToSearch("")
      setPage(0)
      if (labelToSearch != "") setRuningSearch(!runingSearch)
    }
    if (event.key == "Enter") {
      if (labelToSearch != "") setPage(0)
      setRuningSearch(!runingSearch)
    }
  };



  return (
    <div className={stylesGlobal.container}>
      <Grid container spacing={1} sx={{ p: '2px 0' }}>
        <Grid item xs={6} sx={{ bgcolor: null }}>
          <MHeader
            // title={`Recursos da classe ${getPropertyFromURI(selectedClass)}`}
            // title={`Classe "${selectedClassRDF?.label?.value}"`}
            title={selectedLanguage == 'pt' ? `Classe "${contextClassRDF.label?.value}"` : `"${contextClassRDF.label?.value}" Class`}
            hasButtonBack
            // buttonBackNavigateTo={`${ROUTES.NAVIGATION}`}
          />
        </Grid>

        <Grid item xs={6} display='flex' justifyContent='flex-end' sx={{ bgcolor: null }}>
          {/* <Stack direction={'row'} gap={1} alignItems={'center'}>
            <Tooltip title="Teste">
              <Info size={32}></Info>
            </Tooltip> */}
          <TextField sx={{ width: 450 }}
            id="outlined-basic" label={selectedLanguage == 'pt' ? "Pesquisar somente pelo nome do recurso" : "Search by name"} variant="outlined" size="small"
            value={labelToSearch}
            onChange={handleSearchResourceLabel}
            // error={labelToSearch.length > 1 && foundClasses.length == 0}
            helperText={(labelToSearch.length > 1 && resources.length == 0) ? "Sem corespondência." : false}
            onKeyUp={handleSearchEscape}
          />
          {/* </Stack> */}
        </Grid>
      </Grid>

      {/* CONTENT */}
      {
        resources.length > 0 && <Grid container spacing={4} sx={{ mb: 1 }}>
          {/* DATA SOURCES */}
          <Grid item sm={12} justifyContent={'center'}>
            <MTable
              header={[[selectedLanguage == 'pt' ? "Recursos" : "Resources", "left"], [selectedLanguage == 'pt' ? "Proveniência" : "Provenance", "left"]]}
              size={totalOfResources}
              // size={ ((page +1) * rowsPerPage) < totalOfResources ? totalOfResources : resources.length}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              hasActions
              alignActions='right'
              loading={false}
            >
              {
                resources.map((resource, idx) => (
                  <TableRow key={idx} >
                    <TableCell>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>{resource.label.value}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" component="div" color="gray">
                        {typeOfSelectedClass == NUMBERS.CODE_UNIFICATION_VIEW ? selectedLanguage == 'pt' ? "Visão de Unificação" : "Unification View" : getContextFromURI(resource?.uri?.value)}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Tooltip title={selectedLanguage == 'pt' ? "Propriedades" : "Properties"}>
                        <IconButton onClick={(event) => handleListOfResourcesClick(event, idx, resource)} sx={{ p: "4px !important" }}>
                          <Eye size={22} color={COLORS.AZUL_04} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </MTable>
          </Grid>
        </Grid>
      }

      {/* <Grid container spacing={1}>
        <Grid item sm={12}>
          <List sx={{
            bgcolor: 'None',
            position: 'relative',
            overflow: 'auto',
            '& ul': { padding: 0 },
          }}>
            {resources.map((row, idx) => <ListItemButton key={row?.uri?.value}
              selected={selectedIndex === idx}
              onClick={(event) => handleListItemClick(event, idx, row)}
            >
              <MCard
                bgcolor={changeBgColorCard(idx)}>
                <Box sx={{ width: window.screen.width * 0.6 }}>
                  <Grid item sm={12} gap={3}>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" component="div">
                        {idx + 1} - {getPropertyFromURI(row.label.value)}
                      </Typography>
                      <Typography variant="caption" component="div" color="gray">
                        - {getContextFromURI(row?.uri?.value)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Box>
              </MCard>
            </ListItemButton>
            )}
          </List>
        </Grid>
      </Grid> */}
    </div >
  )
}