import React, { useEffect, useState } from "react"
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

import EditTwoTone from '@mui/icons-material/EditTwoTone';
import Construction from '@mui/icons-material/Construction';
import DeleteForever from '@mui/icons-material/DeleteForever';

import { useNavigate } from 'react-router-dom';

import styles from './ListEkg.module.css';
import { findAllMetadataGraphs, IMetadataGraphForm, removeMetadataGraph } from '../../services/sparql-metagraph';
import { METADATA_GRAHP_TYPE, ROUTES } from '../../commons/constants';
import { Typography } from "@mui/material";
import { MTable } from "../../components/MTable";
import { MDialogToConfirmDelete } from "../../components/MDialog";
import { RDF_Node } from "../../models/RDF_Node";
import { MetadataGraphEntity } from "../../models/MetadataGraphEntity";
import { TitleWithButtonBack } from "../../components/MTitleWithButtonBack";



export function MetagraphList() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [metagraphs, setMetagraphs] = useState<MetadataGraphEntity[]>([] as MetadataGraphEntity[]);
  const [selectedMetadataGraph, setSelectedMetadataGraph] = useState<MetadataGraphEntity>({} as MetadataGraphEntity);


  async function loadMetagraphs() {
    setLoading(true);
    const response = await findAllMetadataGraphs(METADATA_GRAHP_TYPE.EKG);
    const new_set = [...new Set<MetadataGraphEntity>(response)];
    setLoading(false);
    console.log("\n *** LISTA DOS GRAFOS DE METADADOS *** ", new_set)
    setMetagraphs(new_set)
  }
  useEffect(() => {
    loadMetagraphs();
  }, [])

  const openForm = () => {
    console.log("*** call: Abrir formulário de Metadados de GC ***")
    navigate(ROUTES.METAGRAPHS_FORM);
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
  const handleClickOpenDialogToConfirmDelete = (row: MetadataGraphEntity) => {
    console.log(row)
    setSelectedMetadataGraph(row)
    setOpenDialogToConfirmDelete(true);
  };
  
  // const handleRemove = async (identifier: string) => {
  const handleRemove = async (ekg: IMetadataGraphForm) => {
    await removeMetadataGraph(ekg);
    await loadMetagraphs();
  }
  /**Dialog to Delete */

  return (
    <div className={styles.listkg}>

      <TitleWithButtonBack title="EKG's - Enterprise Knowledge Graphs"/>

      <Grid container spacing={2}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Novo Grafo de Metadados</Button>
        </Grid>
      </Grid>

      <MTable
        header={[["Título", "left"], ["Comentário", "left"], ["Quem criou", "left"], ["Criado em", "right"], ["Modificado em", "right"]]}
        size={metagraphs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hasActions
        loading={false}
      >
        {(rowsPerPage > 0
          ? metagraphs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : metagraphs
        ).map((row) => (
          <TableRow
            key={row.identifier.value}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>
              <Stack>
                <Typography>{row.title.value}</Typography>
              </Stack>
            </TableCell>
            <TableCell style={{ whiteSpace: 'break-spaces' }}>{row.comment?.value}</TableCell>
            <TableCell>{row.creator?.value}</TableCell>
            <TableCell align="right">
              <Stack>
                <Typography>{new Date(row.created.value).toLocaleDateString()}</Typography>
                <Typography variant="caption" display="block" gutterBottom>{new Date(row.created.value).toLocaleTimeString()}</Typography>
              </Stack>
            </TableCell>
            <TableCell align="right">
              <Stack>
                <Typography>{new Date(row.modified.value).toLocaleDateString()}</Typography>
                <Typography variant="caption" display="block" gutterBottom>{new Date(row.modified.value).toLocaleTimeString()}</Typography>
              </Stack>
            </TableCell>
            {/* Botões */}
            <TableCell align="center">
              <Tooltip title="Editar">
                <IconButton onClick={() => {
                  console.log("*** Selecionando Grafo de Metadados ***")
                  navigate(ROUTES.METAGRAPHS_FORM, { state: row })
                }}>
                  <EditTwoTone />
                </IconButton>
              </Tooltip>
              <Tooltip title="Construir">
                <IconButton onClick={() => navigate(ROUTES.MANAGE_METAGRAPH, { state: row })}>
                  <Construction />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                {/* <IconButton onClick={() => handleRemove(row.identifier.value)}> */}
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
        instance={selectedMetadataGraph}
      />
    </div>
  )
}