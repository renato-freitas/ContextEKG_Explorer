import { useState, useEffect, useContext, Key } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Database, Link as LinkIcon } from 'phosphor-react';
import { Graph, ArrowRight } from '@phosphor-icons/react';
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../redux/store'
import { updateView, updasteResourceURI } from '../../redux/globalContextSlice';
import { LoadingContext } from "../../App";
import { getContextFromURI } from "../../commons/utils";
import stylesGlobal from '../../styles/global.module.css';
import { COLORS, NUMBERS, ROUTES } from "../../commons/constants";
import { api } from "../../services/api";
import { Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { InstantComponent } from "./InstantComponent";
import { TitleOfTimeline } from "../../components/TitleOfTimeline";


export function TimelineView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { uri } = useParams()
  const dispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const global_context: any = useSelector((state: RootState) => state.globalContext)
  const [instants, setInstants] = useState<any>({})
  const [labelOfResource, setLabelOfResource] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<Number>(NUMBERS.IDX_SELECTED_VIEW);
  const [selectedResourceURI, setSelectedResourceURI] = useState<string>(searchParams.get("resource") as string);
  const [selectedOwlProperty, setSelectedOwlProperty] = useState<string>('');
  const [owlProperties, setOwlProperties] = useState<any>([]);
  const [colorsToDataSources, setColorsToDataSources] = useState<any>({})
  const estaEmPortugues = global_context.language == 'pt'
  const [linksSameAs, setLinksSameAs] = useState<any[]>([])



  /** Carrega os links sameas do recurso selecionado*/
  async function loadSameAs() {
    try {
      if (global_context.resourceURI) {
        const response = await api.get(`/sameas/?resourceURI=${encodeURIComponent(global_context.resourceURI)}`)
        setLinksSameAs(response.data)
        return response.data
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  function getLabelOfResource(instants: any) {
    if (instants) {
      const firstKey = Object.keys(instants)[0]
      const firstValue = Object.keys(instants).length > 0 ? instants[firstKey][0] : estaEmPortugues ? {
        "label": { "value": "sem histórico" }
      } : {
        "label": { "value": "no timeline" }
      }
      setLabelOfResource(firstValue.label.value)
    }
  }

  function putBackgroundColorInCardByDataSource(instants: any) {
    let _colorsToDataSources = {} as any
    let count = -1
    Object.keys(instants).forEach((inst) => {
      let source = getContextFromURI(inst)
      if (_colorsToDataSources[source] == false || _colorsToDataSources[source] == undefined) {
        count += 1
        _colorsToDataSources[source] = COLORS.TO_DATA_SOURCES_IN_UNIFICATION_VIEW[count]
      }
    })
    setColorsToDataSources(_colorsToDataSources)
  }


  function getOwlProperties(instants: any) {
    let _owlProps: any = {}
    Object.keys(instants).forEach((inst: any) => {
      instants[inst].forEach((ins: any) => {
        if (_owlProps[ins.property.value] == undefined) {
          _owlProps[ins.property.value] = ins.propertyRDF.value
        }
      })
    })
    setOwlProperties(_owlProps)
  }

  // async function loadTimeline(resourceURI: string) {
  async function loadSameAsAndTimeline() {
    let response: any
    try {
      setIsLoading(true)
      await loadSameAs()
      response = await api.get(`/timeline/?resourceURI=${global_context.resourceURI}&owlProperty=${selectedOwlProperty}`)
      setIsLoading(false)
      setInstants(response.data)
      getLabelOfResource(response.data)
      getOwlProperties(response.data)
    } catch (error) {
      console.log(`ERROR`, error);
    } finally {
      window.scrollTo(0, 0)
    }
  }


  async function loadSameAsAndTimelineOfSelectedResourceInUnificationView() {
    let response: any
    try {
      setIsLoading(true)
      let sameas: any[] = await loadSameAs()
      response = await api.post(`/timeline/unification?owlProperty=${selectedOwlProperty}`, { resources: sameas.map((same) => same.sameas.value) })
      setIsLoading(false)
      setInstants(response.data)
      getLabelOfResource(response.data)
      putBackgroundColorInCardByDataSource(response.data)
      getOwlProperties(response.data)
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  async function loadOnlyTimelineOfSelectedResourceInUnificationView() {
    let response: any
    try {
      setIsLoading(true)
      response = await api.post(`/timeline/unification?owlProperty=${selectedOwlProperty}`, { resources: linksSameAs.map((same) => same.sameas.value) })
      setIsLoading(false)
      setInstants(response.data)
      getLabelOfResource(response.data)
      putBackgroundColorInCardByDataSource(response.data)
      getOwlProperties(response.data)
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  async function loadOnlyTimeline() {
    let response: any
    try {
      setIsLoading(true)
      response = await api.get(`/timeline/?resourceURI=${global_context.resourceURI}&owlProperty=${selectedOwlProperty}`)
      setIsLoading(false)
      setInstants(response.data)
      getLabelOfResource(response.data)
      getOwlProperties(response.data)
    } catch (error) {
      console.log(`ERROR`, error);
    } finally {
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) {
      if (global_context.view == NUMBERS.CODE_OF_UNIFICATION_VIEW || selectedIndex == NUMBERS.IDX_UNIFICATION_VIEW) {
        loadSameAsAndTimelineOfSelectedResourceInUnificationView()
        setSelectedIndex(NUMBERS.IDX_UNIFICATION_VIEW)
      } else {
        loadSameAsAndTimeline()
        setSelectedIndex(0)
      }
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [])

  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) {
      if (global_context.view == NUMBERS.CODE_OF_UNIFICATION_VIEW) { /**-2 = Visão de Unificação */
        loadOnlyTimelineOfSelectedResourceInUnificationView()
      }
      else if (global_context.view == NUMBERS.CODE_OF_EXPORTED_VIEW) {
        loadOnlyTimeline()
      }
      window.scrollTo(0, 0)
    }
  }, [selectedIndex, selectedOwlProperty])



  const handleSelectedContextClick = (index: Number, contextoSelecionado: string) => {
    setSelectedIndex(index);
    dispatch(updasteResourceURI(contextoSelecionado))
    if (index == NUMBERS.IDX_UNIFICATION_VIEW) {
      dispatch(updateView(NUMBERS.CODE_OF_UNIFICATION_VIEW))
    } else {
      dispatch(updateView(NUMBERS.CODE_OF_EXPORTED_VIEW))
    }
    navigate(`${ROUTES.TIMELINE_RESOURCE}=${encodeURIComponent(contextoSelecionado)}`)
  };


  const handleSelectedOwlProperty = (event: SelectChangeEvent) => {
    setSelectedOwlProperty(event.target.value as string)
  };

  return (
    <div className={stylesGlobal.container}>
      <Grid container spacing={0}>
        <Grid item xs={6.5} sx={{ bgcolor: null }}>
          <TitleOfTimeline
            title={estaEmPortugues ? "Histórico do recurso" : "Timeline of Resource"}
            hasButtonBack
          />
        </Grid>

        <Grid item xs={3} sx={{ bgcolor: null, display: 'flex', justifyContent: 'flex-end', alignContent: 'flex-end', paddingRight: 1 }}>
          <FormControl sx={{ m: 0, minWidth: 300 }} size="small">
            <InputLabel id="demo-simple-select-label">{estaEmPortugues ? "Filtrar Propriedade" : "Filter by Property"}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedOwlProperty}
              label="Filtrar Propriedade"
              onChange={handleSelectedOwlProperty}
            >
              {selectedOwlProperty && <MenuItem value={''}><em>{estaEmPortugues ? "limpar filtro" : "clean filter"}</em></MenuItem>}
              {Object.keys(owlProperties).map((_key: any, idx: Key) => <MenuItem key={idx} value={owlProperties[_key]}>{_key}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2.5}></Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        { /** LABEL DO RECURSO */
          <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={{ background: COLORS.CINZA_01, padding: "0px 10px 0px 10px" }}>

                <h3>{labelOfResource}</h3>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  {global_context.resourceURI}
                </Typography>
              </div>

            </Grid>
            <Grid item sm={2.5}>
              <div style={{ background: COLORS.CINZA_02, padding: "0px 10px 0px 10px" }}>
                <h3>{estaEmPortugues ? "Menu de Contexto" : "Context Menu"}</h3>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  .
                </Typography>
              </div>
            </Grid>
          </Grid>
        }
        {

          !isLoading && <Grid container spacing={1}>
            {/* LISTA DOS INSTANTS (LADO ESQUERDO) */}
            <Grid item sm={9.5}>
              <Timeline position="alternate-reverse">
                {
                  Object.keys(instants).length > 0 ? Object.keys(instants).map((instant: string, idx: Key) => {
                    return <TimelineItem key={idx}>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot
                          variant={`${selectedIndex == NUMBERS.IDX_UNIFICATION_VIEW ? "filled" : "outlined"}`}
                          color={`${selectedIndex == NUMBERS.IDX_UNIFICATION_VIEW ? "info" : "grey"}`}
                        >
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '8px', px: 2 }}>
                        <Card key={idx} sx={{ padding: 1 }}>
                          <InstantComponent instant={instant} />
                          {
                            selectedIndex == NUMBERS.IDX_UNIFICATION_VIEW
                              ? <Chip
                                label={getContextFromURI(instant)}
                                size="small"
                                style={{
                                  backgroundColor: colorsToDataSources[getContextFromURI(instant)],
                                  fontSize: "0.60rem",
                                  marginLeft: '1rem'
                                }} />
                              : false
                          }
                          {
                            instants[instant].map((update: any, _idx: Key) => {
                              return <Stack key={_idx} direction={"row"} spacing={1} textAlign={'center'}>
                                <Typography variant="caption" component="div" color="gray">
                                  {update.property.value}
                                </Typography>
                                <Typography color={'secondary'} variant="caption">{update.va.value}</Typography>
                                <ArrowRight size={12} />
                                <Typography color="primary" variant="caption">{update.vn.value}</Typography>
                              </Stack>

                            })
                          }
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  })
                    : <Typography variant="caption" component="div" color="gray">
                      {estaEmPortugues ? "Nada para mostrar" : "Nothing to show"}
                    </Typography>

                }
              </Timeline>
            </Grid>

            {/* MENU DE CONTEXTOS (PAINEL DIREITO) */}
            <Grid item sm={2.5}>
              {
                linksSameAs.length > 1
                  ? <List sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    padding: 0
                  }}>
                    <ListItem key={NUMBERS.IDX_UNIFICATION_VIEW} disablePadding>
                      <ListItemButton
                        sx={{ bgcolor: selectedIndex === NUMBERS.IDX_UNIFICATION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                        selected={selectedIndex === NUMBERS.IDX_UNIFICATION_VIEW}
                        onClick={() => handleSelectedContextClick(NUMBERS.IDX_UNIFICATION_VIEW, linksSameAs[0].sameas.value)}
                      >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                          <LinkIcon size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                        </ListItemIcon>
                        <ListItemText primary={"Visão de Unificação"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                      </ListItemButton>
                    </ListItem>


                    {
                      linksSameAs.map((row: any, idx: Key) => {
                        const _sameas_context = getContextFromURI(row.sameas.value)
                        return (
                          <ListItem key={idx} disablePadding>
                            <ListItemButton
                              selected={selectedIndex === idx}
                              onClick={() => handleSelectedContextClick(idx as Number, row.sameas.value)}
                              sx={{ bgcolor: selectedIndex === idx ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                            >
                              <ListItemIcon sx={{ minWidth: '30px' }}>
                                <Database size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                              </ListItemIcon>
                              <ListItemText primary={estaEmPortugues ? 'VSE ' + _sameas_context : 'ESV ' + _sameas_context} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                            </ListItemButton>
                          </ListItem>
                        )
                      })
                    }

                  </List>
                  : false
              }
              <List>
                <ListItem key={-5} disablePadding>
                  <ListItemButton
                    href={`http://localhost:7200/graphs-visualizations?uri=${encodeURI(Object.keys(instants)[0])}${NUMBERS.GRAPHDB_BROWSER_CONFIG}&embedded`}
                    target='_blank'
                    selected={selectedIndex === -5}
                    sx={{ bgcolor: selectedIndex === -5 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={estaEmPortugues ? 'Visão Gráfica' : 'Graphical View'} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        }
      </Box>
    </div >
  )
}