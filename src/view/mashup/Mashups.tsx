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
import { findAllMetadataGraphs, removeMetadataGraph } from '../../services/sparql-metagraph';
import { print_ } from "../../commons/utils";
import { MetaEKGProperties } from "../../models/MetaEKGProperties";
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";
import { MetaMashup } from '../../models/MetaMashup';

export function Mashups() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [mashups, setMashups] = useState<MetaMashup[]>([]);
  const [selectedMashup, setSelectedMashup] = useState<MetaMashup>({} as MetaMashup);

  const [selectedMetaEKG, setSelectedMetaEKG] = useState<MetaEKGProperties>({} as MetaEKGProperties);
  const [metaEKG, setMetaEKG] = useState<MetaEKGProperties[]>([] as MetaEKGProperties[])
  async function loadMashups() {
    try {
      setLoading(true);
      const response = await api.get("/meta-mashup");
      print_(`mashups`, response.data)
      setMashups(response.data)
      setSelectedMashup(response.data[0])
      setSelectedIndex(0)
    } catch (error) {
      print_('error', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMashups();
  }, [])

  const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  useEffect(() => {
    async function loadMetaEKGProperties() {
      try {
        setLoading(true);
        if (selectedMashup?.uri) {
          print_(`/propriedades/mashup/?uri=${encodeURIComponent(selectedMashup?.uri?.value)}`)
          const response = await api.get(`/propriedades/mashup/?uri=${encodeURIComponent(selectedMashup?.uri?.value)}`);
          print_(`propriedades/mashup/`, response.data)
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
  }, [selectedMashup])

  const openForm = () => {
    print_("ABRIR FORM MASHUP")
    navigate(ROUTES.MASHUP_FORM);
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
  const handleClickOpenDialogToConfirmDelete = (row: MashupEntity) => {
    print_(`MASHUP SELECIONADO`, row)
    setSelectedMashup(row)
    setOpenDialogToConfirmDelete(true);
  };

  // const handleRemove = async (mashup: IMetadataGraphForm) => {
  const handleRemove = async (identifier: string, type: string) => {
    print_("DELETANDO MASHUP")
    await removeMetadataGraph(identifier, type);
    await loadMashups();
  }

  /**EDIT */
  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          // let state = location.state as MetadataGraphEntity;
          let state = location.state as SemanticViewEntity;
          print_(`Carregando a VS selecionada`, state)
          // console.log(state)
          // setMetagraph(state)
        }
      } catch (err) {
        print_('err', err);
      }
    }
    onEdit();
  }, [location.state]);


  const [selectedIndex, setSelectedIndex] = React.useState<Number>(1);
  const handleListItemClick = (event, idx: Number, row: MetaMashup) => {
    setSelectedIndex(idx);
    setSelectedMashup(row)
  };

  return (
    <div className={styles.listkg}>

      <TitleWithButtonBack
        title="Mashups de Dados"
        buttonLabel="+ Mashup"
        openForm={openForm} />

      {/* <nav><Link to={ROUTES.ORGANIZATION_DOC}>Documento</Link></nav> */}
      {/* <Typography variant='caption'>Nessa tela são listas as organizações cadastradas globalmente na plataforma. Elas podem ser reutilizadas na construção de vários Grafos de Metadados</Typography> */}

      {/* <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Novo Mashup</Button>
        </Grid>
      </Grid> */}


      <Grid container spacing={2}>
        {/* Lista dos mashups */}
        <Grid item sm={5}>
          <List sx={{
            // width: '100%',
            // maxWidth: 360,
            // bgcolor: 'background.paper',
            bgcolor: 'None',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 400,
            '& ul': { padding: 0 },
          }}>
            {mashups.map((row, idx) => <ListItemButton key={row.identifier.value}
              selected={selectedIndex === idx}
              onClick={(event) => handleListItemClick(event, idx, row)}
            >
              <ListItemAvatar sx={{ minWidth: 45 }}>
                <Avatar sx={{ fontSize: "1rem", width: 30, height: 30 }}>
                  {idx + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: "1rem", fontWeight: 600, m: 0 }} color="text.primary" gutterBottom>
                    {row.uri_l.value}
                  </Typography>
                }
                secondary={<Typography
                  sx={{ display: 'inline', fontSize: "0.66rem" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >{row.uri.value}</Typography>} />
              <Tooltip title="Construir Metadados de Artefatos">
                <IconButton onClick={() => {
                  navigate(ROUTES.MASHUP_MANAGE, { state: row })
                  print_("SELECIONANDO MASHUP", row);
                }}>
                  <ConstructionIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar Metadados de Autoria">
                <IconButton sx={{ fontSize: 3 }} edge="end" aria-label="delete" onClick={() => alert("editar")}>
                  <EditTwoToneIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deletar Grafo de Metadados">
                <IconButton edge="end" aria-label="delete" onClick={() => alert("remover")}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemButton>
            )}
          </List>
        </Grid>

        {/* Listas da propriedades do mashup */}
        <Grid item sm={7}>
          {properties.length > 0 && <Box sx={{ width: "100%", height: "400" }}>
            {/* <Paper sx={{ maxHeight: 400, bgcolor: 'None', background: "None" }}> */}
            <Paper sx={{ maxHeight: 400, background: "None" }} elevation={3}>
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
                <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
                  Propriedades
                </Typography>
                {properties.map((row, idx) => <>
                  {/* <ListItem key={idx}> */}
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.primary" gutterBottom>
                    {row?.l ? row?.l?.value : row?.p?.value}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2, ml: 2 }} color="text.secondary" gutterBottom>
                    {row.o.value}
                  </Typography>
                  {/* </ListItem> */}
                </>
                )}
              </List>
            </Paper>
          </Box>
          }
        </Grid>
      </Grid>

      <MDialogToConfirmDelete
        openConfirmDeleteDialog={openDialogToConfirmDelete}
        setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
        deleteInstance={handleRemove}
        instance={selectedMashup}
        type={METADATA_GRAHP_TYPE.MASHUP}
      />
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