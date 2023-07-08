import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, IconButton, ListItem, Paper, Stack, TableCell, TableRow, Tooltip, Typography, List, ListItemButton } from '@mui/material';
import { Construction, DeleteForever, EditTwoTone } from '@mui/icons-material';
import Storage from '@mui/icons-material/Storage';

import { Table, Database, CaretCircleLeft } from 'phosphor-react';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';

import { MTable } from '../../components/MTable';
import { TablePaginationActions } from '../../commons/pagination';
import { MDialogToConfirmDelete } from '../../components/MDialog';

import { MetadataGraphEntity } from '../../models/MetadataGraphEntity';
import { DataSourceEntity } from '../../models/DataSourceEntity';
import { LocalGraphEntity } from '../../models/LocalGraphEntity';

import { findAllOrganizations } from '../../services/sparql-organization';
import { ROUTES } from '../../commons/constants';
import styles from '../datasources/DataSource.module.css';
import { findAllExportedViews } from '../../services/sparql-exported-view';
import { SemanticViewEntity } from '../../models/SemanticViewEntity';
import { TitleWithButtonBack } from '../../components/MTitleWithButtonBack';
import { MCard } from '../../components/mcard/MCard';
import { double_encode_uri, printt } from '../../commons/utils';
import { api } from '../../services/api';
import { PropertyObjectEntity } from '../../models/PropertyObjectEntity';

export function ExportedViews() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [exportedView, setExportedViews] = useState<LocalGraphEntity[]>([]);
  const [selectedExportedView, setSelectedExportedView] = useState<LocalGraphEntity>({} as LocalGraphEntity);
  const [selectedOrganization, setSelectedOrganization] = useState<LocalGraphEntity>({} as LocalGraphEntity);

  async function loadExportedViews() {
    printt("Lista das fontes de dados")
    setLoading(true);
    try {
      const response = await api.get("/exportedviews");
      console.log(response.data)
      setLoading(false);
      setExportedViews(response.data);
    } catch (error) {
      console.error("loadExportedViews", error)
    }
  }

  useEffect(() => {
    loadExportedViews();
  }, [])


  const [properties, setProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  useEffect(() => {
    async function loadDataSourceProperties() {
      try {
        setLoading(true);
        if (selectedExportedView?.uri) {
          let decode_uri = double_encode_uri(selectedExportedView?.uri?.value)
          const response = await api.get(`/properties/${decode_uri}`);
          printt(`properties/`, response.data)
          setProperties(response.data)
        }
        // setMetaEKG(response.data)
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    }
    loadDataSourceProperties()
  }, [selectedExportedView])

  /**SELECIONANDO UM RECURSO */
  const [selectedIndex, setSelectedIndex] = React.useState<Number>(1);
  const handleListItemClick = (event: any, idx: Number, row: LocalGraphEntity) => {
    setSelectedIndex(idx);
    setSelectedExportedView(row)
  };

  const openForm = () => {
    console.log("*** Abrir formulário de Grafo Local ***")
    // let ekg = location.state as MetadataGraphEntity;
    let semantic_view = location.state as SemanticViewEntity;
    console.log(`*** semantic_view que tá saíndo da lista e indo para o form`, semantic_view)
    navigate(ROUTES.LOCAL_GRAPH_FORM, { state: { ...semantic_view, from: "d" } });
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
    // setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**Dialog to Delete */
  const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  const handleClickOpenDialogToConfirmDelete = (row: LocalGraphEntity) => {
    console.log(row)
    // setSelectedOrganization(row)
    setOpenDialogToConfirmDelete(true);
  };

  const handleRemove = async (identifier: string) => {
    // await removeDataSource(identifier);
    await loadExportedViews();
  }

  /**EDIT */
  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          // let state = location.state as MetadataGraphEntity;
          let state = location.state as SemanticViewEntity;
          console.log(`*** Carregando a VS selecionada ***`, state)
          // console.log(state)
          // setMetagraph(state)
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);

  return (
    <div className={styles.listkg}>

      <TitleWithButtonBack
        title="Visões Exportadas"
        hasButtonBack
        buttonLabel="+ Visão Exportada"
        openForm={openForm}
      />

      <Grid container spacing={1}>
        {/* Lista das Visões Exportadas */}
        <Grid item sm={6}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
            Recursos
          </Typography>
          {/* <List sx={{
            // width: '100%',
            // maxWidth: 360,
            // bgcolor: 'background.paper',
            // ml:0,
            bgcolor: 'None',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 450,
            '& ul': { padding: 0 },
          }}> */}
          {exportedView.map((row, idx) => <ListItemButton key={row.uri?.value} sx={{ p: 0 }}
            selected={selectedIndex === idx}
            onClick={(event) => handleListItemClick(event, idx, row)}
          >
            <MCard>
              <Box sx={{ width: 450 }}>
                <Grid item sm={12}>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="h6" component="div">
                      {row?.label?.value}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="caption" component="div" color="purple">
                      {row?.uri?.value}
                    </Typography>
                  </Stack>
                  {/* BOTÕES */}
                  <Stack direction="row" gap={1}>
                    <Tooltip title="Construir Metadados de Artefatos">
                      <IconButton onClick={() => navigate(ROUTES.EXPORTED_VIEW_MANAGE, { state: row })}>
                        <ConstructionIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar Metadados">
                      <IconButton edge="end" onClick={() => { navigate(ROUTES.LOCAL_GRAPH_FORM, { state: row }) }}>
                        <EditTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar Grafo de Metadados">
                      <IconButton edge="end" aria-label="delete" onClick={() => handleClickOpenDialogToConfirmDelete(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    {/* <Button variant="contained" color='secondary' onClick={() => navigate(ROUTES.MAPPINGS_LIST, { state: row })}>Mapeamentos</Button> */}
                  </Stack>
                </Grid>
              </Box>
            </MCard>
          </ListItemButton>
          )}
          {/* </List> */}
        </Grid>

        {/* VISÃO DAS PROPRIEDADES */}
        <Grid item sm={6}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
            Propriedades
          </Typography>
          <MCard>
            {properties.length > 0 && <Box sx={{ width: "100%" }}>
              <Paper sx={{ maxHeight: "auto", background: "None" }} elevation={0}>
                {/* <List sx={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 400,
                  padding: 1
                }}> */}

                {properties.map((row, idx) => <>
                  <ListItem key={idx}>
                    <Stack>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }} color="text.primary" gutterBottom>
                        {row?.l ? row?.l?.value : row?.p?.value}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 1, ml: 0 }} color="text.secondary" gutterBottom>
                        {row.o.value}
                      </Typography>
                    </Stack>
                  </ListItem>
                </>
                )}
                {/* </List> */}
              </Paper>
            </Box>
            }
          </MCard>
        </Grid>
      </Grid>
      <MDialogToConfirmDelete
        openConfirmDeleteDialog={openDialogToConfirmDelete}
        setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
        deleteInstance={handleRemove}
        instance={selectedOrganization}
      />
    </div >
  );
}