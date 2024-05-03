import { Key, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Divider, Grid, IconButton, List, ListItem, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { CaretCircleLeft, Columns, Database, Equalizer, Eye, FileCsv, Graph, Table, Trash } from 'phosphor-react';
import { DataSourceEntity } from '../../../models/DataSourceEntity';
import styles from '../DataSource.module.css';
import { api } from '../../../services/api';
import { double_encode_uri, getPropertyFromURI } from '../../../commons/utils';
import { RDF_Node } from '../../../models/RDF_Node';
import { VSKG_TBOX } from '../../../commons/constants';
import { MHeader } from '../../../components/MHeader';
import { MDialogToConfirmDelete } from '../../../components/MDialog';

interface IDataSource {
  uri: RDF_Node;
  identifier: RDF_Node;
  title: RDF_Node;
  label: RDF_Node;
  description: RDF_Node;
  type: RDF_Node;
  comment: RDF_Node;
  page: RDF_Node;
  creator: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
}
const PAINEL_LEFT_SIZE = window.screen.width * 0.27
const PAINEL_RIGHT_SIZE = window.screen.width * 0.5
const DATASOURCE_TYPES_ICONS_SIZE = 20
const PAPER_ELEVATION = 2
const DATASOURCE_TYPES_ICONS = {
  "http://rdbs-o#Relational_Database": <Database size={DATASOURCE_TYPES_ICONS_SIZE} />,
  "https://www.ntnu.no/ub/ontologies/csv#CsvDocument": <FileCsv size={DATASOURCE_TYPES_ICONS_SIZE} />
}

export function TablesOrFiles() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<DataSourceEntity[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceEntity>({} as DataSourceEntity);
  const [selectedTable, setSelectedTable] = useState<any>({} as any);
  const [selectedColumn, setSelectedColumn] = useState<any>({} as any);

  async function loadTables() {
    console.log("*** Lista das tabelas ou arquivos")
    setLoading(true);
    try {
      if (location.state) {
        let state = location.state as DataSourceEntity;
        setSelectedDataSource(state);
        // console.log(`*** ${state}`)
        console.log('onEdite(), uri', state.uri.value)
        let encoded_uri_datasource = double_encode_uri(state.uri.value)
        /** Verificar se os esquemas das tabelas foram processados */
        const response = await api.get(`/datasources/${encoded_uri_datasource}/schema/`)
        console.log('*** LOAD TABLES',response.data)
        getOrCreateSchemas(encoded_uri_datasource, response.data);
      }
    } catch (error) {
      console.error("loadDataSources", error)
    } finally {
      setLoading(false);
      // loadDataSourceProperties()
    }
  }

  useEffect(() => {
    loadTables();
  }, [])


  async function handleClickLoadColumns(table: any) {
    console.log("*** Listar as colunas de uma tabela", table.uri.value)
    setLoading(true);
    try {

      let encoded_uri_of_table = double_encode_uri(table.uri.value)
      /** Verificar se os esquemas das tabelas foram processados */
      const response = await api.get(`/datasources/tables/${encoded_uri_of_table}/columns/`)

      console.log(response.data)
      // getOrCreateColumnsSchemas(response.data)
      setColumns(response.data)
    } catch (error) {
      console.error("load columns", error)
    } finally {
      setLoading(false);
      // loadDataSourceProperties()
    }
  }


  const [properties, serProperties] = useState<any>([]);
  async function handleClickLoadColumnsProperties(column: any) {
    console.log("*** Listar as propriedades da coluna", column.o.value)
    try {
      setLoading(true);
      setSelectedColumn(column)
      if (column.o.value) {
        let decode_uri = encodeURIComponent(column.o.value)
        const response = await api.get(`/resource/${encodeURIComponent(decode_uri)}/properties`);
        console.log(`*** properties/`, response.data)
        serProperties(response.data)
      }
    } catch (error) {
      alert(error)
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }


  async function getOrCreateSchemas(encoded_uri_datasource: string, data: any[]) {
    if (data.length > 0) {
      console.log(`Esquemas (tabelas e colunas) já foram processados`)
      setTables(data)
    }
    else { // extrair e registrar os esquemas
      console.log(`Esquemas ainda não materializados`)
      const response = await api.post(`/datasources/${encoded_uri_datasource}/schema/`)
      setTables(response.data)
    }
  }


  // const openForm = () => {
  //   console.log("*** call: Abrir formulário de Fonte de Dados ***")
  //   navigate(ROUTES.DATASOURCE_FORM);
  // }


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
  const handleClickOpenDialogToConfirmDelete = (row: any) => {
    console.log(row)
    setSelectedTable(row)
    setOpenDialogToConfirmDelete(true);
  };

  const handleRemove = async (normal_uri: string) => {
    // await removeDataSource(normal_uri);
    let encoded_uri_table = double_encode_uri(normal_uri)
    console.log(`uri table ${encoded_uri_table}`)
    await api.delete(`/tables/${encoded_uri_table}`)
    await loadTables();
  }
  /**Dialog to Delete */



  return (
    <div className={styles.listkg}>
      {/* HEADER */}
      {/* <Grid container>
        <Grid item xs={1}>
          <IconButton onClick={() => navigate(-1)}>
            <CaretCircleLeft />
          </IconButton>
        </Grid>
        <Grid item xs={11}>
          <h4>Fontes de Dados</h4>
        </Grid>
      </Grid> */}
      <MHeader
        title={`Fonte de dados ${selectedDataSource?.label?.value}`}
        hasButtonBack
      />

      {/* CONTENT */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {/* TABELAS DISPONÍVEIS */}
        <Grid item sm={4}>
          {
            tables.length > 0 && <Box sx={{ width: "100%", maxWidth: PAINEL_LEFT_SIZE }}>
              <Paper elevation={PAPER_ELEVATION}>
                <div style={{ background: "#1976d214", padding: "0px 10px 0px 10px" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Stack direction='row' gap={1}>
                      <Table size={22} />
                      <h4>{selectedDataSource?.label?.value ? 'Tabelas' : ''}</h4>
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
                  {
                    // Object.keys(tables).map((row: any, idx) => <ListItem key={idx} sx={{ p: "0 2px 5px 2px" }}>
                    tables.length > 0 && tables.map((row: any, idx) => <ListItem key={idx} sx={{ p: "0 2px 5px 2px" }}>
                      <Stack>
                        <Grid container spacing={1}>
                          <Grid item sm={8}>
                            <Typography key={idx} variant="caption" color="text.secondary" gutterBottom>
                              {row.label.value}
                            </Typography>
                          </Grid>
                          <Grid item sm={4} display={'flex'} justifyContent={'flex-end'}>
                            <Tooltip title="Colunas">
                              <IconButton onClick={() => handleClickLoadColumns(row)}>
                                <Equalizer size={22} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remover">
                              <IconButton onClick={() => handleClickOpenDialogToConfirmDelete(row)}>
                                <Trash size={22} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                        <Divider />
                      </Stack>
                    </ListItem>
                    )
                  }
                </List>
              </Paper>
            </Box>
          }
        </Grid>

        {/* COLUNAS DA TABELA SELECIONADA */}
        <Grid item sm={4}>
          {
            tables && <Box sx={{ width: "100%", maxWidth: PAINEL_LEFT_SIZE }}>
              <Paper elevation={PAPER_ELEVATION}>
                <div style={{ background: "#1976d214", padding: "0px 10px 0px 10px" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Stack direction='row' gap={1}>
                      <Equalizer size={22} />
                      <h4>{selectedDataSource?.label?.value ? 'Colunas' : ''}</h4>
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
                  {
                    columns.map((row: any, idx) => <ListItem key={idx} sx={{ p: "0 2px 5px 2px" }}>
                      <Stack>
                        <Grid container spacing={1}>
                          <Grid item sm={8}>
                            <Typography key={idx} variant="caption" color="text.secondary" gutterBottom>
                              {row.label.value}
                            </Typography>
                          </Grid>
                          <Grid item sm={4} display={'flex'} justifyContent={'flex-end'}>
                            <Tooltip title="Propriedades">
                              <IconButton onClick={(event) => handleClickLoadColumnsProperties(row)} sx={{ p: "4px !important" }}>
                                <Graph size={22} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                        <Divider />
                      </Stack>
                    </ListItem>
                    )
                  }
                </List>
              </Paper>
            </Box>
          }
        </Grid>

        {/* PROPERTIES DA COLUNA SELECIONADA */}
        <Grid item sm={4}>
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
                      <Graph size={22} />
                      <h4>{selectedColumn?.label?.value}</h4>
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
                    properties.map((row:any, idx:Key) => (row?.p?.value != VSKG_TBOX.PROPERTY.RDF_TYPE && row?.p?.value != VSKG_TBOX.PROPERTY.LABEL) && <ListItem key={idx} sx={{ pb: 0 }}>
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
        instance={selectedTable}
      />
    </div >
  );
}