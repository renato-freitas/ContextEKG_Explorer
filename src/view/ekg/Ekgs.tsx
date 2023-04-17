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
import Construction from '@mui/icons-material/Construction';
import DeleteForever from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from 'react-router-dom';

import styles from './ListEkg.module.css';

import { api } from "../../services/api";
import { findAllMetadataGraphs, IMetadataGraphForm, removeMetadataGraph } from '../../services/sparql-metagraph';
import { METADATA_GRAHP_TYPE, ROUTES } from '../../commons/constants';
import { Avatar, Box, CardActions, CardContent, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { MTable } from "../../components/MTable";
import { MDialogToConfirmDelete } from "../../components/MDialog";
import { RDF_Node } from "../../models/RDF_Node";
import { MetadataGraphEntity } from "../../models/MetadataGraphEntity";
import { TitleWithButtonBack } from "../../components/MTitleWithButtonBack";
import { print_ } from "../../commons/utils";
import { MetaEKGProperties } from "../../models/MetaEKGProperties";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";



export function MetagraphList() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [metagraphs, setMetagraphs] = useState<MetadataGraphEntity[]>([] as MetadataGraphEntity[]);
  const [selectedMetadataGraph, setSelectedMetadataGraph] = useState<MetadataGraphEntity>({} as MetadataGraphEntity);

  const [selectedMetaEKG, setSelectedMetaEKG] = useState<MetaEKGProperties>({} as MetaEKGProperties);
  const [metaEKGs, setMetaEKGs] = useState<MetaEKGProperties[]>([] as MetaEKGProperties[])
  async function loadMetaEKG() {
    try {
      setLoading(true);
      const response = await api.get("/meta-ekg");
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
          print_(`/propriedades/?uri=${encodeURIComponent(selectedMetaEKG?.uri?.value)}`)
          const response = await api.get(`/propriedades/?uri=${encodeURIComponent(selectedMetaEKG?.uri?.value)}`);
          print_(``, response)
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
  const handleClickOpenDialogToConfirmDelete = (row: MetadataGraphEntity) => {
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

  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <div className={styles.listkg}>

      <TitleWithButtonBack
        title="Grafos de Metadados"
        buttonLabel="+ MetaEKG"
        openForm={openForm} />

      {/* <Grid container spacing={2}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Novo Grafo de Metadados</Button>
        </Grid>
      </Grid>
      <br /> */}
      <Grid container spacing={2}>
        <Grid item sm={5}>
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
                    {row.uri_l.value}
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

        </Grid>

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