// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Grid from '@mui/material/Grid';
// import { Box, IconButton, List, ListItem, ListItemButton, Paper, Stack, Tooltip, Typography } from '@mui/material';

// import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ConstructionIcon from '@mui/icons-material/Construction';

// import { MDialogToConfirmDelete } from '../../components/MDialog';

// import { ROUTES } from '../../commons/constants';
// import styles from '../datasources/DataSource.module.css';

// import { api } from "../../services/api";

// import { TitleWithButtonBack } from '../../components/MTitleWithButtonBack';
// import { double_encode_uri } from "../../commons/utils";
// import { MetaEKGProperties } from "../../models/MetaEKGProperties";
// import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
// import { MetaMashupModel } from '../../models/MetaMashupModel';
// import { MCard } from '../../components/mcard/MCard';

export function MetaMashups() {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const [loading, setLoading] = useState<boolean>(false);
  // const [metaMashups, setMetaMashups] = useState<MetaMashupModel[]>([]);
  // const [selectedMashup, setSelectedMashup] = useState<MetaMashupModel>({} as MetaMashupModel);

  // const [selectedMetaEKG, setSelectedMetaEKG] = useState<MetaEKGProperties>({} as MetaEKGProperties);
  // const [metaEKG, setMetaEKG] = useState<MetaEKGProperties[]>([] as MetaEKGProperties[])

  // async function loadMetaMashups() {
  //   try {
  //     setLoading(true);
  //     const response = await api.get("/meta-mashups");
  //     // printt(`MetaMashups`, response.data)
  //     setMetaMashups(response.data)
  //     setSelectedMashup(response.data[0])
  //     setSelectedIndex(0)
  //   } catch (error) {
  //     // printt('error', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   loadMetaMashups();
  // }, [])



  // const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  // useEffect(() => {
  //   async function loadMetaMashupProperties() {
  //     try {
  //       setLoading(true);
  //       if (selectedMashup?.uri) {
  //         let _uri = double_encode_uri(selectedMashup?.uri?.value)
  //         // printt(`/properties/${_uri}`)
  //         const response = await api.get(`/properties/${_uri}`);
  //         // printt(`properties/`, response.data)
  //         serProperties(response.data)
  //       }
  //       // setMetaEKG(response.data)
  //     } catch (error) {
  //       alert(error)
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   loadMetaMashupProperties()
  // }, [selectedMashup])

  // const openForm = () => {
  //   // printt("ABRIR FORM MASHUP")
  //   navigate(ROUTES.META_MASHUP_FORM);
  // }


  // /**Pagination */
  // const [page, setPage] = useState(0);
  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // console.log(event.target.value)
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // /**Dialog to Delete */
  // const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  // const handleClickOpenDialogToConfirmDelete = (row: MetaMashupModel) => {
  //   // console.log(row)
  //   setSelectedMashup(row)
  //   setOpenDialogToConfirmDelete(true);
  // };

  // const handleRemove = async (identifier: string) => {
  //   // await removeDataSource(identifier);
  //   // print('', identifier)
  //   let uri_enc = double_encode_uri(identifier)
  //   await api.delete(`/meta-mashups/${uri_enc}`)
  //   await loadMetaMashups();
  // }
  /**Dialog to Delete */

  /**EDIT */
  // useEffect(() => {
  //         // let state = location.state as MetadataGraphEntity;
  //         let state = location.state as SemanticViewEntity;
  //         printt(`Carregando a VS selecionada`, state)
  //         //   e.log(state)
  //         // setMetagraph(state)
  //       }
  //     } catch (err) {
  //       printt('err', err);
  //     }
  //   }
  //   onEdit();
  // }, [location.state]);


  // const [selectedIndex, setSelectedIndex] = React.useState<Number>(1);
  // const handleListItemClick = (event: any, idx: Number, row: MetaMashupModel) => {
  //   setSelectedIndex(idx);
  //   setSelectedMashup(row)
  // };

  // const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#edf4fc" : "None";
  // const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#f5f5fd" : "None";


  // return (
  //   <div className={styles.listkg}>

  //     <TitleWithButtonBack
  //       title="Meta Mashups"
  //       buttonLabel="+ Meta Mashup"
  //       openForm={openForm} />


  //     <Grid container spacing={1}>
  //       <Grid item sm={6}>
  //         <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
  //           Recursos
  //         </Typography>
  //         <List sx={{
  //           bgcolor: 'None',
  //           position: 'relative',
  //           overflow: 'auto',
  //           maxHeight: 400,
  //           '& ul': { padding: 0 },
  //         }}>
  //           {metaMashups.map((row, idx) => <ListItemButton key={row?.uri?.value} sx={{ p: 0, mb: 1 }}
  //             selected={selectedIndex === idx}
  //             onClick={(event) => handleListItemClick(event, idx, row)}
  //           >
  //             <MCard
  //               bgcolor={changeBgColorCard(idx)}>
  //               <Box sx={{ width: 470 }}>
  //                 <Grid item sm={12} gap={3}>
  //                   <Stack direction="row" spacing={1}>
  //                     <Typography variant="h6" component="div">
  //                       {row?.label?.value}
  //                     </Typography>
  //                   </Stack>
  //                   <Stack direction="row" spacing={1}>
  //                     <Typography variant="caption" component="div" color="gray" sx={{fontSize:"0.55rem"}}>
  //                       {row?.uri?.value}
  //                     </Typography>
  //                   </Stack>
  //                   <Stack direction="row" spacing={1}>
  //                     <Typography variant="caption" component="div" color="purple">
  //                       {row?.description?.value}
  //                     </Typography>
  //                   </Stack>
  //                   <Stack direction="row" gap={1}>
  //                     <Tooltip title="Construir Metadados de Artefatos">
  //                       <IconButton onClick={() => {
  //                         navigate(ROUTES.META_MASHUP_MANAGE, { state: row })
  //                       }}>
  //                         <ConstructionIcon />
  //                       </IconButton>
  //                     </Tooltip>
  //                     <Tooltip title="Editar Metadados de Autoria">
  //                       <IconButton sx={{ fontSize: 3 }} edge="end" aria-label="delete" onClick={() => { navigate(ROUTES.META_MASHUP_FORM, { state: row }) }}>
  //                         <EditTwoToneIcon />
  //                       </IconButton>
  //                     </Tooltip>
  //                     <Tooltip title="Deletar Grafo de Metadados">
  //                       <IconButton edge="end" aria-label="delete" onClick={() => handleClickOpenDialogToConfirmDelete(row)}>
  //                         <DeleteIcon />
  //                       </IconButton>
  //                     </Tooltip>
  //                   </Stack>
  //                 </Grid>
  //               </Box>
  //             </MCard>
  //           </ListItemButton>
  //           )}
  //         </List>
  //       </Grid>

  //       <Grid item sm={6}>
  //         <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
  //           Propriedades
  //         </Typography>
  //         {properties.length > 0 && <Box sx={{ width: "100%", height: "400" }}>
  //           <Paper sx={{ maxHeight: 400, background: "None" }} elevation={0}>
  //             <List sx={{
  //               width: '100%',
  //               bgcolor: 'background.paper',
  //               position: 'relative',
  //               overflow: 'auto',
  //               maxHeight: 400,
  //               padding: 1
  //             }}>

  //               {properties.map((row, idx) => <>
  //                 <ListItem key={idx}>
  //                   <Stack>
  //                     <Typography sx={{ fontSize: 14, fontWeight: 600 }} color="text.primary" gutterBottom>
  //                       {row?.l ? row?.l?.value : row?.p?.value}
  //                     </Typography>

  //                     <Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.secondary" gutterBottom>
  //                       {row.o.value}
  //                     </Typography>
  //                   </Stack>
  //                 </ListItem>
  //               </>
  //               )}
  //             </List>
  //           </Paper>
  //         </Box>
  //         }
  //       </Grid>
  //     </Grid>

  //     <MDialogToConfirmDelete
  //       openConfirmDeleteDialog={openDialogToConfirmDelete}
  //       setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
  //       deleteInstance={handleRemove}
  //       instance={selectedMashup}
  //     />
  //   </div >
  // );
}