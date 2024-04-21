import React, { useState, useEffect, useContext, Key } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Box, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { api } from "../../services/api";
import { getClassAndIdentifierFromURI, getPropertyFromURI, double_encode_uri, getContextFromURI, getAppHigienizadoFromClasse } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { ResourceModel } from '../../models/ResourceModel';
import { MHeader } from '../../components/MHeader';
import { FONTE_PRINCIPAL, NUMBERS, ROUTES } from '../../commons/constants';
import { LoadingContext } from "../../App";
import styles from './navigation.module.css';
import { Link as LinkIcon } from 'phosphor-react';
import { LinkSimpleBreak, Graph } from '@phosphor-icons/react';

export function Properties() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  // const [selectedResource, setSelectedResource] = useState<ResourceModel>({} as ResourceModel);
  const [selectedResourceURI, setSelectedResourceURI] = useState<string>("");
  const [properties, setProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  const [agroupedProperties, setAgroupedProperties] = useState<any>({});
  // const [selectedContext, setSelectedContext] = useState<PropertyObjectEntity>({} as PropertyObjectEntity);
  const [selectedContext, setSelectedContext] = useState<string>("");
  // const [contextos, setContextos] = useState<{ origin: RDF_Node, target: RDF_Node }[]>([])
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
      if (selectedIndex == -2) {
        loadUnification(contextos)
        setSelectedResourceURI(resource_uri);
        loadSameAs(resource_uri);
        setSelectedIndex(-2)
      } else {
        console.log(`RECURSO ESCOLHIDO`, resource_uri)
        setSelectedResourceURI(resource_uri);
        loadPropertiesOfSelectedResource(resource_uri)
        loadSameAs(resource_uri);
        setSelectedIndex(-1)
      }
    }

    window.scrollTo(0, 0)

  }, [location?.state])







  const [selectedIndex, setSelectedIndex] = useState<Number>(-1);
  const handleSelectedContextClick = (index: Number, contexto: string) => {
    // console.log(`*** ÍNDICE DO CONTEXTO: `, index)
    setSelectedIndex(index);
    setSelectedContext(contexto)
    navigate(ROUTES.PROPERTIES, { state: contexto })
  };






  async function handleListLinkClick(event: any, uri: string) {
    event.preventDefault();
    try {
      let _uri = double_encode_uri(uri);
      const response = await api.get(`/resources/${_uri}`)
      console.log(`response`, response.data)
      navigate(ROUTES.PROPERTIES, {
        state: {
          label: { type: 'literal', value: 'teste' },
          uri: { type: 'uri', value: uri },
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      window.scrollTo(0, 0)
    }
  }




  return (
    <div className={styles.listkg}>
      <MHeader
        title={`Propriedades do recurso`}
        hasButtonBack
      />

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        {/* LABEL DO RECURSO */}
        {
          !isLoading && agroupedProperties && <Grid container spacing={1}>
            <Grid item sm={9.5}>
              <div style={{ background: "#ddd", padding: "0px 10px 0px 10px" }}>
                <h4>{agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"]}</h4>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  {/* {selectedResourceURI} */}
                  RENATO
                </Typography>
              </div>

            </Grid>
            <Grid item sm={2.5}>
              <div style={{ background: "#aaa", padding: "0px 10px 0px 10px" }}>
                <h4>Contexto</h4>
                <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                  Menu
                </Typography>
              </div>
            </Grid>
          </Grid>
        }

        {!isLoading && <Grid container spacing={1}>
          {/* LISTA DAS PROPRIEDADES DO RECURSO */}
          <Grid item sm={9.5}>
            {
              agroupedProperties && <Box sx={{ width: "100%" }}>
                <Paper sx={{ background: "None" }} elevation={0}>
                  <List sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    padding: 1
                  }}>
                    {
                      Object.keys(agroupedProperties).map((prop, idx) =>
                        <Stack direction={"row"} spacing={1} key={idx}>
                          {
                            // CHIP DAS CLASSES ÚNICAS
                            agroupedProperties && agroupedProperties[prop].map((valuesOfPropsArray: any, idx: React.Key) => {
                              if ((prop == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") && !auxLabelOfClasses.includes(valuesOfPropsArray[0])) {
                                auxLabelOfClasses.push(valuesOfPropsArray[0])
                                return <Chip key={idx} label={getPropertyFromURI(valuesOfPropsArray[0])} color='primary' />
                              }
                            })
                          }
                          {
                            // LABEL DAS PROPRIEDADES
                            (prop != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
                              prop != "http://www.w3.org/2000/01/rdf-schema#label") && <ListItem key={idx}>
                              <Grid container spacing={2}>
                                <Grid item sm={3}>
                                  <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                                    {getPropertyFromURI(prop)}
                                  </Typography>
                                </Grid>
                                <Grid item sm={9}>
                                  <Stack direction={"column"}>
                                    {
                                      agroupedProperties[prop].map((values: any) => {
                                        return <Typography key={idx} variant="body2" sx={{ mb: 2, ml: 0 }} color="text.secondary" gutterBottom>
                                          {values[0]}
                                        </Typography>
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

          {/* MENU DE CONTEXTOS */}
          <Grid item sm={2.5}>
            <List sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              padding: 0
            }}>
              {/* VISÃO DE FUSÃO */}
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
              {/* VISÃO DE UNIFICAÇÃO */}
              <ListItem key={-2} disablePadding>
                <ListItemButton
                  selected={selectedIndex === -2}
                  onClick={() => handleSelectedContextClick(-2, Object.keys(contextos)[0])}
                >
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <LinkIcon size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                  </ListItemIcon>
                  <ListItemText primary={"Visão de Unificação"} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                </ListItemButton>
              </ListItem>
              {/* VISÃO EXPORTADA DO RECURSO ORIGEM */}
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
                contextos && Object.keys(contextos).map((item: any, index: any) => {
                  // console.log('ITEMS DOS LINKS >>> ', contextos[item])
                  return contextos[item].map((same: string, idx: Key) => {
                    return (
                      <ListItem key={idx} disablePadding>
                        {/* <ListItemButton selected={pathname === item.href}> */}
                        <ListItemButton
                          selected={selectedIndex === idx}
                          // onClick={(event) => handleListItemClick(event, idx, row)}
                          onClick={() => handleSelectedContextClick(idx as Number, same)}
                        >
                          {/* <Stack direction={'column'}> */}
                          <ListItemIcon sx={{ minWidth: '30px' }}>
                            <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                          </ListItemIcon>
                          <ListItemText primary={getContextFromURI(same)} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                          {/* <ListItemText primary={item?.target?.value} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} /> */}
                          {/* </Stack> */}
                        </ListItemButton>
                      </ListItem>
                    )
                  })
                })
              }

            </List>
          </Grid>
        </Grid>
        }
      </Box>
    </div >
  )
}





// const handleListItemClick = (event: any, idx: Number, row: MetaMashupModel) => {
//   setSelectedIndex(idx);
//   // setSelectedMashup(row)
// };

// const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#edf4fc" : "None";
// const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#f5f5fd" : "None";


// useEffect(() => {
// if (selectedContext?.o?.value) {
/** LIMPAR A LISTA DAS PROPRIEDADES AGRUPADAS */
// Object.keys(agroupedProperties).forEach(ele => {
//   delete agroupedProperties[ele]
// })
// const _uri_context = selectedContext?.o?.value
// let expandSameAs = selectedContext?.label?.value == "Visão Unificada" ? true : false

/**Ao selecionar um contexto, buscas as propriedades desse contexto */


// loadPropertiesOfSelectedResource(_uri_context, expandSameAs);
//   }
// }, [])



// useEffect(() => {
//   Object.keys(agroupedProperties).filter((row: any) => {
//     agroupedProperties[row].filter((el: any) => {
//       if (el.p.value == "http://www.w3.org/2002/07/owl#sameAs") {
//         console.log(el)
//         setContextos(oldState => [...oldState, el])
//       }
//     })
//   })
// }, [])