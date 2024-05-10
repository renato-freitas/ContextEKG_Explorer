import React, { useState, useEffect, useContext, Key } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Asterisk, ClockCounterClockwise, Link as LinkIcon } from 'phosphor-react';
import { LinkSimpleBreak, Graph } from '@phosphor-icons/react';

import { MHeader } from '../../components/MHeader';
import { api } from "../../services/api";
import { LoadingContext } from "../../App";
import { getPropertyFromURI, double_encode_uri, getContextFromURI, getIdentifierFromURI } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { COLORS, NUMBERS, ROUTES } from '../../commons/constants';

import stylesGlobal from '../../styles/global.module.css';
const HAS_LABEL = 1
const HAS_PROVENANCE = 2
const HAS_DIVERGENCY = 3

export interface stateProps {
  resourceURI: string;
  contextos: {}
}
export function Properties() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [uriOfselectedResource, setUriOfSelectedResource] = useState<string>("");
  const [properties, setProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  const [instants, setInstants] = useState<any[]>([] as any[])
  const [agroupedProperties, setAgroupedProperties] = useState<any>({});
  const [contextos, setContextos] = useState<any>({})
  const [selectedIndex, setSelectedIndex] = useState<Number>(-1);
  let auxLabelOfClasses = [] as string[];


  async function loadPropertiesOfSelectedResource(uri: string) {
    let response: any
    try {
      setIsLoading(true)
      setProperties([])
      let _uri = double_encode_uri(uri);
      response = await api.get(`/properties/?resourceURI=${_uri}`)
      console.log('props', response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setTimeout(() => {
        setAgroupedProperties(response.data)
        setIsLoading(false)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  async function loadSameAs(uri: string) {
    try {
      if (uri) {
        setProperties([])
        let _uri = double_encode_uri(uri);
        const response = await api.get(`/links/?sameas=${_uri}`)
        console.log(`RECURSOS SAMEAS QUE VÃO PARA O MENU DE CONTEXTO`, response.data)
        setContextos(response.data)
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  }

  async function loadUnification(object: any) {
    let response: any
    try {
      setIsLoading(true)
      setProperties([])
      response = await api.post(`/properties/unification/`, { resources: object })
      console.log('PROPRIEDADES UNIFICADAS', response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setTimeout(() => {
        setAgroupedProperties(response.data)
        setIsLoading(false)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  // const [timelineURI, setTimelineURI] = useState<string>(agroupedProperties["http://www.arida.ufc.br/ontologies/timeline#has_timeline"]);
  async function loadTimeline() {
    let response: any
    try {
      const timelineURI = agroupedProperties["http://www.arida.ufc.br/ontologies/timeline#has_timeline"][0][0]
      console.log('-----', timelineURI)
      setIsLoading(true)
      // console.log(`label to search: ${labelToSearch}`)
      // console.log(`página atual: ${newPage}`)
      // let uri = double_encode_uri(contextClassRDF.classURI.value)
      // let uri = props.agroupedProperties["http://www.arida.ufc.br/ontologies/timeline#has_timeline"] || ""
      response = await api.get(`/timeline/?resourceURI=${timelineURI}`)
      console.log('*** TIMELINE -', response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      window.scrollTo(0, 0)
      setTimeout(() => {
        setIsLoading(false)
        setInstants(response.data)
        // setPage(0)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    console.log('repositório no api.header:', _repo_in_api_header)
    if (_repo_in_api_header) {
      if (location?.state) {
        console.log('índice:', selectedIndex)
        let resource_uri = location.state as string;

        // if (resource_uri == "Visão de Unificação") {
        console.log(`recurso escolhido:`, resource_uri)
        if (selectedIndex == -2 && resource_uri.includes("/canonical")) { /**-2 = Visão de Unificação */
          loadUnification(contextos)
          setUriOfSelectedResource(resource_uri);
          // loadSameAs(resource_uri); //passar recurso origem
          loadSameAs(Object.keys(contextos)[0]); //passar recurso origem
          setSelectedIndex(-2)
        } else if (selectedIndex == -4) {
          loadTimeline()
          setSelectedIndex(-4)
        }
        else {
          setUriOfSelectedResource(resource_uri);
          loadPropertiesOfSelectedResource(resource_uri)
          loadSameAs(resource_uri);
          setSelectedIndex(-1)
        }
        window.scrollTo(0, 0)
      }
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [location?.state, selectedIndex])








  const handleSelectedContextClick = (index: Number, contextoSelecionado: string) => {
    console.log(`*** ÍNDICE DO CONTEXTO: `, index, contextoSelecionado)
    setSelectedIndex(index);
    // setSelectedContext(contextoSelecionado)
    navigate(ROUTES.PROPERTIES, { state: contextoSelecionado })
  };






  async function handleListLinkClick(event: any, uri: string) {
    event.preventDefault();
    try {
      // let _uri = double_encode_uri(uri);
      // const response = await api.get(`/resources/${_uri}`)
      // console.log(`response`, response.data)
      // navigate(ROUTES.PROPERTIES, {
      //   state: {
      //     label: { type: 'literal', value: 'teste' },
      //     uri: { type: 'uri', value: uri },
      //   }
      // })
      navigate(ROUTES.PROPERTIES, { state: uri })
    } catch (error) {
      console.log(error)
    } finally {
      window.scrollTo(0, 0)
    }
  }


  const obtemURICanonica = (uri: string) => {
    let uri_separada = uri.split("resource")
    let uri_canonica = uri_separada[0] + "resource/canonical/" + getIdentifierFromURI(uri)
    return uri_canonica
  }


  return (
    <div className={stylesGlobal.container}>
      <MHeader
        title={`Propriedades do recurso`}
        hasButtonBack
      />

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        {
          /** LABEL DO RECURSO */
          !isLoading && Object.keys(agroupedProperties).length > 0 && <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={{ background: COLORS.CINZA_01, padding: "0px 10px 0px 10px" }}>
                {/* <h3>{agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"]?.length == 1 ?
                  agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"] :
                  agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"][0][0]}
                </h3> */}
                <h3>{agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"]}</h3>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  {uriOfselectedResource}
                </Typography>
              </div>

            </Grid>
            <Grid item sm={2.5}>
              <div style={{ background: COLORS.CINZA_02, padding: "0px 10px 0px 10px" }}>
                <h4>Contexto</h4>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  Menu
                </Typography>
              </div>
            </Grid>
          </Grid>
        }

        {!isLoading && <Grid container spacing={1}>
          {/* LISTA DAS PROPRIEDADES DO RECURSO (LADO ESQUERDO) */}
          <Grid item sm={9.5}>
            {selectedIndex != -4
              ? Object.keys(agroupedProperties).length > 0 && <Box sx={{ width: "100%" }}>
                <Paper sx={{ background: "None" }} elevation={0}>
                  <List sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    // padding: 1
                  }}>
                    <Stack direction={"row"} spacing={1} key={-1}>
                      <ListItem key={-1}>
                        <Grid container spacing={2}>
                          <Grid item sm={2}>
                            <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                              Tipo
                            </Typography>
                          </Grid>
                          <Grid item sm={10}>
                            <Stack direction={'row'} spacing={1} padding={"0 20px"}>
                              { /** CHIP DAS CLASSES DISTINTAS  */
                                Object.keys(agroupedProperties).length > 0 ? agroupedProperties["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"].map((arrayOfValues: any, idx: React.Key) => {
                                  if (!auxLabelOfClasses.includes(arrayOfValues[0])) {
                                    auxLabelOfClasses.push(arrayOfValues[0])
                                    return <Chip
                                      key={idx}
                                      label={getPropertyFromURI(arrayOfValues[0])}
                                      sx={{ bgcolor: "#1976d2", color: "#fff" }} />
                                  }
                                })
                                  : false
                              }
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                    </Stack>
                    {
                      Object.keys(agroupedProperties).map((propOfResource, idx) => {
                        // console.log('**** PROP *** ', prop)
                        // return <Stack direction={"row"} spacing={1} key={idx + prop} bgcolor={`${idx%2!=0 ? "#f5f5f5" : false}`}>
                        return <Stack direction={"row"} spacing={1} key={idx + propOfResource}>
                          { // LABEL DAS PROPRIEDADES
                            (propOfResource != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
                              propOfResource != "http://www.w3.org/2000/01/rdf-schema#label" &&
                              propOfResource != "http://www.bigdatafortaleza.com/ontology#uri" &&
                              propOfResource != "http://purl.org/dc/elements/1.1/identifier" &&
                              propOfResource != "http://www.arida.ufc.br/ontologies/timeline#has_timeline") && <ListItem key={idx + propOfResource}>
                              <Grid container spacing={0}>
                                <Grid item sm={2}>
                                  <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                                    {agroupedProperties[propOfResource][0][HAS_LABEL] == "" ? getPropertyFromURI(propOfResource) : agroupedProperties[propOfResource][0][HAS_LABEL]}
                                  </Typography>
                                </Grid>
                                <Grid item sm={10}>
                                  <Stack direction={"column"} key={idx}>
                                    { /** VALORES DAS PROPRIEDADES */
                                      agroupedProperties[propOfResource].map((values: any, i: React.Key) => {
                                        // console.log('*****------****', values)
                                        return <Stack key={i} direction={'row'} gap={1} justifyContent="flex-start"
                                          alignItems="center" padding={"0 20px"}>
                                          { /** values[0] contém o valor literal da propriedade */
                                            values[0].toLowerCase().includes("http://")
                                              ? <><Link
                                                align='left'
                                                underline="none"
                                                component="button"
                                                variant='caption'
                                                onClick={(e) => handleListLinkClick(e, values[0])}>
                                                . {values[0]}
                                              </Link>
                                                <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.68rem" }} color="text.secondary" gutterBottom>
                                                  {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                                  {values[HAS_PROVENANCE]}
                                                </Typography>
                                              </>
                                              : <><Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                                . {values[0]}
                                              </Typography>
                                                <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.68rem" }} color="text.secondary" gutterBottom>
                                                  {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                                  {values[HAS_PROVENANCE]}
                                                </Typography>
                                                <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.40rem" }} color="text.secondary" gutterBottom>
                                                  {/* values[2] == true siginifica que há divergência nos valores da propriedade */}
                                                  {values[HAS_DIVERGENCY] == true && <Chip label="divergência" size="small" icon={<Asterisk size={12} color='#ed0215' />} style={{ backgroundColor: '#d7c84b22', fontSize: "0.60rem" }} />}
                                                </Typography>
                                              </>
                                          }
                                        </Stack>
                                      })
                                    }
                                  </Stack>
                                </Grid>
                              </Grid>
                            </ListItem>
                          }
                        </Stack>
                      })
                    }
                  </List >
                </Paper>
              </Box>
              : false
              // <TimelineView instants={instants} />
            }
          </Grid>

          {/* MENU DE CONTEXTOS (LADO DIREITO) */}
          <Grid item sm={2.5}>
            {
              Object.keys(contextos).length > 0 ? <List sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                padding: 0
              }}>
                {
                  agroupedProperties["http://www.arida.ufc.br/ontologies/timeline#has_timeline"] && <ListItem key={-4} disablePadding>
                    <ListItemButton
                      selected={selectedIndex === -4}
                      // onClick={() => handleSelectedContextClick(-4, Object.keys(contextos)[0])}
                      onClick={() => navigate(ROUTES.TIMELINE, {
                        state: {
                          resourceURI: Object.keys(contextos)[0],
                          contextos: contextos
                        } as stateProps
                      })}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <ClockCounterClockwise size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                      </ListItemIcon>
                      <ListItemText primary={"Visão Timeline"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                    </ListItemButton>
                  </ListItem>
                }


                <ListItem key={-3} disablePadding>
                  <ListItemButton
                    disabled={true}
                    selected={selectedIndex === -3}
                    onClick={() => {
                      handleSelectedContextClick(-3, "Visão de Fusão")
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <LinkSimpleBreak size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={"Visão de Fusão"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={-2} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === -2}
                    onClick={() => handleSelectedContextClick(-2, obtemURICanonica(contextos[Object.keys(contextos)[0]][0].toString()))}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <LinkIcon size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={"Visão de Unificação"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={-1} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === -1}
                    /** Object.keys(contextos)[0] o 1ª elemento é o recurso selecionado*/
                    onClick={() => handleSelectedContextClick(-1, Object.keys(contextos)[0])}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={getContextFromURI(Object.keys(contextos)[0])} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem>
                {
                  contextos && Object.keys(contextos).map((item: any) => {
                    return contextos[item].map((same: string, idx: Key) => {
                      return (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton
                            selected={selectedIndex === idx}
                            onClick={() => handleSelectedContextClick(idx as Number, same)}
                          >
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                              <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                            </ListItemIcon>
                            <ListItemText primary={getContextFromURI(same)} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                          </ListItemButton>
                        </ListItem>
                      )
                    })
                  })
                }
              </List>
                : Object.keys(agroupedProperties).length > 0 && <Chip label='Recurso sem link "same-as"' color='warning' />
            }
          </Grid>
        </Grid>
        }
      </Box>
    </div >
  )
}