import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { Construction, DeleteForever, EditTwoTone } from '@mui/icons-material';
import Storage from '@mui/icons-material/Storage';

import { Table, Database, CaretCircleLeft } from 'phosphor-react';

import { MTable } from '../../components/MTable';
import { TablePaginationActions } from '../../commons/pagination';
import { MDialogToConfirmDelete } from '../../components/MDialog';

import { MetadataGraphEntity } from '../../models/MetadataGraphEntity';
import { DataSourceEntity } from '../../models/DataSourceEntity';
import { LocalGraphEntity } from '../../models/LocalGraphEntity';

import { findAllOrganizations } from '../../services/sparql-organization';
import { ROUTES } from '../../commons/constants';
import styles from '../datasources/DataSource.module.css';
import { findAllLocalGraphs } from '../../services/sparql-localgraph';

export function LocalGraphList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [localGraphs, setLocalGraphs] = useState<LocalGraphEntity[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<LocalGraphEntity>({} as LocalGraphEntity);

  async function loadLocalGraphs() {
    try {
      setLoading(true);
      console.log("\n *** Lista de Grafos Locais ***\n")
      const response = await findAllLocalGraphs();
      console.log(response)
      setLocalGraphs(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    loadLocalGraphs();
  }, [])

  const openForm = () => {
    console.log("*** Abrir formulário de Grafo Local ***")
    navigate(ROUTES.LOCAL_GRAPH_FORM, { state: { ekg: location.state, from: 'localGraphList' } });
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
    await loadLocalGraphs();
  }

  /**EDIT */
  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as MetadataGraphEntity;
          console.log(`*** Carregando o EKG selecionado necessário para registrar seu grafo local ***`, state)
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

      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        Grafos Locais
      </h1>
      {/* <nav><Link to={ROUTES.ORGANIZATION_DOC}>Documento</Link></nav> */}
      {/* <Typography variant='caption'>Nessa tela são listas as organizações cadastradas globalmente na plataforma. Elas podem ser reutilizadas na construção de vários Grafos de Metadados</Typography> */}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Novo Grafo Local</Button>
        </Grid>
      </Grid>

      <MTable
        header={[["Título", "left"], ["Prefixo", "right"], ["Comentário", "left"],
        ["Criado em", "right"], ["Modificado em", "right"]]}
        size={localGraphs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hasActions
        loading={false}
      >
        {
          (rowsPerPage > 0
            ? localGraphs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : localGraphs
          ).map(row => (
            <TableRow key={row.identifier.value}>
              <TableCell>
                <Typography>{row.title.value}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{row.prefix.value}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{row.comment.value}</Typography>
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
                <Tooltip title="Editar">
                  <IconButton onClick={() => {
                    console.log("*** Selecionando um grafo local ***")
                    navigate(ROUTES.LOCAL_GRAPH_FORM, { state: row })
                  }}>
                    <EditTwoTone />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Construir">
                  <IconButton onClick={() => {
                    navigate(ROUTES.LOCAL_GRAPH_CONSTRUCT, { state: row })
                    console.log("*** Selecionando um grafo local ***")
                    console.log(row)
                    // setSelectedDataSource(row);
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