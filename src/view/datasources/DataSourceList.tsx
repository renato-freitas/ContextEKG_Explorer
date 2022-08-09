import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { MTable } from '../../components/MTable';

import styles from './DataSource.module.css';
import { ROUTES } from '../../commons/constants';
import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { Table } from 'phosphor-react';
import { findAllDataSources, remove } from '../../services/sparql-datasource';
import { DataSourceEntity } from '../../models/DataSourceEntity';
import { DeleteForever, EditTwoTone } from '@mui/icons-material';

export function DataSourceList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<DataSourceEntity[]>([]);

  async function loadDataSources() {
    console.log("\n *** Lista dos Grafos de Metadados ***\n")
    setLoading(true);
    const response = await findAllDataSources();
    // const new_set = [...new Set<IMetagraph>(response)];
    setLoading(false);
    // setMetagraphs([...new Set<IMetagraph>(response)])
    setDataSources(response);
  }
  useEffect(() => {
    loadDataSources();
  }, [])

  const openForm = () => {
    console.log("*** call: Abrir formulário de Fonte de Dados ***")
    navigate(ROUTES.DATASOURCE_FORM);
  }
  const handleRemove = async (identifier: string) => {
    await remove(identifier);
    // loadMetagraphs();
  }

  return (
    <div className={styles.listkg}>
      <h1>Fontes de Dados</h1>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Nova Fonte de Dados</Button>
        </Grid>
      </Grid>

      <MTable
        header={[["Título", "left"], ["Criado em", "right"]]}
        size={3}
      >
        {
          // (rowsPerPage > 0
          //   ? filtered
          //     ? filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          //     : categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          //   : categories
          // )
          dataSources.map(row => (
            <TableRow key={row.identifier.value}>
              <TableCell>
                <Typography>{row.title.value}</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography>{new Date(row.created.value).toLocaleDateString()}</Typography>
              </TableCell>
              <TableCell align='center'>
                <Tooltip title="Tabelas">
                  <IconButton onClick={() => {
                    navigate(ROUTES.TABLE_LIST, { state: row })
                  }}>
                    <Table size={22} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton onClick={() => {
                    console.log("*** Selecionando Grafo de Metadados ***")
                  }}>
                    <EditTwoTone />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton onClick={() => handleRemove(row.identifier.value)}>
                    <DeleteForever />
                  </IconButton>
                </Tooltip>
              </TableCell>

            </TableRow>
          ))}
      </MTable>
    </div>
  );
}