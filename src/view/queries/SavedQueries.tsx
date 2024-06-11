import React, { useState, useEffect, useContext, Key } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import { Database, FileCsv, Eye, Trash, PencilSimpleLine, Table, Star } from 'phosphor-react';
import { Link } from "react-router-dom";

// import { DataSourceModel } from '../../models/DataSourceModel';
import { SavedQueryModel } from '../../models/SavedQueryModel';
import { MHeader } from "../../components/MHeader";
import { api } from '../../services/api';
import { LoadingContext } from "../../App";
import styles from '../../styles/global.module.css'
import { MTable } from '../../components/MTable';
import { COLORS, ROUTES } from '../../commons/constants';
import { MDialogToConfirmDelete } from '../../components/MDialog';
import { double_encode_uri } from '../../commons/utils';
import { Divider } from '@mui/material';

// import spfmt from 'sparql-formatter';

// import spfmt from 'sparql-formatter';

const PAINEL_LEFT_SIZE = window.screen.width * 0.356
const PAINEL_RIGHT_SIZE = window.screen.width * 0.5
const DATASOURCE_TYPES_ICONS_SIZE = 20
const PAPER_ELEVATION = 2

export function SavedQueries() {
  const navigate = useNavigate();
  const [wasDeleted, setWasDeleted] = useState<boolean>(false);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [savedQueries, setSavedQueries] = useState<SavedQueryModel[]>([]);
  const [savedQueriesResult, setSavedQueriesResult] = useState([]);
  const [selectedSavedQuery, setSelectedSavedQuery] = useState<SavedQueryModel>({} as SavedQueryModel);


  async function loadSavedQueries() {
    try {
      setIsLoading(true);
      const response = await api.get("/queries/");
      setSavedQueries(response.data);
      setSelectedSavedQuery(response.data[0])
    } catch (error) {
      console.error("load saved queries", error)
    } finally {
      setIsLoading(false);
      setWasDeleted(false)
    }
  }

  async function executeSavedQuery(uri: string, sparql: string) {
    try {
      setIsLoading(true);
      let _sparql = double_encode_uri(sparql)
      console.log(_sparql)
      const response = await api.get(`/queries/execute/?uri=${uri}`)
      setSavedQueriesResult(response.data);
      console.log('excute result', response.data)
    } catch (error) {
      console.error("load saved queries", error)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSavedQueries();
  }, [])


  const openForm = () => {
    // console.log("*** call: Abrir formulário de Fonte de Dados ***")
    navigate(ROUTES.SAVED_QUERY_FORM);
  }

  /**Pagination */
  const [page, setPage] = useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(6);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
    // setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const [selectedIndex, setSelectedIndex] = React.useState<Number>(0);
  const handleListItemClick = (event: any, idx: Number, row: SavedQueryModel) => {
    setSelectedIndex(idx);
    setSelectedSavedQuery(row)
    window.scrollTo(0, 0)
  };


  /**Dialog to Delete */
  const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  const handleClickOpenDialogToConfirmDelete = (row: SavedQueryModel) => {
    console.log(row)
    setSelectedSavedQuery(row)
    setOpenDialogToConfirmDelete(true);
  };
  const handleRemove = async (normal_uri: string) => {
    try {
      let encoded_uri = double_encode_uri(normal_uri)
      await api.delete(`/queries/?uri=${encoded_uri}`)
      setWasDeleted(true)
    } catch (error) {
      alert(error)
    }

    // await loadSavedQueries();
  }



  return (
    <div className={styles.container}>
      <MHeader title={`Consultas Salvas`} />

      {/* HEADER */}
      <Grid container spacing={1} sx={{ p: '10px 0' }}>
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={8} gap={1} display='flex' justifyContent='flex-end'
          sx={{ pt: '0px !important' }}>
          <TextField id="outlined-basic" label="Pesquisar pelo nome" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Nova Consulta</Button>
        </Grid>
      </Grid>


      <Grid container spacing={2} sx={{ mb: 1 }}>
        {/* CONSULTAS SALVAS */}
        <Grid item sm={6} justifyContent={'center'}>
          <MTable
            header={[["Recursos", "left"]]}
            size={savedQueries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            hasActions
            alignActions='right'
            loading={false}
          >
            {
              savedQueries.length > 0 && savedQueries.map((query, idx) => (
                <TableRow key={idx} sx={{ background: `${selectedIndex == idx ? "#1976d214" : false}` }}>
                  <TableCell>
                    <Stack direction={'row'} gap={1}>
                      <Typography>{query.name.value}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align='right' sx={{ p: "0 6px 0 0" }}>
                    <Tooltip title="Propriedades">
                      <IconButton onClick={(event) => handleListItemClick(event, idx, query)} sx={{ p: "4px !important" }}>
                        <Eye size={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => navigate(ROUTES.SAVED_QUERY_FORM, { state: query })}
                        sx={{ p: "4px !important" }}>
                        <PencilSimpleLine size={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleClickOpenDialogToConfirmDelete(query)} sx={{ p: "4px !important" }}>
                        <Trash size={22} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </MTable>
        </Grid>


        <Grid item sm={6}>
          {
            selectedSavedQuery && <Box sx={{ width: "100%", maxWidth: PAINEL_RIGHT_SIZE }}>
              <Paper elevation={PAPER_ELEVATION}>
                <div style={{ background: "#1976d214", padding: "0px 10px 0px 10px" }}>
                  <h4>{selectedSavedQuery?.name?.value}</h4>
                </div>
                <Divider />
                <Typography variant="body1" sx={{ padding: "10px 10px 10px 12px" }} color="text.primary" gutterBottom>
                  "{selectedSavedQuery?.description?.value}"
                </Typography>
                <List sx={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'auto',
                  padding: 1
                }}>
                  <ListItem key={0} sx={{ pb: 0 }}>
                    <Grid container>
                      <Grid item sm={12}>

                        <Typography variant="body2" sx={{ m: "10px 0px 0x 1px" }} color="text.secondary" gutterBottom>
                          {selectedSavedQuery?.sparql?.value}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>

                {/* Botões */}

                <Box display="flex" justifyContent="flex-end" padding={1}>
                  <Button type="submit" color="primary" variant="contained"
                    onClick={() => executeSavedQuery(selectedSavedQuery.uri.value, selectedSavedQuery?.sparql?.value)}>
                    Excutar
                  </Button>
                </Box>
              </Paper>
            </Box>
          }
        </Grid>
      </Grid>

      {
        savedQueriesResult.length > 0
          ? <Grid container>
            <Grid item sm={12}>
              {
                savedQueriesResult.map((row, idx) => <><Typography variant='body1'>
                  {JSON.stringify(row)}
                </Typography>
                  <br />
                </>
                )
              }

            </Grid>
          </Grid>
          : false
      }


      <MDialogToConfirmDelete
        openConfirmDeleteDialog={openDialogToConfirmDelete}
        setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
        deleteInstance={handleRemove}
        instance={selectedSavedQuery}
      />
    </div>
  );
}