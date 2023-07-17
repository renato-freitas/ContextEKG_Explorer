import React, { useEffect, useState } from "react"
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

import EditTwoTone from '@mui/icons-material/EditTwoTone';
// import Construction from '@mui/icons-material/Construction';
// import DeleteForever from '@mui/icons-material/DeleteForever';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';

import { useNavigate } from 'react-router-dom';

import styles from './ListEkg.module.css';

import { api } from "../../services/api";
import { IMetadataGraphForm, removeMetadataGraph } from '../../services/sparql-metagraph';
import { METADATA_GRAHP_TYPE, ROUTES } from '../../commons/constants';
import { Avatar, Box, CardActions, CardContent, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { MTable } from "../../components/MTable";
import { MDialogToConfirmDelete } from "../../components/MDialog";
import { RDF_Node } from "../../models/RDF_Node";
import { MetaEKGModel } from "../../models/MetaEKGModel";
import { TitleWithButtonBack } from "../../components/MTitleWithButtonBack";
import { changeBgColorCard, printt } from "../../commons/utils";
import { MetaEKGProperties } from "../../models/MetaEKGProperties";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { MCard } from "../../components/mcard/MCard";



export function MetagraphList() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [metagraphs, setMetagraphs] = useState<MetaEKGModel[]>([] as MetaEKGModel[]);
  const [selectedMetadataGraph, setSelectedMetadataGraph] = useState<MetaEKGModel>({} as MetaEKGModel);

  const [selectedMetaEKG, setSelectedMetaEKG] = useState<MetaEKGModel>({} as MetaEKGModel);
  const [metaEKGs, setMetaEKGs] = useState<MetaEKGModel[]>([] as MetaEKGModel[])
  async function loadMetaEKG() {
    try {
      setLoading(true);
      const response = await api.get("/meta-ekgs/");
      setMetaEKGs(response.data)
      setSelectedMetaEKG(response.data[0])
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadMetaEKG();
  }, [])

  const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  useEffect(() => {
    async function loadMetaEKGProperties() {
      try {
        setLoading(true);
        if (selectedMetaEKG?.uri) {
          printt(`/propriedades/?uri=${encodeURIComponent(selectedMetaEKG?.uri?.value)}`)
          const response = await api.get(`/propriedades/?uri=${encodeURIComponent(selectedMetaEKG?.uri?.value)}`);
          printt(``, response)
          serProperties(response.data)
        }
        // setMetaEKG(response.data)
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    }
    loadMetaEKGProperties()
  }, [selectedMetaEKG])

  const openForm = () => {
    console.log("*** call: Abrir formulário de Metadados de GC ***")
    navigate(ROUTES.METAGRAPHS_FORM);
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
  const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  const handleClickOpenDialogToConfirmDelete = (row: MetaEKGModel) => {
    console.log(row)
    setSelectedMetadataGraph(row)
    setOpenDialogToConfirmDelete(true);
  };

  // const handleRemove = async (identifier: string) => {
  const handleRemove = async (ekg: IMetadataGraphForm) => {
    // await removeMetadataGraph(ekg);
    await loadMetaEKG();
  }
  /**Dialog to Delete */

  const [selectedIndex, setSelectedIndex] = React.useState<Number>(1);
  const handleListItemClick = (event: any, idx: Number, row: MetaEKGModel) => {
    setSelectedIndex(idx);
    setSelectedMetaEKG(row)
  };

  return (
    <div className={styles.listkg}>

      <TitleWithButtonBack
        title="Meta EKGs"
        buttonLabel="+ MetaEKG"
        openForm={openForm} />

      <Grid container spacing={1}>
        {/* LISTA DOS META-EKGs */}
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
            {metaEKGs.map((row, idx) => <ListItemButton key={row?.uri?.value} sx={{ p: 0, mb: 1 }}
              selected={selectedIndex === idx}
              onClick={(event) => handleListItemClick(event, idx, row)}
            >
              <MCard
                bgcolor={changeBgColorCard(idx, selectedIndex)}>
                <Box sx={{ width: 470 }}>
                  <Grid item sm={12} gap={3}>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="h6" component="div">
                        {row?.label?.value}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="caption" component="div" color="gray" sx={{ fontSize: "0.55rem" }}>
                        {row?.uri?.value}
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
                        <IconButton edge="end" aria-label="delete" onClick={() => handleClickOpenDialogToConfirmDelete(row)}>
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

        {/* PROPRIEDADES DO META-EKG */}
        <Grid item sm={6}></Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* <Grid item sm={5}>
          <List sx={{
            // width: '100%',
            // maxWidth: 360,
            // bgcolor: 'background.paper',
            bgcolor: 'None',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
            '& ul': { padding: 0 },
          }}>
            {metaEKGs.map((row, idx) => <ListItemButton key={row.uri.value}
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0)}
            >
              <ListItemAvatar sx={{ minWidth: 45 }}>
                <Avatar sx={{ fontSize: "1rem", width: 30, height: 30 }}>
                  {idx + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: "1rem", fontWeight: 500, m: 0 }} color="text.primary" gutterBottom>
                    {row.label.value}
                  </Typography>
                }
                secondary={<Typography
                  sx={{ display: 'inline', fontSize: "0.66rem" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >{row.uri.value}</Typography>} />
              <Tooltip title="Construir">
                <IconButton onClick={() => navigate(ROUTES.MANAGE_METAGRAPH, { state: row })}>
                  <Construction />
                </IconButton>
              </Tooltip>
              <IconButton edge="end" aria-label="delete" onClick={() => alert("ops")}>
                <EditTwoTone />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => alert("ops")}>
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
            )}
          </List>

        </Grid> */}

        <Grid item sm={7}>
          {properties.length > 0 && <Box sx={{ width: "100%", height: "400" }}>
            <Paper sx={{ maxHeight: 400, background: "None", }}>
              <List sx={{
                width: '100%',
                // maxWidth: 400,
                // bgcolor: 'background.paper',
                bg: 'None',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 400,
                padding: 1
                // '& ul': { padding: 1 },
              }}>
                {properties.map((row) => <>
                  {/* <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.primary" gutterBottom> */}
                  <Typography sx={{ fontSize: 14, fontWeight: 500, bg: "None" }} color="text.primary">
                    {row?.l?.value}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2, ml: 2 }} color="text.secondary" gutterBottom>
                    {row.o.value}
                  </Typography>
                </>)}

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
        instance={selectedMetadataGraph}
      /> */}
    </div>
  )
}

