import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { IconButton, Stack } from '@mui/material';


import { ROUTES } from '../../commons/constants';
// import { findGlobalDataSources, removeDataSource } from '../../services/sparql-datasource';
import { DataSourceModel } from '../../models/DataSourceModel';
import styles from './DataSource.module.css';
import { TitleWithButtonBack } from '../../components/MTitleWithButtonBack';
import { api } from '../../services/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
// import { DeleteForever, EditTwoTone } from '@mui/icons-material';

import { Table, CaretCircleLeft } from 'phosphor-react';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import ConstructionIcon from '@mui/icons-material/Construction';

import { MTable } from '../../components/MTable';
import { TablePaginationActions } from '../../commons/pagination';
import { PropertyObjectEntity } from "../../models/PropertyObjectEntity";

import { double_encode_uri, printt } from "../../commons/utils";
import { MDialogToConfirmDelete } from '../../components/MDialog';
import { MCard } from '../../components/mcard/MCard';

export function DataSources() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<DataSourceModel[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceModel>({} as DataSourceModel);

  async function loadDataSources() {
    printt("Lista das fontes de dados")
    setLoading(true);
    try {
      const response = await api.get("/datasources");
      console.log(response.data)
      setLoading(false);
      setDataSources(response.data);
    } catch (error) {
      console.error("loadDataSources", error)
    }
  }

  useEffect(() => {
    loadDataSources();
  }, [])


  const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  useEffect(() => {
    async function loadDataSourceProperties() {
      try {
        setLoading(true);
        if (selectedDataSource?.uri) {
          printt(`/properties/${encodeURIComponent(selectedDataSource?.uri?.value)}`)
          let decode_uri = encodeURIComponent(selectedDataSource?.uri?.value)
          const response = await api.get(`/properties/${encodeURIComponent(decode_uri)}`);
          printt(`properties/`, response.data)
          serProperties(response.data)
        }
        // setMetaEKG(response.data)
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    }
    loadDataSourceProperties()
  }, [selectedDataSource])

  const openForm = () => {
    console.log("*** call: Abrir formulário de Fonte de Dados ***")
    navigate(ROUTES.DATASOURCE_FORM);
  }


  /**Pagination */
  // const [page, setPage] = useState(0);
  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(event.target.value)
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  /**Dialog to Delete */
  const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  const handleClickOpenDialogToConfirmDelete = (row: DataSourceModel) => {
    console.log(row)
    setSelectedDataSource(row)
    setOpenDialogToConfirmDelete(true);
  };

  const handleRemove = async (normal_uri: string) => {
    let encoded_uri = double_encode_uri(normal_uri)
    await api.delete(`/datasources/${encoded_uri}`)
    await loadDataSources();
  }

  const [selectedIndex, setSelectedIndex] = React.useState<Number>(1);
  const handleListItemClick = (event: any, idx: Number, row: DataSourceModel) => {
    setSelectedIndex(idx);
    setSelectedDataSource(row)
  };

  return (
    <div className={styles.listkg}>

      <TitleWithButtonBack
        title="Fonte de Dados"
        buttonLabel="+ Fonte"
        openForm={openForm} />

      <Grid container spacing={1}>
        {/* Lista das fontes de dados */}
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
            {dataSources.map((row, idx) => <ListItemButton key={row.uri?.value} sx={{ p: 0 }}
              selected={selectedIndex === idx}
              onClick={(event) => handleListItemClick(event, idx, row)}
            >
              <MCard>
                <Box sx={{ width: 470 }}>
                  <Grid item sm={12}>
                    <Stack direction="row" spacing={2}>
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
                      <Tooltip title="Construir Metadados">
                        <IconButton onClick={() => {
                          navigate(ROUTES.META_MASHUP_MANAGE, { state: row })
                        }}>
                          <ConstructionIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar Metadados">
                        <IconButton edge="end" onClick={() => { navigate(ROUTES.DATASOURCE_FORM, { state: row }) }}>
                          <EditTwoToneIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar Fonte de Dados">
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

        {/* Listas de propriedades */}
        <Grid item sm={6}>
          {properties.length > 0 && <Box sx={{ width: "100%", height: "400" }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 600 }} color="purple" gutterBottom>
              Propriedades
            </Typography>
            <Paper sx={{ maxHeight: 400, background: "None" }} elevation={0}>
              <List sx={{
                width: '100%',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 400,
                padding: 1
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
        {/* Fim */}
      </Grid>

      <MDialogToConfirmDelete
        openConfirmDeleteDialog={openDialogToConfirmDelete}
        setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
        deleteInstance={handleRemove}
        instance={selectedDataSource}
      />
    </div>
  )


}