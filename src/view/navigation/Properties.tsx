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
      // console.log(`response`, response.data)
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
      // setLoading(true);
      if (uri) {
        setProperties([])
        // setContextos([])
        let _uri = double_encode_uri(uri);
        // const response = await api.get(`/properties/${_uri}/${expand_sameas}`)
        // const response = await api.get(`/properties/?resourceURI=${_uri}`)
        const response = await api.get(`/links/?sameas=${_uri}`)
        console.log(`LINKS SAMEAS:`, response.data)
        // setContextos(oldState => [...oldState, response.data])
        setContextos(response.data)
        // if (response.data) {
        //   setAgroupedProperties(response.data)
        //   Object.keys(response.data).filter((row: any) => {
        //     response.data[row].filter((el: any) => {
        //       if (el.p.value == "http://www.w3.org/2002/07/owl#sameAs") {
        //         console.log(el)
        //         setContextos(oldState => [...oldState, el])
        //       }
        //     })
        //   })
        // }
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      // setLoading(false);
    }
  }


  useEffect(() => {
    if (location?.state) {
      // let resource = location.state as ResourceModel;
      let resource_uri = location.state as string;
      console.log(`RECURSO ESCOLHIDO`, resource_uri)
      setSelectedResourceURI(resource_uri);
      // let primeiroContexto = {
      //   p: { type: '', value: '' },
      //   o: { ...resource.uri },
      //   label: { ...resource.label },
      //   same: { ...resource.uri }
      // }
      // if (resource?.same?.value) {
      //   loadSameAs(resource.same.value, false);
      //   primeiroContexto = {
      //     p: { type: '', value: '' },
      //     o: { ...resource.same },
      //     label: { ...resource.label },
      //     same: { ...resource.same }
      //   }
      // } else {
      // }
      loadPropertiesOfSelectedResource(resource_uri)
      loadSameAs(resource_uri);
      setSelectedIndex(-1)
      // setContextos(oldState => [...oldState, primeiroContexto])
    }
    // else {
    //   loadPropertiesOfSelectedResource(selectedContext)
    //   loadSameAs(selectedContext);
    // }
    window.scrollTo(0, 0)

  }, [location?.state])







  const [selectedIndex, setSelectedIndex] = useState<Number>(-1);
  // const [selectedIndex, setSelectedIndex] = useState<string>('');
  // const handleSelecteContextClick = (index: Number, contexto: PropertyObjectEntity) => {
  const handleSelectedContextClick = (index: Number, contexto: string) => {
    console.log(`*** ÍNDICE DO CONTEXTO: `, index)
    console.log(`*** CONTEXTO SELECIONADO: `, contexto)
    setSelectedIndex(index);
    setSelectedContext(contexto)
    // setSelectedResourceURI(contexto)
    navigate(ROUTES.PROPERTIES, { state: contexto })
    // setSelectedResource(contexto)
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
                {/* <> */}
                  <h4>{agroupedProperties["http://www.w3.org/2000/01/rdf-schema#label"]}</h4>
                  <Typography sx={{ fontSize: 10, fontWeight: 400, textAlign: "start" }} color="text.primary" gutterBottom>
                    {selectedResourceURI}
                  </Typography>
                {/* </> */}
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
                            agroupedProperties[prop].map((ele: any, idx: React.Key) => {
                              if ((prop == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") && !auxLabelOfClasses.includes(ele[0])) {
                                auxLabelOfClasses.push(ele[0])
                                return <Chip label={getPropertyFromURI(ele[0])} color='primary' />
                              }
                              if ((prop != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") &&
                                (prop != "http://www.w3.org/2000/01/rdf-schema#label")) {
                                return <ListItem key={idx}>
                                  <Grid container spacing={2}>
                                    <Grid item sm={3}>
                                      <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                                        {getPropertyFromURI(prop)}
                                      </Typography>
                                    </Grid>
                                    <Grid item sm={8}>
                                      <Stack direction={"column"}>
                                        {
                                          agroupedProperties[prop].map((ele: any, idx: number) => {
                                            if (ele[0].includes("http://")) {
                                              return <a href='' key={idx} onClick={(e) => handleListLinkClick(e, ele[0])}>
                                                <Typography key={idx} variant="body2" sx={{ mb: 2, ml: 0 }} color="text.secondary" gutterBottom>
                                                  {ele[0]}
                                                </Typography>
                                              </a>
                                            } else {
                                              return <Typography key={idx} variant="body2" sx={{ mb: 2, ml: 0 }} color="text.secondary" gutterBottom>
                                                {ele[0]}
                                              </Typography>
                                            }
                                          }

                                          )
                                        }
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </ListItem>
                              }
                            })
                          }
                        </Stack>
                      )
                    }
                    {/* {
                      Object.keys(agroupedProperties).map((row, idx) => {
                        if ((agroupedProperties[row][0]?.p?.value != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") &&
                          (agroupedProperties[row][0]?.p?.value != "http://www.w3.org/2000/01/rdf-schema#label")) {
                          return <ListItem key={idx}>
                            <Grid container spacing={2}>
                              <Grid item sm={3}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                                  {getPropertyFromURI(agroupedProperties[row][0]?.p?.value)}
                                </Typography>
                              </Grid>

                              <Grid item sm={8}>
                                <Stack direction={"column"}>
                                  {
                                    agroupedProperties[row].map((ele: any, idx: number) => {
                                      if (ele.o.value.includes("http://")) {
                                        console.log(`href`, ele)
                                        return <a href='' key={idx} onClick={() => navigate(ROUTES.PROPERTIES, { state: ele })}>
                                          . {ele.o.value}
                                        </a>
                                      } else {
                                        return <Typography key={idx} variant="body2" sx={{ mb: 2, ml: 0 }} color="text.secondary" gutterBottom>
                                          . {ele.o.value}
                                        </Typography>
                                      }
                                    }

                                    )
                                  }
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                        }
                      }
                      )} */}
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
                  // selected={selectedIndex === "VF"}
                  onClick={() => {
                    handleSelectedContextClick(-3, "Visão de Fusão")
                  }}
                // onClick={() => {
                //   handleSelecteContextClick("VF", {
                //     o: { type: 'uri', value: getAppHigienizadoFromClasse(selectedResource.uri.value) },
                //     p: { type: 'uri', value: '' },
                //     label: { type: '', value: "Visão de Fusão" }
                //   })
                // }}
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
                  // selected={selectedIndex === "VU"}
                  onClick={() => handleSelectedContextClick(-2, "Visão de Unificação"
                    // onClick={() => handleSelecteContextClick("VU", {
                    //   o: { type: 'uri', value: `${FONTE_PRINCIPAL}/${getClassAndIdentifierFromURI(selectedResource.uri.value)}` },
                    //   p: { type: 'uri', value: '' },
                    //   label: { type: '', value: "Visão de Unificação" }
                  )}
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
                  // selected={selectedIndex === getContextFromURI(Object.keys(contextos)[0])}
                  selected={selectedIndex === -1}
                  // onClick={(event) => handleListItemClick(event, idx, row)}
                  onClick={() => handleSelectedContextClick(-1, getContextFromURI(Object.keys(contextos)[0]))}
                >
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <Graph size={NUMBERS.SIZE_ICONS_MENU_CONTEXT} />
                  </ListItemIcon>
                  <ListItemText primary={getContextFromURI(Object.keys(contextos)[0])} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} />
                  {/* <ListItemText primary={item?.target?.value} primaryTypographyProps={{ fontSize: NUMBERS.SIZE_TEXT_MENU_CONTEXT }} /> */}
                </ListItemButton>
              </ListItem>
              {
                contextos && Object.keys(contextos).map((item: any, index: any) => {
                  console.log('ITEMS DOS LINKS >>> ', contextos[item])
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