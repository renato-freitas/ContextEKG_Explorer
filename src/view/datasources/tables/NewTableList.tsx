import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler, UseFormProps } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { v4 as uuidv4 } from 'uuid';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { IconButton, TableCell, Tooltip } from '@mui/material';
import Grid from "@mui/material/Grid";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CaretCircleLeft, Columns, Table } from "phosphor-react";
import styles from '../DataSource.module.css';
import { ListItemButton, ListItemIcon, ListItemText, TableRow } from "@mui/material";
import { MTable } from "../../../components/MTable";
import { ROUTES } from "../../../commons/constants";
import { DeleteForever, EditTwoTone } from "@mui/icons-material";
import { TableEntity } from "../../../models/TableEntity";
import { DataSourceEntity } from "../../../models/DataSourceEntity";
import { findAllTables, removeTable, findAllTablesByDataSource } from "../../../services/sparql-datasource";

export function NewTableList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [selectedTable, setSelectedTable] = useState();
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceEntity>({
    identifier: { type: '', value: '' },
    label: { type: '', value: '' },
    title: { type: '', value: '' },
    comment: { type: '', value: '' },
    created: { type: '', value: '' },
    modified: { type: '', value: '' },
    uri: { type: '', value: '' },
    type: { type: '', value: '' },
  });


  async function loadTables() {
    try {
      console.log("\n *** LISTA DE TABELAS ***\n")
      setLoading(true);
      // const response = await findAllTables();
      const response = await findAllTablesByDataSource(selectedDataSource.identifier.value);
      console.log(response)
      setTables(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTables();
  }, [])

  useEffect(() => {
    async function onEdit() {
      try {
        if (location.state) {
          setLoading(true);
          let state = location.state as DataSourceEntity;
          console.log("*** Colocando tabelas da FD na lista ***")
          console.log(state)
          setSelectedDataSource(state);

          const response = await findAllTablesByDataSource(state.identifier.value);
          console.log(response)
          setTables(response);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    }
    onEdit();
  }, [location.state]);

  const openForm = (row: any) => {
    console.log("*** call: Abrir formulário de Fonte de Dados ***")
    navigate(ROUTES.TABLE_FORM, { state: row });
  }
  const handleRemove = async (identifier: string) => {
    await removeTable(identifier);
    loadTables();
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

  return (
    <div className={styles.listkg}>

      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        {`${selectedDataSource.title.value}/Tabelas`}
      </h1>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          {/* <Button variant="contained" onClick={handleShowTableForm}>+ Nova Tabela</Button> */}
          <Button variant="contained" color="secondary"
            onClick={() => navigate(ROUTES.TABLE_FORM, { state: selectedDataSource })}>+ Nova Tabela</Button>
        </Grid>
      </Grid>

      <MTable
        header={[["Tabela", "left"], ["Criada em", "right"], ["Modificada em", "right"]]}
        size={tables.length}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        hasActions
        loading={false}
      >
        {
          (rowsPerPage > 0
            ? tables.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : tables
          ).map(row => (
            <TableRow key={row.identifier.value}>
              <TableCell>
                <Typography component={"p"}>{row.title.value}</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography component={"p"}>{new Date(row.created.value).toLocaleDateString()}</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography component={"p"}>{new Date(row.modified.value).toLocaleDateString()}</Typography>
              </TableCell>
              <TableCell align='center'>
                <Tooltip title="Colunas">
                  <IconButton onClick={() => {
                    navigate(ROUTES.COLUMN_LIST, { state: row })
                    console.log(row)
                  }}>
                    <Columns size={22} />
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

