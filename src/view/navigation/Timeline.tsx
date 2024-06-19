import { useState, useEffect, useContext, Key } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { Asterisk, ClockCounterClockwise, Database, Link as LinkIcon } from 'phosphor-react';
import { LinkSimpleBreak, Graph, ArrowRight } from '@phosphor-icons/react';

import { MHeader } from "../../components/MHeader";

import { ResourceModel } from "../../models/ResourceModel";
import { ClassModel } from "../../models/ClassModel";

import { LoadingContext, ClassRDFContext } from "../../App";
import { double_encode_uri, getContextFromURI, getDateFromInstantTimelin, getPropertyFromURI } from "../../commons/utils";

import stylesGlobal from '../../styles/global.module.css';
import { COLORS, NUMBERS, ROUTES } from "../../commons/constants";
import { api } from "../../services/api";
import { stateProps } from "./Properties";
import { Chip, StepTypeMap } from "@mui/material";
import { InstantComponent } from "./InstantComponent";


export function TimelineView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { contextClassRDF, setContextClassRDF } = useContext(ClassRDFContext);
  const [page, setPage] = useState(0);
  const [uriOfselectedResource, setUriOfSelectedResource] = useState<string>("");
  const [instants, setInstants] = useState<any>({})
  const [labelOfResource, setLabelOfResource] = useState<string>("");
  // const [contextos, setContextos] = useState<any>({})
  const [contextos, setContextos] = useState<any>([])
  const [selectedIndex, setSelectedIndex] = useState<Number>(NUMBERS.IDX_SELECTED_VIEW);
  const [selectedContext, setSelectedContext] = useState<string>();
  const [colorsToDataSources, setColorsToDataSources] = useState<any>({})
  // const [selectedLanguage, setSelectedLanguage] = useState(window.localStorage.getItem('LANGUAGE'));
  const estaEmPortugues = window.localStorage.getItem('LANGUAGE') == 'pt'
  const [linksSameAs, setLinksSameAs] = useState<any[]>([])


  /** Carrega os links sameas do recurso selecionado*/
  async function loadSameAs(uri: string) {
    try {
      if (uri) {
        let _uri = double_encode_uri(uri);
        const response = await api.get(`/sameas/?resourceURI=${_uri}`)
        console.log('-------links sameas-----\n', response.data)
        setLinksSameAs(response.data)
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  }

  function getLabelOfResource(instants: any) {
    const firstKey = Object.keys(instants)[0]
    const firstValue = instants[firstKey][0]
    console.log('FV', firstValue.label.value)
    setLabelOfResource(firstValue.label.value)

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

  async function loadTimeline(resourceURI: string) {
    let response: any
    try {
      setIsLoading(true)
      setUriOfSelectedResource(resourceURI)
      response = await api.get(`/timeline/?resourceURI=${resourceURI}`)
      console.log('*** TIMELINE -', response.data)
      getLabelOfResource(response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      window.scrollTo(0, 0)
      setTimeout(() => {
        setIsLoading(false)
        setInstants(response.data)

      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }


  async function loadTimelineUnification() {
    let response: any
    try {
      // console.log('**** TIMELINE UNIFICATION ****', object)
      setIsLoading(true)
      // setProperties([])
      response = await api.post("/timeline/unification/", { resources: linksSameAs.map((same) => same.sameas.value) })
      console.log('RESPONSE', response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setTimeout(() => {
        // setAgroupedProperties(response.data)
        setInstants(response.data)
        putBackgroundColorInCardByDataSource(response.data)
        setIsLoading(false)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
      if (location?.state) {
        let { resourceURI } = location.state as stateProps;
        console.log('R', resourceURI)
        loadSameAs(resourceURI)
        setSelectedIndex(0)
      }
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [])

  useEffect(() => {
    if (location?.state) {
      console.log('STATE', location.state)
      let { resourceURI } = location.state as stateProps
      if (selectedIndex == NUMBERS.IDX_UNIFICATION_VIEW) { /**-2 = Visão de Unificação */
        loadTimelineUnification()
      } else {
        loadTimeline(resourceURI)
        // setContextos(contextos)
        // setLinksSameAs(linksSameAs)
      }
    }
    window.scrollTo(0, 0)
  }, [location.state])


  const handleSelectedContextClick = (index: Number, contextoSelecionado: string) => {
    // console.log(`*** ÍNDICE DO CONTEXTO: `, index, contextoSelecionado)
    setSelectedIndex(index);
    // setSelectedContext(contextoSelecionado)
    navigate(ROUTES.TIMELINE, {
      state: {
        resourceURI: contextoSelecionado,
        // contextos: contextos
      }
    })
  };

  return (
    <div className={stylesGlobal.container}>

      <MHeader
        title={estaEmPortugues ? "Linha do Tempo do recurso" : "Timeline of Resource"}
        hasButtonBack
        // buttonBackNavigateTo={ROUTES.PROPERTIES}
        // state={{
        //   state: {
        //     resource_uri: linksSameAs.length > 0 ? linksSameAs[0].sameas.value : "",
        //     typeOfClass: `${selectedIndex == NUMBERS.IDX_UNIFICATION_VIEW ? "0" : "1"}`
        //   }
        // }}
      />

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        { /** LABEL DO RECURSO */
          <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={{ background: COLORS.CINZA_01, padding: "0px 10px 0px 10px" }}>

                <h3>{labelOfResource}</h3>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  {uriOfselectedResource}
                </Typography>
              </div>

            </Grid>
            <Grid item sm={2.5}>
              <div style={{ background: COLORS.CINZA_02, padding: "0px 10px 0px 10px" }}>
                <h3>{estaEmPortugues ? "Contexto" : "Context"}</h3>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  Menu
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
                  Object.keys(instants).map((instant: string, idx: Key) => {
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
                        {/* <Card key={idx} sx={{ padding: 1, background:`${selectedIndex == NUMBERS.IDX_UNIFICATION_VIEW ? colorsToDataSources[getContextFromURI(instant)] : false}` }}> */}
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
                          {/* </Stack> */}
                          {
                            instants[instant].map((update: any, _idx: Key) => {
                              return <Stack key={_idx} direction={"row"} spacing={1} textAlign={'center'}>
                                <Typography variant="caption" component="div" color="gray">{update.property.value}:</Typography>
                                {/* <Stack direction={"row"} alignItems={'center'} spacing={1}> */}
                                <Typography color={'secondary'} variant="caption">{update.va.value}</Typography>
                                {/* <Typography color={'GrayText'} variant="caption"><span>&rarr;</span></Typography> */}
                                <ArrowRight size={12} />
                                <Typography color="primary" variant="caption">{update.vn.value}</Typography>
                                {/* </Stack> */}
                              </Stack>

                            })
                          }
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  })
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
                        console.log('--', row)
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
            </Grid>
          </Grid>
        }
      </Box>
    </div >
  )
}