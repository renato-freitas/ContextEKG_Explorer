import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
// import { DeleteForever, EditTwoTone } from '@mui/icons-material';
import Storage from '@mui/icons-material/Storage';

import { Table, Database, CaretCircleLeft } from 'phosphor-react';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';

import { MTable } from '../../components/MTable';
import { TablePaginationActions } from '../../commons/pagination';
import { MDialogToConfirmDelete } from '../../components/MDialog';

import { METADATA_GRAHP_TYPE, ROUTES } from '../../commons/constants';
import styles from '../datasources/DataSource.module.css';

import { api } from "../../services/api";

import { SemanticViewEntity } from '../../models/SemanticViewEntity';
import { TitleWithButtonBack } from '../../components/MTitleWithButtonBack';
import { MashupEntity } from '../../models/MashupEntity';
// import { findAllMetadataGraphs, removeMetadataGraph } from '../../services/sparql-metagraph';
import { printt } from "../../commons/utils";
import { MetaEKGProperties } from "../../models/MetaEKGProperties";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { MetaMashupModel } from '../../models/MetaMashupModel';
import { MCard } from '../../components/mcard/MCard';

export function MetaMashups() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [metaMashups, setMetaMashups] = useState<MetaMashupModel[]>([]);
  const [selectedMashup, setSelectedMashup] = useState<MetaMashupModel>({} as MetaMashupModel);

  const [selectedMetaEKG, setSelectedMetaEKG] = useState<MetaEKGProperties>({} as MetaEKGProperties);
  const [metaEKG, setMetaEKG] = useState<MetaEKGProperties[]>([] as MetaEKGProperties[])

  async function loadMetaMashups() {
    try {
      setLoading(true);
      const response = await api.get("/meta-mashups");
      printt(`MetaMashups`, response.data)
      setMetaMashups(response.data)
      setSelectedMashup(response.data[0])
      setSelectedIndex(0)
    } catch (error) {
      printt('error', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetaMashups();
  }, [])



  const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  useEffect(() => {
    async function loadMetaMashupProperties() {
      try {
        setLoading(true);
        if (selectedMashup?.uri) {
          printt(`/propriedades/mashup/?uri=${encodeURIComponent(selectedMashup?.uri?.value)}`)
          const response = await api.get(`/propriedades/mashup/?uri=${encodeURIComponent(selectedMashup?.uri?.value)}`);
          printt(`propriedades/mashup/`, response.data)
          serProperties(response.data)
        }
        // setMetaEKG(response.data)
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    }
    loadMetaMashupProperties()
  }, [selectedMashup])

  const openForm = () => {
    printt("ABRIR FORM MASHUP")
    navigate(ROUTES.META_MASHUP_FORM);
  }


  /**Pagination */
  const [page, setPage] = useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**Dialog to Delete */
  // const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  // const handleClickOpenDialogToConfirmDelete = (row: MashupEntity) => {
  //   printt(`MASHUP SELECIONADO`, row)
  //   setSelectedMashup(row)
  //   setOpenDialogToConfirmDelete(true);
  // };

  // const handleRemove = async (mashup: IMetadataGraphForm) => {
  // const handleRemove = async (identifier: string, type: string) => {
  //   printt("DELETANDO MASHUP")
  //   await removeMetadataGraph(identifier, type);
  //   await loadMashups();
  // }

  /**EDIT */
  // useEffect(() => {
  //         // let state = location.state as MetadataGraphEntity;
  //         let state = location.state as SemanticViewEntity;
  //         printt(`Carregando a VS selecionada`, state)
  //         // console.log(state)
  //         // setMetagraph(state)
  //       }
  //     } catch (err) {
  //       printt('err', err);
  //     }
  //   }
  //   onEdit();
  // }, [location.state]);


  const [selectedIndex, setSelectedIndex] = React.useState<Number>(1);
  const handleListItemClick = (event: any, idx: Number, row: MetaMashupModel) => {
    setSelectedIndex(idx);
    setSelectedMashup(row)
  };

  const changeElevation = (idx: Number) => selectedIndex == idx ? 0 : 3;


  return (
    <div className={styles.listkg}>

      <TitleWithButtonBack
        title="MetaMashups"
        buttonLabel="+ MetaMashup"
        openForm={openForm} />


      <Grid container spacing={1}>
        {/* Lista dos metamashups */}
        <Grid item sm={6}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
            Recursos
          </Typography>
          <List sx={{
            bgcolor: 'None',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 400,
            '& ul': { padding: 0 },
          }}>
            {metaMashups.map((row, idx) => <ListItemButton key={row.uri.value} sx={{ p: 0, mb: 0.5 }}
              selected={selectedIndex === idx}
              onClick={(event) => handleListItemClick(event, idx, row)}
            >
              <MCard elevation={changeElevation(idx)}>
                <Box sx={{ width: 470 }}>
                  <Grid item sm={12} gap={3}>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="h6" component="div">
                        {row?.label?.value}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="caption" component="div" color="purple">
                        {row?.description?.value}
                      </Typography>
                    </Stack>
                    {/* BOTÕES */}
                    <Stack direction="row" gap={1}>
                      <Tooltip title="Construir Metadados de Artefatos">
                        <IconButton onClick={() => {
                          navigate(ROUTES.META_MASHUP_MANAGE, { state: row })
                        }}>
                          <ConstructionIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar Metadados de Autoria">
                        <IconButton sx={{ fontSize: 3 }} edge="end" aria-label="delete" onClick={() => { navigate(ROUTES.META_MASHUP_FORM, { state: row }) }}>
                          <EditTwoToneIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar Grafo de Metadados">
                        <IconButton edge="end" aria-label="delete" onClick={() => alert("remover")}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Grid>
                </Box>
              </MCard>
            </ListItemButton>
            )}
          </List>
        </Grid>

        {/* Listas da propriedades do mashup */}
        <Grid item sm={6}>
          {properties.length > 0 && <Box sx={{ width: "100%", height: "400" }}>
            {/* <Paper sx={{ maxHeight: 400, bgcolor: 'None', background: "None" }}> */}
            <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
              Propriedades
            </Typography>
            <Paper sx={{ maxHeight: 400, background: "None" }} elevation={0}>
              <List sx={{
                // background: "None",
                width: '100%',
                // maxWidth: 400,
                // bgcolor: 'background.paper',
                // bgcolor: 'None',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 400,
                padding: 1
                // '& ul': { padding: 1 },
              }}>

                {properties.map((row, idx) => <>
                  <ListItem key={idx}>
                    <Stack>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }} color="text.primary" gutterBottom>
                        {row?.l ? row?.l?.value : row?.p?.value}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 2, ml: 0 }} color="text.secondary" gutterBottom>
                        {row.o.value}
                      </Typography>
                    </Stack>
                  </ListItem>
                </>
                )}
              </List>
            </Paper>
          </Box>
          }
        </Grid>
      </Grid>

      {/* <MDialogToConfirmDelete
        openConfirmDeleteDialog={openDialogToConfirmDelete}
        setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
        deleteInstance={handleRemove}
        instance={selectedMashup}
        type={METADATA_GRAHP_TYPE.MASHUP}
      /> */}
    </div >
  );
}

