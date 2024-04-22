import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { DeleteForever, EditTwoTone } from '@mui/icons-material';
import Storage from '@mui/icons-material/Storage';

import { Table, Database } from 'phosphor-react';

import { MTable } from '../../components/MTable';
import { TablePaginationActions } from '../../commons/pagination';
import { MDialogToConfirmDelete } from '../../components/MDialog';

import { DataSourceEntity } from '../../models/DataSourceEntity';
import { OrganizationEntity } from '../../models/OrganizationEntity';

import { findAllOrganizations } from '../../services/sparql-organization';
import { ROUTES } from '../../commons/constants';
import styles from '../datasources/DataSource.module.css';
import { MHeader } from '../../components/MHeader';

export function OrganizationList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [organizations, setOrganizations] = useState<OrganizationEntity[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationEntity>({} as OrganizationEntity);

  async function loadOrganizations() {
    try {
      setLoading(true);
      console.log("\n *** Lista de Organizações ***\n")
      const response = await findAllOrganizations();
      console.log(response)
      setOrganizations(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    loadOrganizations();
  }, [])

  const openForm = () => {
    console.log("*** call: Abrir formulário de Fonte de Dados ***")
    navigate(ROUTES.ORGANIZATION_FORM);
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
  const handleClickOpenDialogToConfirmDelete = (row: DataSourceEntity) => {
    console.log(row)
    setSelectedOrganization(row)
    setOpenDialogToConfirmDelete(true);
  };

  const handleRemove = async (identifier: string) => {
    // await removeDataSource(identifier);
    await loadOrganizations();
  }
  /**Dialog to Delete */

  return (
    <div className={styles.listkg}>

      <MHeader title={`Organizações`} />

      <nav><Link to={ROUTES.ORGANIZATION_DOC}>Documentação</Link></nav>
      <Typography variant='caption'>Nessa tela são listas as organizações cadastradas globalmente na plataforma. Elas podem ser reutilizadas na construção de vários Grafos de Metadados</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Nova Organização</Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={6} justifyContent="flex-end" display="flex">
          <MTable
            header={[["Título", "left"]]}
            size={organizations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            hasActions
            loading={false}
          >
            {
              (rowsPerPage > 0
                ? organizations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : organizations
              ).map(row => (
                <TableRow key={row.identifier.value}>
                  <TableCell>
                    <Typography>{row.title.value}</Typography>
                  </TableCell>
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
                    <Tooltip title="Fontes de Dados">
                      <IconButton onClick={() => {
                        navigate(ROUTES.DATASOURCE_LIST, { state: row })
                        console.log("*** Selecionando a Organização ***")
                        console.log(row)
                        // setSelectedDataSource(row);
                      }}>
                        <Database size={22} />
                        {/* <Storage /> */}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => {
                        console.log("*** Selecionando a Organização ***")
                        navigate(ROUTES.ORGANIZATION_FORM, { state: row })
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