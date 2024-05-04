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
import { Asterisk, Link as LinkIcon } from 'phosphor-react';
import { LinkSimpleBreak, Graph } from '@phosphor-icons/react';

import { MHeader } from '../../components/MHeader';
import { api } from "../../services/api";
import { LoadingContext } from "../../App";
import { getPropertyFromURI, double_encode_uri, getContextFromURI, getIdentifierFromURI } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { COLORS, NUMBERS, ROUTES } from '../../commons/constants';

import styles from './navigation.module.css';

export function Properties() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [uriOfselectedResource, setUriOfSelectedResource] = useState<string>("");
  const [properties, setProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  const [agroupedProperties, setAgroupedProperties] = useState<any>({});
  const [contextos, setContextos] = useState<any>({})
  let auxLabelOfClasses = [] as string[];


  async function loadPropertiesOfSelectedResource(uri: string) {
    let response: any
    try {
      setIsLoading(true)
      setProperties([])
      let _uri = double_encode_uri(uri);
      response = await api.get(`/properties/?resourceURI=${_uri}`)
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


  useEffect(() => {
    if (location?.state) {
      let resource_uri = location.state as string;

      // if (resource_uri == "Visão de Unificação") {
      console.log(`RECURSO ESCOLHIDO`, resource_uri)
      if (selectedIndex == -2 && resource_uri.includes("/canonical")) { /**-2 = Visão de Unificação */
        loadUnification(contextos)
        setUriOfSelectedResource(resource_uri);
        // loadSameAs(resource_uri); //passar recurso origem
        loadSameAs(Object.keys(contextos)[0]); //passar recurso origem
        setSelectedIndex(-2)
      } else {
        setUriOfSelectedResource(resource_uri);
        loadPropertiesOfSelectedResource(resource_uri)
        loadSameAs(resource_uri);
        setSelectedIndex(-1)
      }
    }

    window.scrollTo(0, 0)

  }, [location?.state])







  const [selectedIndex, setSelectedIndex] = useState<Number>(-1);
  const handleSelectedContextClick = (index: Number, contextoSelecionado: string) => {
    // console.log(`*** ÍNDICE DO CONTEXTO: `, index)
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
    <div className={styles.listkg}>
      <MHeader
        title={`Propriedades do recurso`}
        hasButtonBack
      // buttonBackNavigateTo={`${ROUTES.RESOURCES}`}
      />

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        { /** LABEL DO RECURSO */
          !isLoading && Object.keys(agroupedProperties).length > 0 && <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={{ background: COLORS.CINZA_01, padding: "0px 10px 0px 10px" }}>
                <h3>{agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"]?.length == 1 ?
                  agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"] :
                  agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"][0][0]}
                </h3>
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
            {
              Object.keys(agroupedProperties).length > 0 && <Box sx={{ width: "100%" }}>
                <Paper sx={{ background: "None" }} elevation={0}>
                  <List sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    padding: 1
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
                      Object.keys(agroupedProperties).map((prop, idx) =>
                        <Stack direction={"row"} spacing={1} key={idx + prop}>
                          { // LABEL DAS PROPRIEDADES
                            (prop != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
                              prop != "http://www.w3.org/2000/01/rdf-schema#label" && prop != "label" &&
                              prop != "http://www.bigdatafortaleza.com/ontology#uri" &&
                              prop != "http://purl.org/dc/elements/1.1/identifier" && prop != "ID") && <ListItem key={idx + prop}>
                              <Grid container spacing={0}>
                                <Grid item sm={2}>
                                  <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                                    {prop.includes("http://") ? getPropertyFromURI(prop) : prop}
                                  </Typography>
                                </Grid>
                                <Grid item sm={10}>
                                  <Stack direction={"column"} key={idx}>
                                    { /** VALORES DAS PROPRIEDADES */
                                      agroupedProperties[prop].map((values: any, i: React.Key) => {
                                        // console.log('*****------****', prop)
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
                                                  {values[1]}
                                                </Typography>
                                              </>
                                              : <><Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.primary" gutterBottom>
                                                . {values[0]}
                                              </Typography>
                                                <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.68rem" }} color="text.secondary" gutterBottom>
                                                  {/* values[1] contém a proveniência do dados (na visão de unificação) */}
                                                  {values[1]}
                                                </Typography>
                                                <Typography variant="caption" sx={{ mb: 2, ml: 0, fontSize: "0.40rem" }} color="text.secondary" gutterBottom>
                                                  {/* values[2] == true siginifica que há divergência nos valores da propriedade */}
                                                  {values[2] == true && <Chip label="divergência" size="small" icon={<Asterisk size={12} color='#ed0215' />} style={{ backgroundColor: '#d7c84b22', fontSize: "0.60rem" }} />}
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
                      )
                    }
                  </List >
                </Paper>
              </Box>
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
                <ListItem key={-3} disablePadding>
                  <ListItemButton
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