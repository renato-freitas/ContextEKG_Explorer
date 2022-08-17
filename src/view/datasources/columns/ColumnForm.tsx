import { SetStateAction, TextareaHTMLAttributes, useEffect } from "react";
import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { TableEntity } from "../../../models/TableEntity";
import { Table } from "phosphor-react";
import { RDF_Node } from "../../../models/RDF_Node";
import { insertColumn, insertTable } from '../../../services/sparql-datasource';
import { DataSourceEntity } from "../../../models/DataSourceEntity";

interface IFormColumn {
  identifier: string;
  title: string;
  created: string;
  modified: string;
}


const ColumnSchema = zod.object({
  identifier: zod.string().optional(),
  uri: zod.string().optional(),
  title: zod.string().min(1, 'Digite ao menos 1 caracter'),
  name: zod.string().optional(),
  created: zod.string().optional(),
  modified: zod.string().optional(),
});

/**Tenho que decidir como fazer a anotação das tabelas/csv das fontes de dados
 * i) Atualizar globalmente, tal que reflita em todos os GM
 * ii) Ou atualizar individualmente cada GM
 */
export function ColumnForm() {
  const [tableName, setTableName] = useState<string>("");
  // const [selectedDataSource, setSelectedDataSource] = useState<DataSourceEntity|undefined>(undefined);
  const [selectedTable, setSelectedTable] = useState<TableEntity>({
    identifier: { type: '', value: '' },
    name: { type: '', value: '' },
    title: { type: '', value: '' },
    created: { type: '', value: '' },
    modified: { type: '', value: '' },
    uri: { type: '', value: '' },
    type: { type: '', value: '' }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tables, setTables] = useState([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IFormColumn>({
    resolver: zodResolver(ColumnSchema),
    defaultValues: {
      identifier: '',
      title: '',
      created: '',
      modified: '',
    }
  });

  // const handleSubmitTable: SubmitHandler<IFormInputTable> = async (data) => {
  const [list, setList] = useState<{ name: string }[]>([]);
  const handleSubmitTableForm: SubmitHandler<IFormColumn> = async (data, e) => {
    try {
      console.log("*** Enviando dados de tabela ***")
      console.log(data);
      setLoading(true);
      if (data.identifier !== "") {
        console.log("*** ATUALIZANDO COLUNA ***")
        // await update(data)
      } else {
        console.log("*** INSERINDO COLUNA ***")
        await insertColumn(data, selectedTable.uri.value);
      }
      setLoading(false);
      // navigate(-1);
      // reset();
      e?.preventDefault();
    } catch (error) {
      console.log(error);
    }

  };


  useEffect(() => {
    async function onEditTable() {
      if (location?.state) {
        let state = location.state as TableEntity;
        console.log("*** Colocando colunas da tb na lista  ***")
        console.log(state)
        setSelectedTable(state);
        // setSelectedDataSource(location.state)
      }
    };
    onEditTable();
  }, [location?.state]);


  return (
    <Container fixed>
      <h1>{`${'Cadastrar'} Tabela na Fonte: ${selectedTable.title.value}`}</h1>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              <form onSubmit={handleSubmit(handleSubmitTableForm)}>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="title">Nome da Coluna</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: REDESIM"
                        size="small"
                        required
                        // onChange={handleChange}
                        {...register('title')}
                      />
                      {/* <p>{errors.name?.message}</p> */}
                    </FormControl>
                  </Grid>
                  <Grid item sm={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
                        <Button type="submit" color="primary" variant="contained">
                          Submit
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                          Cancel
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}





