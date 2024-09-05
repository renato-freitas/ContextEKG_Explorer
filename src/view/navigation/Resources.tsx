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

import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../redux/store'
import { cleanStackOfResourcesNavigated, pushResourceInStackOfResourcesNavigated, updasteResourceURI, updateInitialResourceOfNavigation } from '../../redux/globalContextSlice';

import { MHeader } from "../../components/MHeader";
import { MTable } from "../../components/MTable";

import { api } from "../../services/api";
import { ResourceModel } from "../../models/ResourceModel";
import { ClassModel } from "../../models/ClassModel";

import { LoadingContext, ClassRDFContext } from "../../App";
import { double_encode_uri, getContextFromURI, printt } from "../../commons/utils";
import { COLORS, NAMESPACES, NUMBERS, ROUTES } from "../../commons/constants";
import stylesGlobal from '../../styles/global.module.css';
import { Button } from "@mui/material";



export function Resources() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const global_context = useSelector((state: RootState) => state.globalContext)
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  // const { contextClassRDF } = useContext(ClassRDFContext);
  const [page, setPage] = useState(0);
  // const [, setSelectedClass] = useState<string>("");
  const [selectedClassRDF, setSelectedClassRDF] = useState<ClassModel>();
  const [selectedResource, setSelectedResource] = useState<ResourceModel>();
  const [resources, setResources] = useState<ResourceModel[]>([]);
  const [labelToSearch, setLabelToSearch] = useState<string>("");
  const [typeOfSelectedClass, setTypeOfSelectedClass] = useState<string>("");
  const [runingSearch, setRuningSearch] = useState<boolean>(false);
  const [totalOfResources, setTotalOfResources] = useState<number>(0);
  // const [selectedLanguage, setSelectedLanguage] = useState(window.localStorage.getItem('LANGUAGE'));
  // const [globalContext, setGlobalContext] = useState(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.GLOBAL_CONTEXT) as string));


  async function loadResourcesOfSelectedClass(newPage: number) {
    setIsLoading(true)
    let response: any
    try {
      // console.log('nome procurado:', labelToSearch)
      // let uri = double_encode_uri(contextClassRDF.classURI.value)
      // let uri = double_encode_uri(classURI)
      let uri = double_encode_uri(global_context.classRDF?.classURI?.value as string)
      // if (typeOfClass == NUMBERS.CODE_UNIFICATION_VIEW || typeOfClass == NUMBERS.CODE_FUSION_VIEW) {
      // if (global_context.view == NUMBERS.CODE_OF_UNIFICATION_VIEW || global_context.view == NUMBERS.CODE_OF_FUSION_VIEW) {
      if ([NUMBERS.CODE_OF_UNIFICATION_VIEW, NUMBERS.CODE_OF_FUSION_VIEW].includes(global_context.view)) {
        // response = await api.get(`/resources/generalization?classRDF=${uri}&page=${newPage}&rowPerPage=${rowsPerPage}&label=${labelToSearch}&language=${selectedLanguage}`)
        response = await api.get(`/resources/generalization?classRDF=${uri}&page=${newPage}&rowPerPage=${rowsPerPage}&label=${labelToSearch}&language=${global_context.language}`)
      }
      else {
        // response = await api.get(`/resources/?classRDF=${uri}&page=${newPage}&rowPerPage=${rowsPerPage}&label=${labelToSearch}&language=${global_context.language}`)
        response = await api.get(`/resources/?classRDF=${uri}&page=${newPage}&rowPerPage=${rowsPerPage}&label=${labelToSearch}&language=${global_context.language}`)
      }
      // console.log('recursos:', response.data)
      getTotalResources()
      setResources(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      window.scrollTo(0, 0)
    }
  }

  /**Esse total de recursos é para saber até onde paginar */
  async function getTotalResources() {
    let response: any
    try {
      // let uri = double_encode_uri(classURI)
      let uri = double_encode_uri(global_context?.classRDF?.classURI.value as string)
      // let uri = double_encode_uri(contextClassRDF.classURI.value)
      // let if_sameas = typeOfClass == NUMBERS.CODE_UNIFICATION_VIEW ? true : false
      let if_sameas = global_context.view == NUMBERS.CODE_OF_UNIFICATION_VIEW ? true : false
      response = await api.get(`/resources/count/?classURI=${uri}&label=${labelToSearch.toLowerCase()}&sameas=${if_sameas}&language=${global_context.language}`)
      // console.log(`total:`, response.data)
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
    // console.log('--- global_context ---', global_context)
    console.log('--- classe global ---', global_context.classRDF?.classURI.value)
    function onEdit() {
      try {
        const _repo_in_api_header = api.defaults.headers.common['repo']
        // console.log('repositório no api.header:', _repo_in_api_header)
        if (_repo_in_api_header) {
          dispatch(cleanStackOfResourcesNavigated())
          // if (location.state) {
          //   let _state = location.state as any;
          //   console.log('^^', _state)
          //   loadResourcesOfSelectedClass(page)
          //   getTotalResources()
          // }
          // else {
          loadResourcesOfSelectedClass(page)
          // getTotalResources()
          // }
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
    // updateGlobalContext({resourceURI: resource.uri.value})
    dispatch(updasteResourceURI(resource.uri.value))
    dispatch(updateInitialResourceOfNavigation(resource.uri.value))
    dispatch(pushResourceInStackOfResourcesNavigated(resource.uri.value))
    setSelectedIndex(idx);
    setSelectedResource(resource)
    // navigate(ROUTES.PROPERTIES, { state: { resource_uri: resource.uri.value, typeOfClass: typeOfSelectedClass } })
    // navigate(`/properties/`)
    navigate(`/properties/${encodeURIComponent(resource.uri.value)}`)
  };



  /**Pagination */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    loadResourcesOfSelectedClass(newPage)
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


  const handleProvenanceClick = (event: any, classRDF: any) => {
    // setContextClassRDF(classRDF.classURI.value)
    console.log('provenance', classRDF)
    console.log('provenance', NAMESPACES.ARIDA_RESOURCE_METADATA + "ESV_" + classRDF)
    // navigate(ROUTES.PROPERTIES, { state: { classRDF, typeOfClass: NUMBERS.CODE_EXPORTED_VIEW } })
    navigate(ROUTES.METADATA_PROPERTIES, { state: { resource_uri: NAMESPACES.ARIDA_RESOURCE_METADATA + "ESV_" + classRDF, typeOfClass: typeOfSelectedClass } })
  };

  return (
    <div className={stylesGlobal.container}>
      <Grid container spacing={1} sx={{ p: '2px 0' }}>
        <Grid item xs={6} sx={{ bgcolor: null }}>
          <MHeader
            title={global_context.language == 'pt' ? `Classe "${global_context.classRDF?.label?.value}"` : `"${global_context.classRDF?.label?.value}" Class`}
            hasButtonBack
            buttonBackNavigateTo={ROUTES.CLASSES}
          />
        </Grid>

        <Grid item xs={6} display='flex' justifyContent='flex-end' sx={{ bgcolor: null }}>
          <TextField sx={{ width: 450 }}
            id="outlined-basic" label={global_context.language == 'pt' ? "Pesquisar somente pelo nome do recurso" : "Search by name"} variant="outlined" size="small"
            value={labelToSearch}
            onChange={handleSearchResourceLabel}
            // error={labelToSearch.length > 1 && foundClasses.length == 0}
            helperText={(labelToSearch.length > 1 && resources.length == 0) ? "Sem corespondência." : false}
            onKeyUp={handleSearchEscape}
          />
        </Grid>
      </Grid>

      {/* CONTENT */}
      {
        !isLoading && resources && <Grid container spacing={4} sx={{ mb: 1 }}>
          <Grid item sm={12} justifyContent={'center'}>
            <MTable
              header={[[global_context.language == 'pt' ? "Recursos" : "Resources", "left"], [global_context.language == 'pt' ? "Proveniência" : "Provenance", "left"]]}
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
                      <Button variant="text" onClick={(event) => handleProvenanceClick(event, getContextFromURI(resource?.uri?.value))}>
                        <Typography variant="caption" component="div" color="gray">
                          {[NUMBERS.CODE_OF_UNIFICATION_VIEW, NUMBERS.CODE_OF_FUSION_VIEW].includes(global_context.view) ? global_context.language == 'pt' ? "Visão de Unificação" : "Unification View" : getContextFromURI(resource?.uri?.value)}
                        </Typography>
                      </Button>
                    </TableCell>
                    <TableCell align='right'>
                      <Tooltip title={global_context.language == 'pt' ? "Propriedades" : "Properties"}>
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
    </div >
  )
}