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
import { insertTable } from '../../../services/sparql-datasource';
import { DataSourceEntity } from "../../../models/DataSourceEntity";

// interface ITableEntity {
//   name: RDF_Node;
// }

interface ITableForm {
  identifier: string;
  title: string;
  created: string;
  modified: string;
}

export interface TableProps {
  selectedTable: ITableForm;
  tables: TableEntity[];
  hideTableForm: () => void;
}


const TableSchema = zod.object({
  identifier: zod.string().optional(),
  // uri: zod.string().optional(),
  title: zod.string().min(1, 'Digite ao menos 1 caracter'),
  // comment: zod.string().min(1, 'Digite ao menos 1 caracter'),
  // creator: zod.string().min(2, 'Digite ao menos 1 caracter'),
  // created: zod.string().optional(),
  // modified: zod.string().optional(),
});
const INITIAL_STATE = {
  identifier: '',
  title: '',
  created: '',
  modified: '',
};

/**Tenho que decidir como fazer a anotação das tabelas/csv das fontes de dados
 * i) Atualizar globalmente, tal que reflita em todos os GM
 * ii) Ou atualizar individualmente cada GM
 */
export function TableForm() {
  const [tableName, setTableName] = useState<string>("");
  // const [selectedDataSource, setSelectedDataSource] = useState<DataSourceEntity|undefined>(undefined);
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
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tables, setTables] = useState([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ITableForm>({
    resolver: zodResolver(TableSchema),
    defaultValues: {
      identifier: '',
      title: '',
      created: '',
      modified: '',
    }
  });

  // const handleSubmitTable: SubmitHandler<IFormInputTable> = async (data) => {
  const [list, setList] = useState<{ name: string }[]>([]);
  const handleSubmitTableForm: SubmitHandler<ITableForm> = async (data, e) => {
    try {
      console.log("*** Enviando dados de tabela ***")
      console.log(data);
      setLoading(true);
      if (data.identifier !== "") {
        console.log("*** UPDATETABLE ***")
        // await update(data)
      } else {
        console.log("*** INSERT TABLE***")
        await insertTable(data, selectedDataSource.identifier.value, selectedDataSource.uri.value);
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
        let state = location.state as DataSourceEntity;
        console.log("*** Colocando tabelas da FD na lista de tabeas ***")
        console.log(state)
        setSelectedDataSource(state);
        // setSelectedDataSource(location.state)
      }
    };
    onEditTable();
  }, [location?.state]);

  // const [valueTab, setValueTab] = React.useState(0);
  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  // const handleChange = (event: React.SyntheticEvent) => {
  // const handleChange = (event: React.BaseSyntheticEvent) => {
  //   console.log(event.target.name)
  //   console.log(event.target.value)
  //   // setTableName()
  //   if (event.target.name === "name") setTableName(event.target.value)
  // };

  // const submit = () => {
  // props.setCount(old => old + 2)
  // props.setLocalTables([...props.tables, tableName])
  // console.log(tableName)
  // }

  return (
    <Container fixed>
      <h1>{`${'Cadastrar'} Tabela na Fonte: ${selectedDataSource.title.value}`}</h1>
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
                      <FormLabel htmlFor="title">Nome da Tabela</FormLabel>
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





