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
import { Asterisk, ClockCounterClockwise, Link as LinkIcon, Circle, ArrowSquareOut } from 'phosphor-react';
import { LinkSimpleBreak, Graph } from '@phosphor-icons/react';

import { MHeader } from '../../components/MHeader';
import { api } from "../../services/api";
import { LoadingContext } from "../../App";
import { getPropertyFromURI, double_encode_uri, getContextFromURI, getIdentifierFromURI } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { COLORS, EKG_CONTEXT_VOCABULARY, NUMBERS, ROUTES } from '../../commons/constants';

import stylesGlobal from '../../styles/global.module.css';
const HAS_LABEL = 1
const HAS_PROVENANCE = 2
const HAS_DIVERGENCY = 3

// https://medium.com/@lucas_pinheiro/como-adicionar-internacionaliza%C3%A7%C3%A3o-i18n-na-sua-aplica%C3%A7%C3%A3o-react-a1ac4aea109d

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
  const [linkedData, setLinkedData] = useState<any>({});
  const [contextos, setContextos] = useState<any>({})
  const [selectedIndex, setSelectedIndex] = useState<Number | undefined>(undefined);
  const [typeOfSelectedClass, setTypeOfSelectedClass] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState(window.localStorage.getItem('LANGUAGE'));
  let auxLabelOfClasses = [] as string[];


  async function loadPropertiesOfSelectedResource(uri: string) {
    let response: any
    try {
      setIsLoading(true)
      setProperties([])
      let _uri = double_encode_uri(uri);
      // console.log('-URI', _uri)
      response = await api.get(`/properties/?resourceURI=${_uri}`)
      // console.log('props', response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setTimeout(() => {
        setAgroupedProperties(response.data)
        setIsLoading(false)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  /** Carrega os links semas e as propriedade unificadas se for uma classe de Generealização */
  async function loadSameAs(uri: string, typeOfClass: string) {
    try {
      if (uri) {
        setProperties([])
        let _uri = double_encode_uri(uri);
        const response = await api.get(`/links/?sameas=${_uri}`)
        console.log('===LOAD SAMEAS===\n', response.data)

        if (Object.keys(contextos).length == 0) setContextos(response.data)

        if (typeOfClass == NUMBERS.GENERALIZATION_CLASS_NUMBER) {
          loadUnification(response.data)
        }
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
      console.log('====PROPRIEDADES UNIFICADAS===', response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setTimeout(() => {
        setAgroupedProperties(response.data)
        setIsLoading(false)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }



  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
      if (location?.state) {
        let { resource_uri, typeOfClass } = location.state as any;
        setTypeOfSelectedClass(typeOfClass)
        if (typeOfClass == NUMBERS.GENERALIZATION_CLASS_NUMBER) {
          setSelectedIndex(NUMBERS.IDX_UNIFICATION_VIEW)
          setUriOfSelectedResource(obtemURICanonica(resource_uri));

          // NÃO CARREGAR NOVAMENTE A LISTA DE CONTEXTOS (EXPORTED VIEW)
          if (Object.keys(contextos).length == 0) loadSameAs(resource_uri, typeOfClass);
        } else if (typeOfClass == NUMBERS.EXPORTED_CLASS_NUMBER) {
          setSelectedIndex(selectedIndex)
        }
        else {
          /** QUANDO CLICAR EM UM LINK HREF */
          // setSelectedIndex(-1)
          // setUriOfSelectedResource(resource_uri);
          // loadPropertiesOfSelectedResource(resource_uri)
          // loadSameAs(resource_uri, typeOfClass)
        }
        window.scrollTo(0, 0)
      }
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [location?.state])



  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) {
      if (location?.state) {
        let { resource_uri, typeOfClass } = location.state as any;
        setTypeOfSelectedClass(typeOfClass)
        if (typeOfClass != NUMBERS.GENERALIZATION_CLASS_NUMBER) {
          console.log('INDEX NÃO É UNIFICAÇÃO', selectedIndex)
          loadPropertiesOfSelectedResource(resource_uri)
          setUriOfSelectedResource(resource_uri);
          // loadSameAs(resource_uri, typeOfClass);
          // NÃO CARREGAR NOVAMENTE A LISTA DE CONTEXTOS (EXPORTED VIEW)
          if (Object.keys(contextos).length == 0) loadSameAs(resource_uri, typeOfClass);
        } else if (typeOfClass == NUMBERS.GENERALIZATION_CLASS_NUMBER) {
          console.log('É UNIFICAÇÃO', selectedIndex)
          // setSelectedIndex(NUMBERS.IDX_UNIFICATION_VIEW)
          setUriOfSelectedResource(obtemURICanonica(resource_uri));
          // loadUnification(selectedCon)
          // NÃO CARREGAR NOVAMENTE A LISTA DE CONTEXTOS (EXPORTED VIEW)
          loadSameAs(resource_uri, typeOfClass);
          // if (Object.keys(contextos).length == 0) loadSameAs(resource_uri, typeOfClass);
        }
        // window.scrollTo(0, 0)
      }
    }
  }, [selectedIndex])



  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) {
      let { link, index } = linkedData;
      if (link) {
        setContextos({})
        if (index == NUMBERS.IDX_UNIFICATION_VIEW) {
          console.log('===IF====\n')
          setTypeOfSelectedClass(NUMBERS.GENERALIZATION_CLASS_NUMBER)
          setUriOfSelectedResource(link);
          loadSameAs(link, NUMBERS.GENERALIZATION_CLASS_NUMBER)
        } else {
          console.log('===ELSE====\n')
          loadPropertiesOfSelectedResource(link)
          loadSameAs(link, NUMBERS.EXPORTED_CLASS_NUMBER)
        }
      }
    }
    /**linkedata é para o objectProperties */
  }, [linkedData])

  const estaEmPortugues = selectedLanguage == 'pt'
  // const ehVisaoExportada = (index: Number) => index != NUMBERS.IDX_UNIFICATION_VIEW && index != NUMBERS.IDX_FUSION_VIEW
  const ehVisaoExportada = (index: Number) => index != NUMBERS.IDX_UNIFICATION_VIEW

  const handleSelectedContextClick = (index: Number, contextoSelecionado: string) => {
    console.log(`*** ÍNDICE DO CONTEXTO: `, index, contextoSelecionado)
    setSelectedIndex(index);
    if (ehVisaoExportada(index)) {
      navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: "1" } })
    }
    else {
      navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: "0" } })
    }
  };





  /** Clicar em um ObjectProperty */
  async function handleListLinkClick(event: any, uri: string) {
    // event.preventDefault();
    try {
      console.log('===URI DO LINK===', uri)
      setLinkedData({ link: uri, index: selectedIndex })
      // navigate(ROUTES.PROPERTIES, { state: { resource_uri: uri, typeOfClass: "1" } })
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
        title={estaEmPortugues ? `Propriedades do recurso` : "Properties of Resource"}
        hasButtonBack
      />

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        {
          /** LABEL DO RECURSO */
          !isLoading && Object.keys(agroupedProperties).length > 0 && <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={{ background: COLORS.CINZA_01, padding: "0px 10px 0px 10px" }}>
                <h3>
                  {
                    typeOfSelectedClass == NUMBERS.GENERALIZATION_CLASS_NUMBER
                      ? agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"][0][0]
                      : agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"]
                  }
                </h3>
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

        {!isLoading && <Grid container spacing={1}>
          {/* LISTA DAS PROPRIEDADES DO RECURSO (PAINEL ESQUERDO) */}
          <Grid item sm={9.5}>
            {selectedIndex != -4
              ? Object.keys(agroupedProperties).length > 0 && <Box sx={{ width: "100%" }}>
                <Paper sx={{ background: "None" }} elevation={0}>
                  <List sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                  }}>
                    {/* CLASSES DISTINTAS */}
                    <ListItem key={-2}>
                      <Grid container spacing={2}>
                        <Grid item sm={2}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "end" }} color="text.primary" gutterBottom>
                            {window.localStorage.getItem('LANGUAGE') == 'en' ? 'type' : 'tipo'}
                          </Typography>
                        </Grid>
                        <Grid item sm={10}>
                          <Stack direction={'row'} spacing={1} justifyContent={'flex-start'} alignItems={"center"}
                            textAlign={'justify'}>
                            {
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
                      {/* </Stack> */}
                    </ListItem>

                    {/* DESCRIÇÃO OU COMENTÁRIO */}
                    {
                      Object.keys(agroupedProperties).map((propOfResource, idx) => {
                        return (propOfResource == EKG_CONTEXT_VOCABULARY.PROPERTY.DC_DESCRIPTION ||
                          propOfResource == EKG_CONTEXT_VOCABULARY.PROPERTY.DCTERMS_DESCRIPTION ||
                          propOfResource == EKG_CONTEXT_VOCABULARY.PROPERTY.COMMENT) &&
                          <ListItem key={-1}>
                            <Grid container spacing={2}>

                              <Grid item sm={2}>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "end" }} color="text.primary" gutterBottom>
                                  {window.localStorage.getItem('LANGUAGE') == 'en' ? 'description' : 'descrição'}
                                </Typography>
                              </Grid>

                              <Grid item sm={10}>
                                {
                                  agroupedProperties[propOfResource].map((values: any, i: React.Key) => {
                                    return <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={"center"}
                                      textAlign={'justify'}>
                                      <Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                        <Circle size={7} weight="fill" /> {values[0]}
                                      </Typography>
                                      <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.68rem" }} color="text.secondary" gutterBottom>
                                        {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                        {values[HAS_PROVENANCE]}
                                      </Typography>
                                    </Stack>
                                  })
                                }

                              </Grid>
                            </Grid>
                          </ListItem>
                      })
                    }

                    {/* DEMAIS PROPRIEDADES */}
                    {
                      Object.keys(agroupedProperties).map((propOfResource, idx) => {
                        return (propOfResource != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
                          propOfResource != "http://www.w3.org/2000/01/rdf-schema#label" &&
                          propOfResource != "http://www.bigdatafortaleza.com/ontology#uri" &&
                          propOfResource != "http://purl.org/dc/elements/1.1/identifier" &&
                          propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.DC_DESCRIPTION &&
                          propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.COMMENT &&
                          propOfResource != "http://www.arida.ufc.br/ontologies/timeline#has_timeline") &&
                          <ListItem key={idx + propOfResource}>
                            <Grid container spacing={2}>

                              <Grid item sm={2}>
                                {/* <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom> */}
                                <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "end" }} color="text.primary" gutterBottom>
                                  {agroupedProperties[propOfResource][0][HAS_LABEL] == "" ? getPropertyFromURI(propOfResource) : agroupedProperties[propOfResource][0][HAS_LABEL]}
                                </Typography>
                              </Grid>

                              <Grid item sm={10}>
                                <Stack direction={"column"} key={idx}>
                                  { /** VALORES DAS PROPRIEDADES */
                                    agroupedProperties[propOfResource].map((values: any, i: React.Key) => {
                                      // console.log('*****------****', values)
                                      // return <Stack key={i} direction={'row'} gap={1} justifyContent="flex-start" alignItems="center" padding={"0 20px"}>
                                      return <Stack direction={'row'} spacing={1} justifyContent={'flex-start'} alignItems={"center"}
                                        textAlign={'justify'}>
                                        { /** values[0] contém o valor literal da propriedade */
                                          values[0].toLowerCase().includes("http://") && values[0].toLowerCase().includes("resource")
                                            ? <><Link
                                              align='left'
                                              underline="none"
                                              component="button"
                                              variant='caption'
                                              onClick={(e) => handleListLinkClick(e, values[0])}
                                            >
                                              <Circle size={7} weight="fill" color='#000' /> {values[0]}
                                            </Link>
                                              <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.68rem" }} color="text.secondary" gutterBottom>
                                                {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                                {values[HAS_PROVENANCE]}
                                              </Typography>
                                            </>
                                            : <><Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                              <Circle size={7} weight="fill" /> {values[0]}
                                            </Typography>
                                              {
                                                (values[0].toLowerCase().includes("http") && !values[0].toLowerCase().includes("resource")) &&
                                                <Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                                  <a href={values[0]} target='_blank'><ArrowSquareOut size={14} /></a>
                                                </Typography>
                                              }

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
                      })
                    }
                  </List >
                </Paper>
              </Box>
              : false
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
                  contextos && Object.keys(contextos).map((item: any) => {
                    return contextos[item].map((same: string, idx: Key) => {
                      // console.log('===target===', same)
                      return same.includes('resource/canonical') && (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton
                            sx={{ bgcolor: selectedIndex === NUMBERS.IDX_FUSION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                            selected={selectedIndex === NUMBERS.IDX_FUSION_VIEW}
                            onClick={() => {
                              // handleSelectedContextClick(NUMBERS.IDX_FUSION_VIEW, estaEmPortugues ? "Visão de Fusão" : "Fusion View")
                              handleSelectedContextClick(NUMBERS.IDX_FUSION_VIEW, same)
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                              <LinkSimpleBreak size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                            </ListItemIcon>
                            <ListItemText primary={estaEmPortugues ? "Visão de Fusão" : "Fusion View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                          </ListItemButton>
                        </ListItem>
                      )
                    })
                  })
                }
                {/* <ListItem key={-3} disablePadding>
                  <ListItemButton
                    sx={{ bgcolor: selectedIndex === NUMBERS.IDX_FUSION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                    selected={selectedIndex === NUMBERS.IDX_FUSION_VIEW}
                    onClick={() => {
                      handleSelectedContextClick(NUMBERS.IDX_UNIFICATION_VIEW, contextos[Object.keys(contextos)[0]][0].toString())
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <LinkSimpleBreak size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={estaEmPortugues ? "Visão de Fusão" : "Fusion View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem> */}
                <ListItem key={-2} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === NUMBERS.IDX_UNIFICATION_VIEW}
                    // onClick={() => handleSelectedContextClick(-2, obtemURICanonica(contextos[Object.keys(contextos)[0]][0].toString()))}
                    onClick={() => handleSelectedContextClick(NUMBERS.IDX_UNIFICATION_VIEW, contextos[Object.keys(contextos)[0]][0].toString())}
                    sx={{ bgcolor: selectedIndex === NUMBERS.IDX_UNIFICATION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <LinkIcon size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={estaEmPortugues ? "Visão de Unificação" : "Unification View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={-1} disablePadding>
                  <ListItemButton
                    selected={selectedIndex === -1}
                    /** Object.keys(contextos)[0] o 1ª elemento é o recurso selecionado*/
                    onClick={() => handleSelectedContextClick(-1, Object.keys(contextos)[0])}
                    sx={{ bgcolor: selectedIndex === -1 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={estaEmPortugues ? "VSE" : 'ESV ' + getContextFromURI(Object.keys(contextos)[0])} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem>
                {
                  contextos && Object.keys(contextos).map((item: any) => {
                    return contextos[item].map((same: string, idx: Key) => {
                      return !same.includes('resource/canonical') && (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton
                            selected={selectedIndex === idx}
                            onClick={() => handleSelectedContextClick(idx as Number, same)}
                            sx={{ bgcolor: selectedIndex === idx ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                          >
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                              <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                            </ListItemIcon>
                            <ListItemText primary={'ESV ' + getContextFromURI(same)} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                          </ListItemButton>
                        </ListItem>
                      )
                    })
                  })
                }
                {
                  agroupedProperties["http://www.arida.ufc.br/ontologies/timeline#has_timeline"] && <ListItem key={-4} disablePadding>
                    <ListItemButton
                      selected={selectedIndex === -4}
                      // onClick={() => handleSelectedContextClick(-4, Object.keys(contextos)[0])}
                      sx={{ bgcolor: selectedIndex === -4 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
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