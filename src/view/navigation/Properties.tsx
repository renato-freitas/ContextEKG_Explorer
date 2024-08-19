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
import { Asterisk, ClockCounterClockwise, Link as LinkIcon, Circle, ArrowSquareOut, Database, Receipt } from 'phosphor-react';
import { LinkSimpleBreak, Graph } from '@phosphor-icons/react';

import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../redux/store'
import { updateView, updateResourceAndView } from '../../redux/globalContextSlice';


import { MHeader } from '../../components/MHeader';
import { api } from "../../services/api";
import { LoadingContext, ClassRDFContext } from "../../App";
import { getPropertyFromURI, double_encode_uri, getIdentifierFromURI, getContextFromURI } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { COLORS, EKG_CONTEXT_VOCABULARY, NUMBERS, ROUTES, TEXTS } from '../../commons/constants';

import stylesGlobal from '../../styles/global.module.css';
import styleNavigation from './navigation.module.css'
import { IconButton, Tooltip } from '@mui/material';


const HAS_LABEL = 1
const HAS_PROVENANCE = 2
const HAS_DIVERGENCY = 4
const BULLET_SIZE = 4
const FONTSIZE_PROPERTY = 14
const FONTWEIGHT_PROPERTY = 450
const FONTSEZE_VALUE_PROPERTY = "0.69rem"
const WIDTH_OF_P = TEXTS.DEPLOY == "PRODUCTION" ? 3 : 2.5
const WIDTH_OF_O = TEXTS.DEPLOY == "PRODUCTION" ? 9 : 9.5

const LABEL_MARGIN_WHEN_PRODUCTION = TEXTS.DEPLOY == "PRODUCTION"
  ? { background: COLORS.CINZA_01, padding: "0px 10px 0px 10px" }
  : { background: COLORS.CINZA_01, padding: "0px 10px 0px 60px" }


// https://medium.com/@lucas_pinheiro/como-adicionar-internacionaliza%C3%A7%C3%A3o-i18n-na-sua-aplica%C3%A7%C3%A3o-react-a1ac4aea109d

