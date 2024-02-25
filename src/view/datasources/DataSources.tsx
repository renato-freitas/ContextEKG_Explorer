import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { IconButton, ListItemIcon, TableCell, TableRow, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';

import { ROUTES } from '../../commons/constants';
import { DataSourceModel } from '../../models/DataSourceModel';
import styles from './DataSource.module.css';
import { api } from '../../services/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';

import { Database, FileCsv, Table } from 'phosphor-react';


import { double_encode_uri, getPropertyFromURI } from "../../commons/utils";
import { MDialogToConfirmDelete } from '../../components/MDialog';
import { DeleteForever, EditAttributesTwoTone, EditTwoTone } from '@mui/icons-material';

const PAINEL_LEFT_SIZE = window.screen.width * 0.33
const PAINEL_RIGHT_SIZE = window.screen.width * 0.46
const DATASOURCE_TYPES_ICONS_SIZE = 20
const DATASOURCE_TYPES_ICONS = {
  "http://rdbs-o#Relational_Database": <Database size={DATASOURCE_TYPES_ICONS_SIZE} />,
  "https://www.ntnu.no/ub/ontologies/csv#CsvDocument": <FileCsv size={DATASOURCE_TYPES_ICONS_SIZE} />
}

export function DataSources() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<DataSourceModel[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceModel>({} as DataSourceModel);


  async function loadDataSources() {
    console.log("*** Lista das fontes de dados")
    setLoading(true);
    try {
      const response = await api.get("/datasources");
      console.log(response.data)
      setLoading(false);
      setDataSources(response.data);
      setSelectedDataSource(response.data[0])
    } catch (error) {
      console.error("loadDataSources", error)
    } finally {
      loadDataSourceProperties()
    }
  }

  useEffect(() => {
    loadDataSources();
  }, [])


  // const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  // const [properties, serProperties] = useState<PropertyObjectEntity>({} as PropertyObjectEntity);
  const [properties, serProperties] = useState<any>({});
  async function loadDataSourceProperties() {
    try {
      setLoading(true);
      if (selectedDataSource?.uri) {
        console.log(`/properties/${encodeURIComponent(selectedDataSource?.uri?.value)}`)
        let decode_uri = encodeURIComponent(selectedDataSource?.uri?.value)
        const response = await api.get(`/properties/${encodeURIComponent(decode_uri)}/False`);
        console.log(`*** properties/`, response.data)
        serProperties(response.data)
      }
      // setMetaEKG(response.data)
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

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

  const [selectedIndex, setSelectedIndex] = React.useState<Number>(0);
  const handleListItemClick = (event: any, idx: Number, row: DataSourceModel) => {
    setSelectedIndex(idx);
    setSelectedDataSource(row)
  };

  // const [selectedIndex, setSelectedIndex] = React.useState(0);

  // const handleListItemClick = (
  //   event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   index: number,
  // ) => {
  //   setSelectedIndex(index);
  // };

  return (
    <div className={styles.listkg}>

      <h4>Fontes de Dados</h4>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Nova Fonte de Dados</Button>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        {/* <Grid item sm={5} bgcolor='#343434' justifyContent={'center'}> */}
        <Grid item sm={5} justifyContent={'center'}>
          <Box sx={{ width: '100%', maxWidth: PAINEL_LEFT_SIZE, bgcolor: 'background.paper', borderRadius: 1 }}>
            <List component="nav" aria-label="main mailbox folders">
              {
                dataSources.map((resource, idx) => <ListItemButton
                  selected={selectedIndex === idx}
                  onClick={(event) => handleListItemClick(event, idx, resource)}
                >
                  <ListItemIcon>
                    {DATASOURCE_TYPES_ICONS[resource?.type?.value]}
                  </ListItemIcon>
                  <ListItemText primary={resource.label?.value} />

                  <TableRow key={resource?.uri?.value}>
                    <TableCell align='center'>
                      <Tooltip title="Tabelas">
                        <IconButton onClick={() => {
                          navigate(ROUTES.TABLE_LIST, { state: resource })
                          console.log(resource)
                          // setSelectedDataSource(resource);
                        }}>
                          <Table size={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => {
                          console.log("*** Selecionando Grafo de Metadados ***")
                          navigate(ROUTES.DATASOURCE_FORM, { state: resource })
                        }}>
                          <EditAttributesTwoTone />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton onClick={() => handleClickOpenDialogToConfirmDelete(resource)}>
                          <DeleteForever />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                </ListItemButton>)
              }
            </List>
          </Box>
        </Grid>

        {/* Propriedades */}
        <Grid item sm={7}>
          {
            properties && <Box sx={{ width: "100%", maxWidth: PAINEL_RIGHT_SIZE }}>
              <Paper elevation={0}>
                <List sx={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'auto',
                  // maxHeight: 400,
                  padding: 1
                }}>
                  {
                    Object.keys(properties).map((row, idx) => <ListItem key={idx}>
                      <Grid container spacing={2}>
                        {/* Propriedades */}
                        <Grid item sm={3}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                            {getPropertyFromURI(properties[row][0]?.p?.value)}
                          </Typography>
                          <Typography key={idx} variant="body2" sx={{ mb: 2, ml: 0 }} color="text.secondary" gutterBottom>
                            . {properties[row][0]?.o?.value}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    )
                  }
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
        instance={selectedDataSource}
      />
    </div>
  )
}