import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { DeleteForever, EditTwoTone } from '@mui/icons-material';

import { CaretCircleLeft, Table } from 'phosphor-react';

import { ROUTES } from '../../../commons/constants';
import { OrganizationEntity } from '../../../models/OrganizationEntity';
import { MTable } from '../../../components/MTable';
import styles from './DataSource.module.css';
import { TablePaginationActions } from '../../../commons/pagination';
import { MDialogToConfirmDelete } from '../../../components/MDialog';

import { findGlobalDataSources, findDataSourcesByOrganization, removeDataSource } from '../../../services/sparql-datasource';

export function DataSourceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<OrganizationEntity[]>([]);
  // const [selectedDataSource, setSelectedDataSource] = useState<OrganizationEntity>({} as OrganizationEntity);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationEntity>({} as OrganizationEntity);

  // async function loadDataSources() {
  //   console.log("\n *** Lista de Fontes de Dados ***\n")
  //   setLoading(true);
  //   const response = await findGlobalDataSources();
  //   console.log(response[0])
  //   setLoading(false);
  //   setDataSources(response);
  // }

  // useEffect(() => {
  //   loadDataSources();
  // }, [])

  useEffect(() => {
    async function onEdit() {
      try {
        if (location.state) {
          setLoading(true);
          let state = location.state as OrganizationEntity;
          console.log("*** Recebendo a Organização selecionada ***")
          console.log(state)
          setSelectedOrganization(state);

          const response = await findDataSourcesByOrganization(state.identifier.value);
          console.log(response)
          setDataSources(response);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    }
    onEdit();
  }, [location.state]);

  const openForm = () => {
    console.log("*** Abrir formulário de Fonte de Dados ***")
    navigate(ROUTES.DATASOURCE_FORM, { state: { organization: selectedOrganization } });
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
  const handleClickOpenDialogToConfirmDelete = (row: OrganizationEntity) => {
    console.log(row)
    setSelectedOrganization(row)
    setOpenDialogToConfirmDelete(true);
  };

  const handleRemove = async (identifier: string) => {
    await removeDataSource(identifier);
    // await loadDataSources();
  }
  /**Dialog to Delete */

  return (
    <div className={styles.listkg}>

      {/* <h1>Fontes de Dados</h1> */}
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        {`${selectedOrganization?.title?.value}/Fontes de Dados`}
      </h1>
      <Typography variant='caption'>Nessa tela são listas as fontes de dados cadastradas globalmente na plataforma. Elas podem ser reutilizadas na construção de vários Grafos de Metadados</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Nova Fonte de Dados</Button>
        </Grid>
      </Grid>

      <MTable
        header={[["Título", "left"], ["Criado em", "right"], ["Modificado em", "right"]]}
        size={dataSources.length}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hasActions
        loading={false}
      >
        {
          (rowsPerPage > 0
            ? dataSources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : dataSources
          ).map(row => (
            <TableRow key={row.identifier.value}>
              <TableCell>
                <Typography>{row.title.value}</Typography>
              </TableCell>
              {/* <TableCell>
                <Typography>{row.type.value}</Typography>
              </TableCell> */}
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
                <Tooltip title="Tabelas">
                  <IconButton onClick={() => {
                    navigate(ROUTES.TABLE_LIST, { state: row })
                    console.log(row)
                    // setSelectedDataSource(row);
                  }}>
                    <Table size={22} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton onClick={() => {
                    console.log("*** Selecionando Grafo de Metadados ***")
                    navigate(ROUTES.DATASOURCE_FORM, { state: row })
                  }}>
                    <EditTwoTone />
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
      </MTable>

      <MDialogToConfirmDelete
        openConfirmDeleteDialog={openDialogToConfirmDelete}
        setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
        deleteInstance={handleRemove}
        instance={selectedOrganization}
      />
    </div >
  );
}