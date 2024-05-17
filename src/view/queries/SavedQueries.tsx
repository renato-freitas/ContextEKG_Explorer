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
import { ROUTES } from '../../commons/constants';

// import spfmt from 'sparql-formatter';

// import spfmt from 'sparql-formatter';

const PAINEL_LEFT_SIZE = window.screen.width * 0.356
const PAINEL_RIGHT_SIZE = window.screen.width * 0.5
const DATASOURCE_TYPES_ICONS_SIZE = 20
const PAPER_ELEVATION = 2

export function SavedQueries() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState<boolean>(false);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [savedQueries, setSavedQueries] = useState<SavedQueryModel[]>([]);
  const [selectedSavedQuery, setSelectedSavedQuery] = useState<SavedQueryModel>({} as SavedQueryModel);


  async function loadSavedQueries() {
    // console.log("*** Lista das fontes de dados")
    try {
      setIsLoading(true);
      const response = await api.get("/queries/");
      console.log(response.data)

      setSavedQueries(response.data);
      setSelectedSavedQuery(response.data[0])
    } catch (error) {
      console.error("loadDataSources", error)
    } finally {
      // loadDataSourceProperties()
      setIsLoading(false);
    }
  }


  useEffect(() => {
    loadSavedQueries();
  }, [])


  /**Pagination */
  const [page, setPage] = useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(10);
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
          {/* <Button variant="contained" onClick={openForm}>+ Nova Fonte de Dados</Button> */}
        </Grid>
      </Grid>


      <Grid container spacing={4} sx={{ mb: 1 }}>
        {/* DATA SOURCES */}
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
                <TableRow key={idx} >
                  <TableCell>
                    <Stack direction={'row'} gap={1}>
                      <Typography>{query.name}</Typography>
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
                        onClick={() => navigate(ROUTES.DATASOURCE_FORM, { state: query })}
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
                  <h4>{selectedSavedQuery.name}</h4>
                </div>
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
                          {/* {spfmt(selectedSavedQuery.body, indentDepth = 2)} */}
                          {selectedSavedQuery.owner}
                        </Typography>
                        <Typography variant="body2" sx={{ m: "10px 0px 0x 1px" }} color="text.secondary" gutterBottom>
                          {/* {spfmt(selectedSavedQuery.body, indentDepth = 2)} */}
                          {selectedSavedQuery.body}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </Paper>
            </Box>
          }
        </Grid>
      </Grid>
    </div>
  );
}