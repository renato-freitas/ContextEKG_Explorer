import React, { useState, useEffect, useContext, Key, useDebugValue } from 'react';
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
import { Asterisk, ClockCounterClockwise, Link as LinkIcon, Circle, ArrowSquareOut, Database } from 'phosphor-react';
import { LinkSimpleBreak, Graph } from '@phosphor-icons/react';

import { MHeader } from '../../components/MHeader';
import { api } from "../../services/api";
import { LoadingContext } from "../../App";
import { getPropertyFromURI, double_encode_uri, getIdentifierFromURI, getContextFromURI } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { COLORS, EKG_CONTEXT_VOCABULARY, NUMBERS, ROUTES } from '../../commons/constants';

import stylesGlobal from '../../styles/global.module.css';
import styleNavigation from './navigation.module.css'
import { Divider } from '@mui/material';
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
const HAS_LABEL = 1
const HAS_PROVENANCE = 2
const HAS_DIVERGENCY = 3
const BULLET_SIZE = 4
const FONTSIZE_PROPERTY = 15
const FONTWEIGHT_PROPERTY = 450
const FONTSEZE_VALUE_PROPERTY = "0.69rem"
const WIDTH_OF_P = 2.5
const WIDTH_OF_O = 9.5

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
  const [linksSameAs, setLinksSameAs] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState<Number | undefined>(undefined);
  const [typeOfSelectedClass, setTypeOfSelectedClass] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState(window.localStorage.getItem('LANGUAGE'));
  let auxLabelOfClasses = [] as string[];
  const estaEmPortugues = selectedLanguage == 'pt'


  async function loadPropertiesOfSelectedResource(uri: string, typeOfView: string) {
    let response: any
    try {
      setIsLoading(true)
      setProperties([])
      // let _uri = double_encode_uri(uri);
      // console.log('-URI', _uri)
      response = await api.get(`/properties/?resourceURI=${uri}&typeOfView=${typeOfView}&language=${selectedLanguage}`)
      console.log('props', response.data)
      setAgroupedProperties(response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

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

  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
      if (location?.state) {
        let { resource_uri, typeOfClass } = location.state as any;
        loadSameAs(resource_uri)
      }
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [])

  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
      if (location?.state) {
        let { resource_uri, typeOfClass } = location.state as any;

        console.log('contexto selecionado: ', resource_uri, typeOfClass)
        loadPropertiesOfSelectedResource(resource_uri, typeOfClass)
        setUriOfSelectedResource(resource_uri)
        if (typeOfClass == "0") setSelectedIndex(NUMBERS.IDX_UNIFICATION_VIEW)
        window.scrollTo(0, 0)
      }
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [location?.state])




  // const ehVisaoExportada = (index: Number) => index != NUMBERS.IDX_UNIFICATION_VIEW && index != NUMBERS.IDX_FUSION_VIEW
  const ehVisaoExportada = (index: Number) => index != NUMBERS.IDX_UNIFICATION_VIEW && index != NUMBERS.IDX_FUSION_VIEW
  const ehVisaoUnificacao = (index: Number) => index == NUMBERS.IDX_UNIFICATION_VIEW

  const handleSelectedContextClick = (index: Number, contextoSelecionado: string) => {
    console.log(`*** ÍNDICE DO CONTEXTO: `, index, contextoSelecionado)
    setSelectedIndex(index);
    if (ehVisaoExportada(index)) {
      navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: "1" } })
    }
    else if (ehVisaoUnificacao(index)) {
      navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: "0" } })
    }
    else {
      console.log('-------chamando visão de fusão---------\n')
      navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: "2" } })
    }
  };





  /** Clicar em um ObjectProperty */
  async function handleListLinkClick(event: any, uri: string) {
    // event.preventDefault();
    try {
      console.log('===URI DO LINK===', uri)
      setLinkedData({ link: uri, index: selectedIndex })
      navigate(ROUTES.PROPERTIES, { state: { resource_uri: uri, typeOfClass: "1" } })
    } catch (error) {
      console.log(error)
    } finally {
      window.scrollTo(0, 0)
    }
  }


  const obtemURICanonica = (uri: string) => {
    let uri_separada = uri.split("resource")
    // console.log('uri separada', uri_separada)
    const _class = uri_separada[1].split("/")[1]
    let uri_canonica = uri_separada[0] + "resource/canonical/" + _class + "/" + getIdentifierFromURI(uri)
    return uri_canonica
  }




  return (
    <div className={stylesGlobal.container}>
      {/* essa div foi colocada para os prints dos artigos. analisar sua remoção ou ajuste */}
      <div style={{ paddingLeft: 60 }}>
        <MHeader
          title={estaEmPortugues ? `Propriedades do recurso` : "Properties of Resource"}
          hasButtonBack
        />
      </div>

      <Box sx={{ flexGrow: 1, padding: 0 }}>
        {
          /** LABEL DO RECURSO */
          !isLoading && Object.keys(agroupedProperties).length > 0 && <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={{ background: COLORS.CINZA_01, padding: "0px 10px 0px 60px" }}>
                <h3 style={{ whiteSpace: 'pre-line' }}>
                  {
                    agroupedProperties[Object.keys(agroupedProperties)[0]]["http://www.w3.org/2000/01/rdf-schema#label"] != undefined
                      ? agroupedProperties[Object.keys(agroupedProperties)[0]]["http://www.w3.org/2000/01/rdf-schema#label"][0][0]
                      : false
                  }

                </h3>
                <Typography sx={{ fontSize: 11, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  {obtemURICanonica(uriOfselectedResource)}
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
            {/* LISTA DAS PROPRIEDADES DO RECURSO (PAINEL ESQUERDO) */}
            <Grid item sm={9.5}>
              {
                selectedIndex != -4
                  ? Object.keys(agroupedProperties).length > 0 && <Box sx={{ width: "100%" }}>
                    <Paper sx={{ background: "None" }} elevation={0}>
                      <List
                        sx={{
                          width: '100%',
                          bgcolor: 'background.paper',
                          position: 'relative',
                          overflow: 'auto'
                        }}>
                        {/* CLASSES DISTINTAS */}
                        <ListItem key={-3} sx={{ pl: 0 }}>
                          <Grid container spacing={2}>
                            <Grid item sm={WIDTH_OF_P}>
                              <Typography sx={{ fontSize: FONTSIZE_PROPERTY, fontWeight: FONTWEIGHT_PROPERTY, textAlign: "end" }} color="text.primary" gutterBottom>
                                {estaEmPortugues ? 'é um' : 'is a'}
                              </Typography>
                            </Grid>
                            <Grid item sm={WIDTH_OF_O}>
                              <Stack direction={'row'} spacing={1} justifyContent={'flex-start'} alignItems={"center"}
                                textAlign={'justify'}>
                                {
                                  Object.keys(agroupedProperties).length > 0
                                    ? agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.RDF_TYPE].map((arrayOfValues: any, idx: React.Key) => {
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

                        {/* IMAGENS */}
                        {
                          agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.THUMBNAIL] != undefined
                          && <ListItem key={-2} sx={{ pt: "2px" }}>
                            <Grid container spacing={2}>
                              <Grid item sm={WIDTH_OF_P}>
                                <Typography sx={{ fontSize: FONTSIZE_PROPERTY, fontWeight: FONTWEIGHT_PROPERTY, textAlign: "end" }} color="text.primary" gutterBottom>
                                  {estaEmPortugues ? 'imagem' : 'image'}
                                </Typography>
                              </Grid>
                              <Grid item sm={WIDTH_OF_O}>
                                <Stack direction={'row'} spacing={2} justifyContent={'flex-start'} alignItems={"center"} textAlign={'justify'}>
                                  {
                                    agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.THUMBNAIL].map((fig: any, i: React.Key | null | undefined) => {
                                      return <><Box p={0} width={130} height={135} key={i}>
                                        <img src={fig[0]} alt={fig[0]} className={styleNavigation.img_in_properties}></img>
                                      </Box>
                                        <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: FONTSEZE_VALUE_PROPERTY }} color="text.secondary" gutterBottom>
                                          {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                          {fig[HAS_PROVENANCE]}
                                        </Typography>
                                      </>
                                    })
                                  }
                                </Stack>
                              </Grid >
                            </Grid>
                          </ListItem>
                        }


                        {/* DESCRIÇÃO OU COMENTÁRIO */}
                        {
                          (agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.DC_DESCRIPTION] != undefined
                            && agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.DCTERMS_DESCRIPTION] != undefined
                            && agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.COMMENT] != undefined)
                          && <ListItem key={-1}>
                            <Grid container spacing={2}>
                              <Grid item sm={WIDTH_OF_P}>
                                <Typography sx={{ fontSize: FONTSIZE_PROPERTY, fontWeight: FONTWEIGHT_PROPERTY, textAlign: "end" }} color="text.primary" gutterBottom>
                                  {estaEmPortugues ? 'descrição' : 'description'}
                                </Typography>
                              </Grid>
                              <Grid item sm={WIDTH_OF_O}>
                                {
                                  agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.DC_DESCRIPTION].concat(
                                    agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.DCTERMS_DESCRIPTION],
                                    agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.COMMENT]
                                  ).map((values: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined)[], i: React.Key) => {
                                    return values && <Stack direction={'row'} spacing={1} justifyContent={'flex-start'} alignItems={"center"}
                                      textAlign={'justify'}>
                                      <Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                        <Circle size={BULLET_SIZE} weight="fill" /> {`${values[0]}`}
                                      </Typography>
                                      <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: FONTSEZE_VALUE_PROPERTY }} color="text.secondary" gutterBottom>
                                        {values[HAS_PROVENANCE]}
                                      </Typography>
                                    </Stack>
                                  })
                                }
                              </Grid>
                            </Grid>
                          </ListItem>
                        }


                        {/* DEMAIS PROPRIEDADES */}
                        {
                          Object.keys(agroupedProperties[Object.keys(agroupedProperties)[0]]).map((propOfResource, idx) => {
                            return (propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.RDF_TYPE &&
                              propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.LABEL &&
                              propOfResource != "http://www.bigdatafortaleza.com/ontology#uri" &&
                              propOfResource != "http://purl.org/dc/elements/1.1/identifier" &&
                              propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS &&
                              propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.DC_DESCRIPTION &&
                              propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.DCTERMS_DESCRIPTION &&
                              propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.COMMENT &&
                              propOfResource != EKG_CONTEXT_VOCABULARY.PROPERTY.THUMBNAIL &&
                              propOfResource != "http://www.arida.ufc.br/ontologies/timeline#has_timeline") &&
                              <ListItem key={idx + propOfResource} sx={{ pt: "2px", pb: "1px" }}>
                                <Grid container spacing={2}>

                                  <Grid item sm={WIDTH_OF_P}>
                                    <Typography sx={{ fontSize: FONTSIZE_PROPERTY, fontWeight: FONTWEIGHT_PROPERTY, textAlign: "end" }} color="text.primary" gutterBottom>
                                      {
                                        agroupedProperties[Object.keys(agroupedProperties)[0]][propOfResource][0][HAS_LABEL] == ""
                                          ? getPropertyFromURI(propOfResource)
                                          : agroupedProperties[Object.keys(agroupedProperties)[0]][propOfResource][0][HAS_LABEL]
                                      }
                                    </Typography>
                                  </Grid>

                                  <Grid item sm={WIDTH_OF_O}>
                                    <Stack direction={"column"} key={idx}>
                                      { /** VALORES DAS PROPRIEDADES */
                                        agroupedProperties[Object.keys(agroupedProperties)[0]][propOfResource].map((values: any, i: React.Key) => {
                                          return <Stack direction={'row'} spacing={1} justifyContent={'flex-start'} alignItems={"center"}
                                            textAlign={'justify'}>
                                            { /** values[0] contém o valor literal da propriedade */
                                              values[0].toLowerCase().includes("http") &&
                                                agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS]?.every((ele: string[]) => values[0].includes(getContextFromURI(ele[0])))
                                                ? <><Link
                                                  align='left'
                                                  underline="none"
                                                  component="button"
                                                  variant='caption'
                                                  onClick={(e) => handleListLinkClick(e, values[0])}
                                                >
                                                  <Circle size={BULLET_SIZE} weight="fill" color='#000' /> {values[0]}
                                                </Link>
                                                  <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: FONTSEZE_VALUE_PROPERTY }} color="text.secondary" gutterBottom>
                                                    {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                                    {values[HAS_PROVENANCE]}
                                                  </Typography>
                                                </>
                                                : <><Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                                  <Circle size={BULLET_SIZE} weight="fill" /> {values[0]}
                                                </Typography>
                                                  {

                                                    values[0].toLowerCase().includes("http") &&
                                                    <Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                                      <a href={values[0]} target='_blank'><ArrowSquareOut size={14} /></a>
                                                    </Typography>
                                                  }

                                                  <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: FONTSEZE_VALUE_PROPERTY }} color="text.secondary" gutterBottom>
                                                    {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                                    {values[HAS_PROVENANCE]}
                                                  </Typography>
                                                  <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.50rem" }} color="text.secondary" gutterBottom>
                                                    {/* values[2] == true siginifica que há divergência nos valores da propriedade */}
                                                    {values[HAS_DIVERGENCY] == true && <Chip label={estaEmPortugues ? "divergência" : "divergence"} size="small" icon={<Asterisk size={12} color='#ed0215' />} style={{ backgroundColor: '#d7c84b22', fontSize: FONTSEZE_VALUE_PROPERTY }} />}
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
                linksSameAs.length > 1 ? <List sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  padding: 0
                }}>
                  {console.log('_::_', agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS]?.map((same: string[]) => same[0]))}
                  {
                    agroupedProperties && agroupedProperties[Object.keys(agroupedProperties)[0]]["http://www.arida.ufc.br/ontologies/timeline#has_timeline"]
                    && <ListItem key={-4} disablePadding>
                      <ListItemButton
                        selected={selectedIndex === -4}
                        sx={{ bgcolor: selectedIndex === -4 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                        onClick={() => navigate(ROUTES.TIMELINE, {
                          state: {
                            resourceURI: Object.keys(agroupedProperties)[0],
                            contextos: [Object.keys(agroupedProperties)[0]].concat(agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS]?.map((same: string[]) => same[0]))
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

                  <ListItem key={NUMBERS.IDX_FUSION_VIEW} disablePadding>
                    <ListItemButton
                      selected={selectedIndex === NUMBERS.IDX_FUSION_VIEW}
                      onClick={() => handleSelectedContextClick(NUMBERS.IDX_FUSION_VIEW, linksSameAs[0].sameas.value)}
                      sx={{ bgcolor: selectedIndex === NUMBERS.IDX_FUSION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <LinkSimpleBreak size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                      </ListItemIcon>
                      <ListItemText primary={estaEmPortugues ? "Visão de Fusão" : "Fusion View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                    </ListItemButton>
                  </ListItem>



                  <ListItem key={NUMBERS.IDX_UNIFICATION_VIEW} disablePadding>
                    <ListItemButton
                      selected={selectedIndex === NUMBERS.IDX_UNIFICATION_VIEW}
                      onClick={() => handleSelectedContextClick(NUMBERS.IDX_UNIFICATION_VIEW, linksSameAs[0].sameas.value)}
                      sx={{ bgcolor: selectedIndex === NUMBERS.IDX_UNIFICATION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <LinkIcon size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                      </ListItemIcon>
                      <ListItemText primary={estaEmPortugues ? "Visão de Unificação" : "Unification View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
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
                  : Object.keys(agroupedProperties).length > 0 && <Chip label={estaEmPortugues ? 'Recurso sem link "sameAs"' : 'No sameAs links'} color='warning' />
              }
            </Grid>

            {/* <Grid item sm={2.5}>
              {
                Object.keys(agroupedProperties).length > 0 ? <List sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  padding: 0
                }}>
                  {
                    agroupedProperties && agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS] != undefined
                    && <ListItem key={NUMBERS.IDX_FUSION_VIEW} disablePadding>
                      <ListItemButton
                        selected={selectedIndex === NUMBERS.IDX_FUSION_VIEW}
                        onClick={() => handleSelectedContextClick(NUMBERS.IDX_FUSION_VIEW, Object.keys(agroupedProperties)[0].toString())}
                        sx={{ bgcolor: selectedIndex === NUMBERS.IDX_FUSION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                      >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                          <LinkSimpleBreak size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                        </ListItemIcon>
                        <ListItemText primary={estaEmPortugues ? "Visão de Fusão" : "Fusion View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                      </ListItemButton>
                    </ListItem>
                  }


                  <ListItem key={NUMBERS.IDX_UNIFICATION_VIEW} disablePadding>
                    <ListItemButton
                      selected={selectedIndex === NUMBERS.IDX_UNIFICATION_VIEW}
                      onClick={() => handleSelectedContextClick(NUMBERS.IDX_UNIFICATION_VIEW, Object.keys(agroupedProperties)[0].toString())}
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
                      onClick={() => handleSelectedContextClick(-1, Object.keys(agroupedProperties)[0])}
                      sx={{ bgcolor: selectedIndex === -1 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <Database size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                      </ListItemIcon>
                      <ListItemText primary={estaEmPortugues ? "VSE " + getContextFromURI(Object.keys(agroupedProperties)[0]) : 'ESV ' + getContextFromURI(Object.keys(contextos)[0])} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                    </ListItemButton>
                  </ListItem>
                  {
                    agroupedProperties && agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS]?.map((same: string[], idx: Key) => {
                      const _same_context = getContextFromURI(same[0])
                      return (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton
                            selected={selectedIndex === idx}
                            onClick={() => handleSelectedContextClick(idx as Number, same[0])}
                            sx={{ bgcolor: selectedIndex === idx ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                          >
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                              <Database size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                            </ListItemIcon>
                            <ListItemText primary={estaEmPortugues ? 'VSE ' + _same_context : 'ESV ' + _same_context} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                          </ListItemButton>
                        </ListItem>
                      )
                    })
                  }


                  { console.log('_::_',agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS]?.map((same: string[]) => same[0]))}
                  {
                    agroupedProperties && agroupedProperties[Object.keys(agroupedProperties)[0]]["http://www.arida.ufc.br/ontologies/timeline#has_timeline"]
                     && <ListItem key={-4} disablePadding>
                      <ListItemButton
                        selected={selectedIndex === -4}
                        sx={{ bgcolor: selectedIndex === -4 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                        onClick={() => navigate(ROUTES.TIMELINE, {
                          state: {
                            resourceURI: Object.keys(agroupedProperties)[0],
                            contextos: [Object.keys(agroupedProperties)[0]].concat(agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS]?.map((same: string[]) => same[0])) 
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
                  : Object.keys(agroupedProperties).length > 0 && <Chip label={estaEmPortugues ? 'Recurso sem link "sameAs"' : 'No sameAs links'} color='warning' />
              }
            </Grid> */}

          </Grid> /**container 2 */
        }
      </Box>
    </div>
  )
}













// useEffect(() => {
//   const _repo_in_api_header = api.defaults.headers.common['repo']
//   if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
//     if (location?.state) {

//       let { resource_uri, typeOfClass } = location.state as any;

//       setTypeOfSelectedClass(typeOfClass)

//       loadPropertiesOfSelectedResource(resource_uri, typeOfClass)

//       if (typeOfClass == NUMBERS.GENERALIZATION_CLASS_NUMBER) {
//         setSelectedIndex(NUMBERS.IDX_UNIFICATION_VIEW)
//         setUriOfSelectedResource(obtemURICanonica(resource_uri))

//         // NÃO CARREGAR NOVAMENTE A LISTA DE CONTEXTOS (EXPORTED VIEW)
//         // if (Object.keys(contextos).length == 0) loadSameAs(resource_uri, typeOfClass);
//       } else if (typeOfClass == NUMBERS.EXPORTED_CLASS_NUMBER) {
//         setSelectedIndex(selectedIndex)
//       }
//       else {
//         /** QUANDO CLICAR EM UM LINK HREF */
//         // setSelectedIndex(-1)
//         // setUriOfSelectedResource(resource_uri);
//         // loadPropertiesOfSelectedResource(resource_uri)
//         // loadSameAs(resource_uri, typeOfClass)
//       }
//       window.scrollTo(0, 0)
//     }
//   }
//   else {
//     navigate(ROUTES.REPOSITORY_LIST)
//   }
// }, [location?.state])



// useEffect(() => {
//   const _repo_in_api_header = api.defaults.headers.common['repo']
//   if (_repo_in_api_header) {
//     if (location?.state) {
//       let { resource_uri, typeOfClass } = location.state as any;
//       setTypeOfSelectedClass(typeOfClass)
//       if (typeOfClass != NUMBERS.GENERALIZATION_CLASS_NUMBER) {
//         console.log('INDEX NÃO É UNIFICAÇÃO', selectedIndex)
//         loadPropertiesOfSelectedResource(resource_uri, typeOfClass)
//         setUriOfSelectedResource(resource_uri);
//         // loadSameAs(resource_uri, typeOfClass);
//         // NÃO CARREGAR NOVAMENTE A LISTA DE CONTEXTOS (EXPORTED VIEW)
//         if (Object.keys(contextos).length == 0) loadSameAs(resource_uri, typeOfClass);
//       } else if (typeOfClass == NUMBERS.GENERALIZATION_CLASS_NUMBER) {
//         console.log('É UNIFICAÇÃO', selectedIndex)
//         // setSelectedIndex(NUMBERS.IDX_UNIFICATION_VIEW)
//         setUriOfSelectedResource(obtemURICanonica(resource_uri));
//         // loadUnification(selectedCon)
//         // NÃO CARREGAR NOVAMENTE A LISTA DE CONTEXTOS (EXPORTED VIEW)
//         loadSameAs(resource_uri, typeOfClass);
//         // if (Object.keys(contextos).length == 0) loadSameAs(resource_uri, typeOfClass);
//       }
//       // window.scrollTo(0, 0)
//     }
//   }
// }, [selectedIndex])



// useEffect(() => {
//   const _repo_in_api_header = api.defaults.headers.common['repo']
//   if (_repo_in_api_header) {
//     let { link, index } = linkedData;
//     if (link) {
//       setContextos({})
//       if (index == NUMBERS.IDX_UNIFICATION_VIEW) {
//         console.log('===IF====\n')
//         setTypeOfSelectedClass(NUMBERS.GENERALIZATION_CLASS_NUMBER)
//         setUriOfSelectedResource(link);
//         loadSameAs(link, NUMBERS.GENERALIZATION_CLASS_NUMBER)
//       } else {
//         console.log('===ELSE====\n')
//         loadPropertiesOfSelectedResource(link)
//         loadSameAs(link, NUMBERS.EXPORTED_CLASS_NUMBER)
//       }
//     }
//   }
//   /**linkedata é para o objectProperties */
// }, [linkedData])


/** Carrega os links semas e as propriedade unificadas se for uma classe de Generealização */
// async function loadSameAs(uri: string, typeOfClass: string) {
//   try {
//     if (uri) {
//       setProperties([])
//       let _uri = double_encode_uri(uri);
//       const response = await api.get(`/links/?sameas=${_uri}`)
//       console.log('===LOAD SAMEAS===\n', response.data)

//       if (Object.keys(contextos).length == 0) setContextos(response.data)

//       if (typeOfClass == NUMBERS.GENERALIZATION_CLASS_NUMBER) {
//         loadUnification(response.data)
//       }
//     }
//   } catch (error) {
//     alert(JSON.stringify(error));
//   } finally {
//   }
// }

// async function loadUnification(object: any) {
//   let response: any
//   try {
//     setIsLoading(true)
//     setProperties([])
//     response = await api.post(`/properties/unification/`, { resources: object })
//     console.log('====PROPRIEDADES UNIFICADAS===', response.data)
//   } catch (error) {
//     alert(JSON.stringify(error));
//   } finally {
//     setTimeout(() => {
//       setAgroupedProperties(response.data)
//       setIsLoading(false)
//     }, NUMBERS.TIME_OUT_FROM_REQUEST)
//   }
// }