export interface stateProps {
  resourceURI: string;
  // contextos: {};
}
export function Properties() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const global_context: any = useSelector((state: RootState) => state.globalContext)
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [uriOfselectedResource, setUriOfSelectedResource] = useState<string>("");
  const [properties, setProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  const [agroupedProperties, setAgroupedProperties] = useState<any>({});
  const [linkedData, setLinkedData] = useState<any>({});
  const [linksSameAs, setLinksSameAs] = useState<any[]>([])
  const [selectedIndexOfMenu, setSelectedIndexOfMenu] = useState<Number | undefined>(undefined);
  const [typeOfSelectedView, setTypeOfSelectedView] = useState<string>("");
  let auxLabelOfClasses = [] as string[];
  const estaEmPortugues = global_context.language == 'pt'


  async function loadPropertiesOfSelectedResource() {
    let response: any
    try {
      setIsLoading(true)
      setProperties([])
      response = await api.get(`/properties/?resourceURI=${global_context.resourceURI}&typeOfView=${global_context.view}&language=${global_context.language}`)
      setAgroupedProperties(response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsLoading(false)
    }
  }

  /** Carrega os links sameas do recurso selecionado*/
  async function loadSameAs(uri: string) {
    try {
      if (uri) {
        let _uri = double_encode_uri(uri);
        const response = await api.get(`/sameas/?resourceURI=${_uri}`)
        setLinksSameAs(response.data)
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  }

  useEffect(() => {
    console.log('--- useEffect []---')
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
      setTypeOfSelectedView(global_context.view)
      loadSameAs(global_context.resourceURI)
      
      if (global_context.view == NUMBERS.CODE_OF_EXPORTED_VIEW) setSelectedIndexOfMenu(0)
      else if (global_context.view == NUMBERS.CODE_OF_UNIFICATION_VIEW) setSelectedIndexOfMenu(NUMBERS.IDX_UNIFICATION_VIEW)
      else if (global_context.view == NUMBERS.CODE_OF_FUSION_VIEW) setSelectedIndexOfMenu(NUMBERS.IDX_FUSION_VIEW)
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [])

  useEffect(() => {
    console.log('--- useEffect 2---')
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
      loadPropertiesOfSelectedResource()
      // if (global_context.view == NUMBERS.CODE_OF_UNIFICATION_VIEW) {
      //   setSelectedIndexOfMenu(NUMBERS.IDX_UNIFICATION_VIEW)
      // }
      window.scrollTo(0, 0)
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [location?.state, global_context.resourceURI, selectedIndexOfMenu])




  // const ehVisaoExportada = (index: Number) => index != NUMBERS.IDX_UNIFICATION_VIEW && index != NUMBERS.IDX_FUSION_VIEW
  const ehVisaoExportada = (index: Number) => index != NUMBERS.IDX_UNIFICATION_VIEW && index != NUMBERS.IDX_FUSION_VIEW
  const ehVisaoUnificacao = (index: Number) => index == NUMBERS.IDX_UNIFICATION_VIEW

  const handleSelectedContextClick = (index: Number, contextoSelecionado: string) => {
    console.log(`*** ÍNDICE DO CONTEXTO: `, index, contextoSelecionado)
    setSelectedIndexOfMenu(index);
    if (ehVisaoExportada(index)) {
      dispatch(updateResourceAndView({ resource: contextoSelecionado, view: NUMBERS.CODE_OF_EXPORTED_VIEW }))
      // navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: NUMBERS.CODE_OF_EXPORTED_VIEW } })
      // navigate(ROUTES.PROPERTIES)
    }
    else if (ehVisaoUnificacao(index)) {
      dispatch(updateResourceAndView({ resource: contextoSelecionado, view: NUMBERS.CODE_OF_UNIFICATION_VIEW }))
      // navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: NUMBERS.CODE_OF_UNIFICATION_VIEW } })
      // navigate(ROUTES.PROPERTIES)
    }
    else {
      dispatch(updateResourceAndView({ resource: contextoSelecionado, view: NUMBERS.CODE_OF_FUSION_VIEW }))
      // navigate(ROUTES.PROPERTIES, { state: { resource_uri: contextoSelecionado, typeOfClass: NUMBERS.CODE_OF_FUSION_VIEW } })
    }
    navigate(ROUTES.PROPERTIES)
  };





  /** Clicar em um ObjectProperty */
  async function handleObjectPropertiesClick(event: any, uri: string) {
    // event.preventDefault();
    try {
      // updateResourceAndView({ resourceURI: uri })
      setSelectedIndexOfMenu(0)
      dispatch(updateResourceAndView({ resource: uri, view: NUMBERS.CODE_OF_EXPORTED_VIEW }))
      console.log('===URI DO LINK===', uri)
      setLinkedData({ link: uri, index: selectedIndexOfMenu })
      // navigate(ROUTES.PROPERTIES, { state: { resource_uri: uri, typeOfClass: "1" } })
      navigate(ROUTES.PROPERTIES)
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



  {/* essa div foi colocada para os prints dos artigos. analisar sua remoção ou ajuste */ }
  {/* <div style={{ paddingLeft: 60 }}> */ }

  return (
    <div className={stylesGlobal.container}>
      <Grid container spacing={1} sx={{ p: '2px 0' }}>
        <Grid item xs={7.5} sx={{ bgcolor: null }}>
          <MHeader
            title={estaEmPortugues ? `Propriedades do recurso` : "Properties of Resource"}
            hasButtonBack
          // buttonBackNavigateTo={ROUTES.PROPERTIES}
          />
        </Grid>
        <Grid item xs={2} sx={{ bgcolor: null, display: 'flex', justifyContent: 'flex-end', alignContent: 'flex-end' }}>
          <Tooltip title={estaEmPortugues ? "Ir para a lista de recursos no contexto atual" : "Go to resources list in current context"}>
            <IconButton color='primary' size="small"
              onClick={() => navigate(ROUTES.RESOURCES)}>
              <Receipt size={22} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={2.5}></Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, padding: 0 }}>
        {
          /** LABEL DO RECURSO */
          !isLoading && Object.keys(agroupedProperties).length > 0 && <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={LABEL_MARGIN_WHEN_PRODUCTION}>
                <h3 style={{ whiteSpace: 'pre-line' }}>
                  {
                    agroupedProperties[Object.keys(agroupedProperties)[0]]["http://www.w3.org/2000/01/rdf-schema#label"] != undefined
                      ? agroupedProperties[Object.keys(agroupedProperties)[0]]["http://www.w3.org/2000/01/rdf-schema#label"][0][0]
                      : false
                  }

                </h3>
                <Typography sx={{ fontSize: 11, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  {
                    /** A URI canonical deveria vir do backend */
                    global_context.view == NUMBERS.CODE_OF_UNIFICATION_VIEW || global_context.view == NUMBERS.CODE_OF_FUSION_VIEW
                      ? obtemURICanonica(global_context.resourceURI)
                      : global_context.resourceURI
                  }
                </Typography>
              </div>
            </Grid>

            <Grid item sm={2.5}>
              <div style={{ background: COLORS.CINZA_02, padding: "0px 10px 0px 10px" }}>
                <h5>{estaEmPortugues ? "Menu de Contexto" : "Context Menu"}</h5>
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
                selectedIndexOfMenu != -4
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
                                {estaEmPortugues ? 'é um(a)' : 'is a'}
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
                                      return <Box p={0} width={160} height={140} key={i} paddingBottom={2}>
                                        <img src={fig[0]} alt={fig[0]} className={styleNavigation.img_in_properties}></img>
                                        {/* </Box> */}
                                        <Typography variant="caption" sx={{ ml: 0, fontSize: FONTSEZE_VALUE_PROPERTY }} color="text.secondary" gutterBottom>
                                          {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                          {fig[HAS_PROVENANCE]}
                                        </Typography>
                                      </Box>
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
                            || agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.DCTERMS_DESCRIPTION] != undefined
                            || agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.COMMENT] != undefined)
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
                                      textAlign={'justify'} key={i}>
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
                                          // console.log('valores: ', values)
                                          return <Stack key={i} direction={'row'} spacing={1} justifyContent={'flex-start'} alignItems={"center"}
                                            textAlign={'justify'}>
                                            { /** values[0] contém o valor literal da propriedade */
                                              values[0].toLowerCase().includes("http") && values[0].toLowerCase().includes("resource")
                                                && linksSameAs?.every((ele: string) => values[0].includes(getContextFromURI(ele[0])))
                                                ? <><Link
                                                  align='left'
                                                  underline="none"
                                                  component="button"
                                                  variant='caption'
                                                  onClick={(e: any) => handleObjectPropertiesClick(e, values[0])}
                                                >
                                                  <Circle size={BULLET_SIZE} weight="fill" color='#000' /> {values[3]}
                                                </Link>
                                                  <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: FONTSEZE_VALUE_PROPERTY }} color="text.secondary" gutterBottom>
                                                    {/*values[1] contém a proveniência do dados (na visão de unificação) */}
                                                    {values[HAS_PROVENANCE]}
                                                  </Typography>
                                                </>
                                                : <><Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                                  <Circle size={BULLET_SIZE} weight="fill" />
                                                  {/* {propOfResource == "http://purl.org/dc/elements/1.1/date" ? " "+new Date("1998").toLocaleDateString("pt-BR") : " "+values[0]} */}
                                                  {" " + values[0]}
                                                </Typography>
                                                  {
                                                    // Link externo
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
                  <ListItem key={NUMBERS.IDX_FUSION_VIEW} disablePadding>
                    <ListItemButton
                      selected={selectedIndexOfMenu === NUMBERS.IDX_FUSION_VIEW}
                      onClick={() => handleSelectedContextClick(NUMBERS.IDX_FUSION_VIEW, linksSameAs[0].sameas.value)}
                      sx={{ bgcolor: selectedIndexOfMenu === NUMBERS.IDX_FUSION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <LinkSimpleBreak size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                      </ListItemIcon>
                      <ListItemText primary={estaEmPortugues ? "Visão de Fusão" : "Fusion View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                    </ListItemButton>
                  </ListItem>



                  <ListItem key={NUMBERS.IDX_UNIFICATION_VIEW} disablePadding>
                    <ListItemButton
                      selected={selectedIndexOfMenu === NUMBERS.IDX_UNIFICATION_VIEW}
                      onClick={() => handleSelectedContextClick(NUMBERS.IDX_UNIFICATION_VIEW, linksSameAs[0].sameas.value)}
                      sx={{ bgcolor: selectedIndexOfMenu === NUMBERS.IDX_UNIFICATION_VIEW ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <LinkIcon size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                      </ListItemIcon>
                      <ListItemText primary={estaEmPortugues ? "Visão de Unificação" : "Unification View"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                    </ListItemButton>
                  </ListItem>


                  {
                    linksSameAs.map((row: any, idx: Key) => {
                      // console.log('--', row)
                      const _sameas_context = getContextFromURI(row.sameas.value)
                      return (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton
                            selected={selectedIndexOfMenu === idx}
                            onClick={() => handleSelectedContextClick(idx as Number, row.sameas.value)}
                            sx={{ bgcolor: selectedIndexOfMenu === idx ? `${COLORS.AMARELO_01} !important` : "#fff" }}
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
                  : <List>
                    {
                      agroupedProperties[Object.keys(agroupedProperties)[0]] && agroupedProperties[Object.keys(agroupedProperties)[0]]['http://www.arida.ufc.br/ontologies/timeline#has_timeline'] != undefined
                        ? <ListItem key={-4} disablePadding>
                          <ListItemButton
                            selected={selectedIndexOfMenu === -4}
                            sx={{ bgcolor: selectedIndexOfMenu === -4 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                            onClick={() => navigate(ROUTES.TIMELINE, {
                              state: {
                                resourceURI: Object.keys(agroupedProperties)[0],
                              } as stateProps
                            })}
                          >
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                              <ClockCounterClockwise size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                            </ListItemIcon>
                            <ListItemText primary={"Visão Timeline"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                          </ListItemButton>
                        </ListItem>
                        : false
                    }


                    {
                      linksSameAs.map((row: any, idx: Key) => {
                        console.log('--', row)
                        const _sameas_context = getContextFromURI(row.sameas.value)
                        return (
                          <ListItem key={idx} disablePadding>
                            <ListItemButton
                              selected={selectedIndexOfMenu === idx}
                              onClick={() => handleSelectedContextClick(idx as Number, row.sameas.value)}
                              sx={{ bgcolor: `${COLORS.AMARELO_01} !important` }}
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
                    <ListItem key={linksSameAs.length + 1} disablePadding sx={{ pt: 1 }}>
                      <Chip label={estaEmPortugues ? 'Sem link owl:sameAs' : 'No owl:sameAs link'} color='warning' />
                    </ListItem>
                  </List>
              }
              <List>
                {
                  agroupedProperties[Object.keys(agroupedProperties)[0]] && agroupedProperties[Object.keys(agroupedProperties)[0]]["http://www.arida.ufc.br/ontologies/timeline#has_timeline"]
                  && <ListItem key={-4} disablePadding>
                    <ListItemButton
                      selected={selectedIndexOfMenu === -4}
                      sx={{ bgcolor: selectedIndexOfMenu === -4 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                      onClick={() => navigate(ROUTES.TIMELINE, {
                        state: {
                          resourceURI: Object.keys(agroupedProperties)[0],
                          // contextos: [Object.keys(agroupedProperties)[0]].concat(agroupedProperties[Object.keys(agroupedProperties)[0]][EKG_CONTEXT_VOCABULARY.PROPERTY.SAMEAS]?.map((same: string[]) => same[0]))
                        } as stateProps
                      })}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <ClockCounterClockwise size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                      </ListItemIcon>
                      <ListItemText primary={"Timeline"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                    </ListItemButton>
                  </ListItem>
                }
                <ListItem key={-5} disablePadding>
                  <ListItemButton
                    href={`http://localhost:7200/graphs-visualizations?uri=${encodeURI(Object.keys(agroupedProperties)[0])}${NUMBERS.GRAPHDB_BROWSER_CONFIG}&embedded`}
                    target='_blank'
                    selected={selectedIndexOfMenu === -5}
                    sx={{ bgcolor: selectedIndexOfMenu === -5 ? `${COLORS.AMARELO_01} !important` : "#fff" }}
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                    </ListItemIcon>
                    <ListItemText primary={estaEmPortugues ? 'Visão Gráfica' : 'Graphical View'} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
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