{/* <MTable
        header={[["Título", "left"], ["Comentário", "left"],
        ["Quem criou", "left"],
        ["Criado em", "right"], ["Modificado em", "right"]]}
        size={mashups.length}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hasActions
        loading={false}
      >
        {
          (rowsPerPage > 0
            ? mashups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : mashups
          ).map(row => (
            <TableRow key={row.identifier.value}>
              <TableCell>
                <Typography>{row.title.value}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{row.comment.value}</Typography>
              </TableCell>
              <TableCell>{row.creator?.value}</TableCell>
              <TableCell align='right'>
                <Stack>
                  <Typography>{new Date(row.created.value).toLocaleDateString()}</Typography>
                  <Typography variant="caption" display="block" gutterBottom>{new Date(row.created.value).toLocaleTimeString()}</Typography>
                </Stack>
              </TableCell>
              <TableCell align='right'>
                <Stack>
                  <Typography>{new Date(row.modified.value).toLocaleDateString()}</Typography>
                  <Typography variant="caption" display="block" gutterBottom>{new Date(row.modified.value).toLocaleTimeString()}</Typography>
                </Stack>
              </TableCell>
              <TableCell align='center'>
                <Tooltip title="Editar">
                  <IconButton onClick={() => {
                    navigate(ROUTES.MASHUP_FORM, { state: row })
                  }}>
                    <EditTwoTone />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Construir">
                  <IconButton onClick={() => {
                    navigate(ROUTES.MASHUP_MANAGE, { state: row })
                    print_("SELECIONANDO MASHUP", row);
                  }}>
                    <Construction />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Excluir">
                  <IconButton onClick={() => handleClickOpenDialogToConfirmDelete(row)}>
                    <DeleteForever />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
      </MTable> */}