import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Box, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { api } from "../../services/api";
import { getClassAndIdentifierFromURI, getClassFromURI, getPropertyFromURI, double_encode_uri, getContextFromURI, getAppHigienizadoFromClasse } from "../../commons/utils";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { MetaMashupModel } from '../../models/MetaMashupModel';
import { ResourceModel } from '../../models/ResourceModel';
import { MHeader } from '../../components/MHeader';
import { MenuContext } from '../../components/MenuContext';
import { RDF_Node } from '../../models/RDF_Node';
import { APP_HIGIENIZACAO, FONTE_PRINCIPAL, ROUTES } from '../../commons/constants';

export function Properties() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<ResourceModel>({} as ResourceModel);
  const [properties, setProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  const [agroupedProperties, setAgroupedProperties] = useState<any>({});
  const [selectedContext, setSelectedContext] = useState<PropertyObjectEntity>({} as PropertyObjectEntity);
  const [contextos, setContextos] = useState<{ p: RDF_Node, o: RDF_Node, label: RDF_Node, same: RDF_Node }[]>([])
  let auxLabelOfClasses = [] as string[];


  useEffect(() => {
    if (location?.state) {
      let resource = location.state as ResourceModel;
      console.log(`3. RECURSO ESCOLHIDO`, resource)
      console.log('')
      setSelectedResource(resource);
      let primeiroContexto = {
        p: { type: '', value: '' },
        o: { ...resource.uri },
        label: { ...resource.label },
        same: { ...resource.uri }
      }
      // setContextos(primeiroContexto)
      if (resource?.same?.value) {
        loadSameAs(resource.same.value, false);
        primeiroContexto = {
          p: { type: '', value: '' },
          o: { ...resource.same },
          label: { ...resource.label },
          same: { ...resource.same }
        }
      } else {
        loadSameAs(resource.uri.value, false);
      }
      setContextos(oldState => [...oldState, primeiroContexto])
    }
  }, [location?.state])


  async function loadSameAs(uri: string, expand_sameas: boolean) {
    try {
      setLoading(true);
      if (uri) {
        setProperties([])
        setContextos([])
        let _uri = double_encode_uri(uri);
        const response = await api.get(`/properties/${_uri}/${expand_sameas}`)
        console.log(`response`, response.data)
        if (response.data) {
          setAgroupedProperties(response.data)
          Object.keys(response.data).filter((row: any) => {
            response.data[row].filter((el: any) => {
              if (el.p.value == "http://www.w3.org/2002/07/owl#sameAs") {
                console.log(el)
                setContextos(oldState => [...oldState, el])
              }
            })
          })
        }
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }


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

  const [selectedIndex, setSelectedIndex] = useState<Number>(0);
  const handleSelecteContextClick = (index: Number, contexto: PropertyObjectEntity) => {
    console.log(`. CONTEXTO SELECIONADO: `, contexto)
    setSelectedIndex(index);
    setSelectedContext(contexto)
  };



  useEffect(() => {
    if (selectedContext?.o?.value) {
      /** LIMPAR A LISTA DAS PROPRIEDADES AGRUPADAS */
      Object.keys(agroupedProperties).forEach(ele => {
        delete agroupedProperties[ele]
      })
      const _uri_context = selectedContext?.o?.value
      let expandSameAs = selectedContext?.label?.value == "Visão Unificada" ? true : false

      /**Ao selecionar um contexto, buscas as propriedades desse contexto */

      async function loadPropertiesOfSelectedResource(uri: string, expand_sameas: boolean) {
        try {
          setLoading(true);
          if (uri) {
            setProperties([])
            // setContextos([])
            let _uri = double_encode_uri(uri);
            const response = await api.get(`/properties/${_uri}/${expand_sameas}`)
            console.log(`response`, response.data)
            if (response.data) {
              setAgroupedProperties(response.data)
            }
          }
        } catch (error) {
          alert(JSON.stringify(error));
        } finally {
          setLoading(false);
        }
      }
      loadPropertiesOfSelectedResource(_uri_context, expandSameAs);
    }

  }, [selectedContext])







  // const handleListItemClick = (event: any, idx: Number, row: MetaMashupModel) => {
  //   setSelectedIndex(idx);
  //   // setSelectedMashup(row)
  // };

  // const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#edf4fc" : "None";
  // const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#f5f5fd" : "None";


  return (
    // <div className={styles.listkg}>
    <div>

      <MHeader
        title={`Propriedades do recurso`}
        hasButtonBack
      />

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        {/* MUDAR CONTEXTO */}
        {/* <Grid container spacing={1}>
          <Grid item sm={12}>
            {
              Object.keys(agroupedProperties).length > 0 && <MenuContext
                selectedResource={selectedResource}
                properties={agroupedProperties} */}
        {/* selectedContext={selectedContext}
                getSelectedContext={setSelectedContext}
              />
            }
          </Grid>
        </Grid> */}

        {/* LABEL DO RECURSO */}
        <Grid container spacing={1}>
          {/* LISTA DAS PROPRIEDADES DO RECURSO */}
          <Grid item sm={10}>
            <div style={{ background: "#ddd", padding: "0px 10px 0px 10px" }}>
              <h4>{selectedResource?.label?.value}</h4>
            </div>


          </Grid>
          <Grid item sm={2}>
            <div style={{ background: "#aaa", padding: "0px 10px 0px 10px" }}>
              <h4>Contextos</h4>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          {/* LISTA DAS PROPRIEDADES DO RECURSO */}
          <Grid item sm={10}>
            {
              // properties.length > 0 && <Box sx={{ width: "100%" }}>
              agroupedProperties && <Box sx={{ width: "100%" }}>
                {/* <Paper sx={{ maxHeight: 400, bgcolor: 'None', background: "None" }}> */}
                <Paper sx={{ background: "None" }} elevation={0}>
                  <List sx={{
                    // background: "None",
                    width: '100%',
                    // maxWidth: 400,
                    bgcolor: 'background.paper',
                    // bgcolor: 'None',
                    position: 'relative',
                    overflow: 'auto',
                    // maxHeight: 400,
                    padding: 1
                    // '& ul': { padding: 1 },
                  }}>
                    {
                      Object.keys(agroupedProperties).map((row) =>
                        <Stack direction={"row"} spacing={1}>
                          {
                            agroupedProperties[row].map((ele: any) => {
                              if ((ele.p.value == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") && !auxLabelOfClasses.includes(ele.o.value)) {
                                auxLabelOfClasses.push(ele.o.value)
                                return <Chip label={getPropertyFromURI(ele.o.value)} color='primary' />
                              }

                            })
                          }
                        </Stack>
                      )
                    }
                    {
                      Object.keys(agroupedProperties).map((row, idx) => {
                        if ((agroupedProperties[row][0]?.p?.value != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") &&
                          (agroupedProperties[row][0]?.p?.value != "http://www.w3.org/2000/01/rdf-schema#label")) {
                          return <ListItem key={idx}>
                            <Grid container spacing={2}>
                              {/* Propriedades */}
                              <Grid item sm={3}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                                  {getPropertyFromURI(agroupedProperties[row][0]?.p?.value)}
                                </Typography>
                              </Grid>

                              {/* Valores da propriedade */}
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
                      )}
                  </List >
                </Paper>
              </Box>
            }
          </Grid>

          {/* MENU DE CONTEXTOS */}
          <Grid item sm={2}>
            <List sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              padding: 1
            }}>
              {
                contextos.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    {/* <ListItemButton selected={pathname === item.href}> */}
                    <ListItemButton
                      selected={selectedIndex === index}
                      // onClick={(event) => handleListItemClick(event, idx, row)}
                      onClick={() => handleSelecteContextClick(index, item)}>
                      <Stack direction={'column'}>
                        {/* <ListItemIcon>
                          <item.icon size={20} />
                        </ListItemIcon> */}
                        <ListItemText primary={getContextFromURI(item.o.value)} primaryTypographyProps={{ fontSize: '0.8rem' }} />
                      </Stack>
                    </ListItemButton>
                  </ListItem>
                ))
              }
              {/* VISÃO UNIFICADA */}
              <ListItem key={-1} disableGutters>
                <ListItemButton
                  selected={selectedIndex === -1}
                  onClick={() => handleSelecteContextClick(-1, {
                    o: { type: 'uri', value: `${FONTE_PRINCIPAL}/${getClassAndIdentifierFromURI(selectedResource.uri.value)}` },
                    p: { type: 'uri', value: '' },
                    label: { type: '', value: "Visão Unificada" }
                  })}
                >
                  {/* <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <PersonPinCircleOutlined />
                    </Avatar>
                  </ListItemAvatar> */}
                  <ListItemText primary={"Visão Unificada"} primaryTypographyProps={{ fontSize: '0.8rem' }} />
                </ListItemButton>
              </ListItem>
              {/* VISÃO HIGIENIZADA */}
              <ListItem key={-2} disableGutters>
                <ListItemButton
                  selected={selectedIndex === -2}
                  onClick={() => {
                    handleSelecteContextClick(-2, {
                      o: { type: 'uri', value: getAppHigienizadoFromClasse(selectedResource.uri.value) },
                      p: { type: 'uri', value: '' },
                      label: { type: '', value: "Visão Higienizada" }
                    })
                  }}
                >
                  {/* <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <PersonPinCircleOutlined />
                    </Avatar>
                  </ListItemAvatar> */}
                  <ListItemText primary={"Visão Higienizada"} primaryTypographyProps={{ fontSize: '0.8rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box >
    </div >
  );
}