{/* <MTable
            header={[["Título", "left"]]}
            size={metagraphs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            hasActions
            loading={false}
          >
            {(rowsPerPage > 0
              ? metagraphs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : metagraphs
            ).map((row) => (
              <TableRow
                key={row.identifier.value}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Stack>
                    <Typography>{row.title.value}</Typography>
                  </Stack>
                </TableCell>
                <TableCell style={{ whiteSpace: 'break-spaces' }}>{row.comment?.value}</TableCell>
                <TableCell>{row.creator?.value}</TableCell>
                <TableCell align="right">
                  <Stack>
                    <Typography>{new Date(row.created.value).toLocaleDateString()}</Typography>
                    <Typography variant="caption" display="block" gutterBottom>{new Date(row.created.value).toLocaleTimeString()}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack>
                    <Typography>{new Date(row.modified.value).toLocaleDateString()}</Typography>
                    <Typography variant="caption" display="block" gutterBottom>{new Date(row.modified.value).toLocaleTimeString()}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => {
                      console.log("*** Selecionando Grafo de Metadados ***")
                      navigate(ROUTES.METAGRAPHS_FORM, { state: row })
                    }}>
                      <EditTwoTone />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Construir">
                    <IconButton onClick={() => navigate(ROUTES.MANAGE_METAGRAPH, { state: row })}>
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