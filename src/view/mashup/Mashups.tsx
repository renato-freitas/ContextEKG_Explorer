import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { Construction, DeleteForever, EditTwoTone } from '@mui/icons-material';
import Storage from '@mui/icons-material/Storage';

import { Table, Database, CaretCircleLeft } from 'phosphor-react';

import { MTable } from '../../components/MTable';
import { TablePaginationActions } from '../../commons/pagination';
import { MDialogToConfirmDelete } from '../../components/MDialog';

import { METADATA_GRAHP_TYPE, ROUTES } from '../../commons/constants';
import styles from '../datasources/DataSource.module.css';
import { SemanticViewEntity } from '../../models/SemanticViewEntity';
import { TitleWithButtonBack } from '../../components/MTitleWithButtonBack';
import { MashupEntity } from '../../models/MashupEntity';
import { findAllMetadataGraphs, removeMetadataGraph } from '../../services/sparql-metagraph';
import { print } from '../../commons/utils';

export function Mashups() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [mashups, setMashups] = useState<MashupEntity[]>([]);
  const [selectedMashup, setSelectedMashup] = useState<MashupEntity>({} as MashupEntity);

  async function loadMashups() {
    try {
      setLoading(true);
      const response = await findAllMetadataGraphs(METADATA_GRAHP_TYPE.MASHUP);
      print("LISTando MASHUPS", response)
      setMashups(response);
    } catch (error) {
      print(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMashups();
  }, [])

  const openForm = () => {
    print("ABRIR FORM MASHUP")
    navigate(ROUTES.MASHUP_FORM);
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
    setPage(0);
  };

  /**Dialog to Delete */
  const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  const handleClickOpenDialogToConfirmDelete = (row: MashupEntity) => {
    print(`MASHUP SELECIONADO`, row)
    setSelectedMashup(row)
    setOpenDialogToConfirmDelete(true);
  };

  // const handleRemove = async (mashup: IMetadataGraphForm) => {
  const handleRemove = async (identifier: string, type: string) => {
    print("DELETANDO MASHUP")
    await removeMetadataGraph(identifier, type);
    await loadMashups();
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

      <TitleWithButtonBack title="Mashups de Dados" />

      {/* <nav><Link to={ROUTES.ORGANIZATION_DOC}>Documento</Link></nav> */}
      {/* <Typography variant='caption'>Nessa tela são listas as organizações cadastradas globalmente na plataforma. Elas podem ser reutilizadas na construção de vários Grafos de Metadados</Typography> */}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Novo Mashup</Button>
        </Grid>
      </Grid>

      <MTable
        header={[["Título", "left"], ["Comentário", "left"],
        ["Quem criou", "left"],
        ["Criado em", "right"], ["Modificado em", "right"]]}
        size={mashups.length}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hasActions
        loading={false}
      >
        {
          (rowsPerPage > 0
            ? mashups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : mashups
          ).map(row => (
            <TableRow key={row.identifier.value}>
              <TableCell>
                <Typography>{row.title.value}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{row.comment.value}</Typography>
              </TableCell>
              <TableCell>{row.creator?.value}</TableCell>
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
                    navigate(ROUTES.MASHUP_FORM, { state: row })
                  }}>
                    <EditTwoTone />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Construir">
                  <IconButton onClick={() => {
                    navigate(ROUTES.MASHUP_MANAGE, { state: row })
                    print("SELECIONANDO MASHUP", row);
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
        instance={selectedMashup}
        type={METADATA_GRAHP_TYPE.MASHUP}
      />
    </div >
  );
}