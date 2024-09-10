import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Asterisk, Circle, ArrowSquareOut } from 'phosphor-react';
import { MHeader } from '../../components/MHeader';
import { api } from "../../services/api";
import { LoadingContext, ClassRDFContext } from "../../App";
import { getPropertyFromURI, getContextFromURI } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { COLORS, EKG_CONTEXT_VOCABULARY, NUMBERS, ROUTES } from '../../commons/constants';
import stylesGlobal from '../../styles/global.module.css';
import styleNavigation from '../navigation/navigation.module.css'

const HAS_LABEL = 1
const HAS_PROVENANCE = 2
const HAS_DIVERGENCY = 4
const BULLET_SIZE = 4
const FONTSIZE_PROPERTY = 14
const FONTWEIGHT_PROPERTY = 450
const FONTSEZE_VALUE_PROPERTY = "0.69rem"
const WIDTH_OF_P = 2.5
const WIDTH_OF_O = 9.5


export interface stateProps {
  resourceURI: string;
}
export function MetadataProperties() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { contextClassRDF } = useContext(ClassRDFContext);
  const [uriOfselectedResource, setUriOfSelectedResource] = useState<string>("");
  const [properties, setProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  const [instants, setInstants] = useState<any[]>([] as any[])
  const [agroupedProperties, setAgroupedProperties] = useState<any>({});
  const [linkedData, setLinkedData] = useState<any>({});
  const [linksSameAs, setLinksSameAs] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState<Number | undefined>(undefined);
  const [typeOfSelectedView, setTypeOfSelectedView] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState(window.localStorage.getItem('LANGUAGE'));
  let auxLabelOfClasses = [] as string[];
  const estaEmPortugues = selectedLanguage == 'pt'


  async function loadPropertiesOfSelectedResource(uri: string, typeOfView: string) {
    let response: any
    try {
      setIsLoading(true)
      setProperties([])
      response = await api.get(`/properties/?resourceURI=${uri}&typeOfView=${typeOfView}&language=${selectedLanguage}`)
      console.log('-----props-----\n', response.data)
      setAgroupedProperties(response.data)
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsLoading(false)
    }
  }



  useEffect(() => {
    const _repo_in_api_header = api.defaults.headers.common['repo']
    if (_repo_in_api_header) { /** Verificar se tem reposiótio no header da axios */
      if (location?.state) {
        let { resource_uri } = location.state as any;
        loadPropertiesOfSelectedResource(resource_uri, "1")
      }
    }
    else {
      navigate(ROUTES.REPOSITORY_LIST)
    }
  }, [location.state])


  /** Clicar em um ObjectProperty */
  async function handleListLinkClick(event: any, uri: string) {
    // event.preventDefault();
    try {
      console.log('===URI DO LINK===', uri)
      setLinkedData({ link: uri, index: selectedIndex })
      navigate(ROUTES.METADATA_PROPERTIES, { state: { resource_uri: uri, typeOfClass: "1" } })
    } catch (error) {
      console.log(error)
    } finally {
      window.scrollTo(0, 0)
    }
  }






  return (
    <div className={stylesGlobal.container}>
      <MHeader
        title={estaEmPortugues ? `Propriedades do recurso` : "Properties of Resource"}
        hasButtonBack
      />

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
                  {typeOfSelectedView == NUMBERS.CODE_OF_UNIFICATION_VIEW
                    ? uriOfselectedResource
                    : uriOfselectedResource
                  }
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
                                      return <><Box p={0} width={160} height={140} key={i}>
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
                                          // console.log('valores: ', values)
                                          return <Stack direction={'row'} spacing={1} justifyContent={'flex-start'} alignItems={"center"}
                                            textAlign={'justify'} key={i}>
                                            { /** values[0] contém o valor literal da propriedade */
                                              values[0].toLowerCase().includes("http") && values[0].toLowerCase().includes("resource")
                                                && linksSameAs?.every((ele: string) => values[0].includes(getContextFromURI(ele[0])))
                                                ? <><Link
                                                  align='left'
                                                  underline="none"
                                                  component="button"
                                                  variant='caption'
                                                  onClick={(e:any) => handleListLinkClick(e, values[0])}
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

          </Grid> /**container 2 */
        }
      </Box>
    </div>
  )
}