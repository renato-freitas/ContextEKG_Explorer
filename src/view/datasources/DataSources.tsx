import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { CircularProgress, IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';

import { ROUTES, VSKG_TBOX } from '../../commons/constants';
import { DataSourceModel } from '../../models/DataSourceModel';
import styles from './DataSource.module.css';
import { api } from '../../services/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ListItem, Paper, Typography } from '@mui/material';

import { Database, FileCsv, Eye, Trash, PencilSimpleLine, Table } from 'phosphor-react';


import { double_encode_uri, getPropertyFromURI } from "../../commons/utils";
import { MDialogToConfirmDelete } from '../../components/MDialog';
import { MTable } from '../../components/MTable';

const PAINEL_LEFT_SIZE = window.screen.width * 0.356
const PAINEL_RIGHT_SIZE = window.screen.width * 0.5
const DATASOURCE_TYPES_ICONS_SIZE = 20
const PAPER_ELEVATION = 2
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
      const response = await api.get("/datasources/");
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
  // const [properties, serProperties] = useState<any>({});
  const [properties, serProperties] = useState<any>([]);
  async function loadDataSourceProperties() {
    try {
      setLoading(true);
      if (selectedDataSource?.uri) {
        console.log(`*** /datasources/${encodeURIComponent(selectedDataSource?.uri?.value)}/properties/`)
        let decode_uri = encodeURIComponent(selectedDataSource?.uri?.value)
        const response = await api.get(`/datasources/${encodeURIComponent(decode_uri)}/properties/`);
        console.log(`*** properties/`, response.data)
        serProperties(response.data)
      }
      // setMetaEKG(response.data)
    } catch (error) {
      alert(error)
    } finally {
      setTimeout(() => setLoading(false), 500)
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

  const handleAddSchemas = async (normal_uri: string) => {
    let encoded_uri = double_encode_uri(normal_uri)
    await api.post(`/datasources/schemas/${encoded_uri}`)
    // await loadDataSources();
  }

  return (
    <div className={styles.listkg}>

      {/* HEADER */}
      <Grid container spacing={1} sx={{ p: '10px 0' }}>
        <Grid item xs={4}>
          <h4>Fontes de Dados</h4>
        </Grid>
        <Grid item xs={8} gap={1} display='flex' justifyContent='flex-end'
          sx={{ pt: '0px !important' }}>
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Nova Fonte de Dados</Button>
        </Grid>
      </Grid>

      {/* CONTENT */}
      <Grid container spacing={4} sx={{ mb: 1 }}>
        {/* DATA SOURCES */}
        <Grid item sm={6} justifyContent={'center'}>
          <MTable
            header={[["Recursos", "left"]]}
            size={dataSources.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            hasActions
            alignActions='right'
            loading={false}
          >
            {
              (rowsPerPage > 0
                ? dataSources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : dataSources
              ).map((resource, idx) => (
                <TableRow key={idx} >
                  <TableCell>
                    <Stack direction={'row'} gap={1}>
                      {DATASOURCE_TYPES_ICONS[resource?.type?.value]}
                      <Typography>{resource.label.value}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align='right' sx={{p:"0 6px 0 0"}}>
                    <Tooltip title="Propriedades">
                      <IconButton onClick={(event) => handleListItemClick(event, idx, resource)} sx={{p:"4px !important"}}> 
                        <Eye size={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        onClick={() => navigate(ROUTES.DATASOURCE_FORM, { state: resource }) } 
                        sx={{p:"4px !important"}}>
                        <PencilSimpleLine size={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Esquemas">
                      <IconButton onClick={() => {
                        console.log("*** Selecionando a Fonte de Dados ***")
                        // handleAddSchemas(resource.uri.value)
                        navigate(ROUTES.TABLE_LIST, { state: resource })
                      }} sx={{p:"4px !important"}}>
                        <Table size={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleClickOpenDialogToConfirmDelete(resource)} sx={{p:"4px !important"}}>
                        <Trash size={22} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </MTable>
        </Grid>

        {/* PROPERTIES */}
        <Grid item sm={6}>
          {
            properties && <Box sx={{ width: "100%", maxWidth: PAINEL_RIGHT_SIZE }}>
              <Paper elevation={PAPER_ELEVATION}>
                <div style={{ background: "#1976d214", padding: "0px 10px 0px 10px" }}>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Stack direction='row' gap={1}>
                      {DATASOURCE_TYPES_ICONS[selectedDataSource?.type?.value]}
                      <h4>{selectedDataSource?.label?.value}</h4>
                    </Stack>
                    {loading && <CircularProgress size={20} />}
                  </Stack>

                </div>
                <List sx={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'auto',
                  padding: 1
                }}>
                  {/* {
                    Object.keys(properties).map((row, idx) => (properties[row][0]?.p?.value != VSKG_TBOX.PROPERTY.RDF_TYPE && properties[row][0]?.p?.value != VSKG_TBOX.PROPERTY.LABEL) && <ListItem key={idx} sx={{pb:0}}>
                      <Grid container>
                        <Grid item sm={12}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                            {getPropertyFromURI(properties[row][0]?.p?.value)}
                          </Typography>
                          <Typography key={idx} variant="body2" sx={{ m: "10px 0px 0x 1px" }} color="text.secondary" gutterBottom>
                            {properties[row][0]?.o?.value}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    )
                  } */}
                  {
                    properties.map((row, idx) => (row?.p?.value != VSKG_TBOX.PROPERTY.RDF_TYPE && row?.p?.value != VSKG_TBOX.PROPERTY.LABEL) && <ListItem key={idx} sx={{pb:0}}>
                      <Grid container>
                        <Grid item sm={12}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                            {getPropertyFromURI(row?.p?.value)}
                          </Typography>
                          <Typography key={idx} variant="body2" sx={{ m: "10px 0px 0x 1px" }} color="text.secondary" gutterBottom>
                            {row?.o?.value}
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
    </div >
  )
}