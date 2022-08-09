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

interface ITableEntity {
  // identifier: RDF_Node;
  // uri: RDF_Node;
  name: RDF_Node;
  // comment: RDF_Node;
  // creator: RDF_Node;
  // created: RDF_Node;
  // modified: RDF_Node;
}

interface ITableForm {
  name: string;
}

export interface TableProps {
  selectedTable: ITableForm;
  tables: TableEntity[];
  hideTableForm: () => void;
}

// export interface LocationParams {
//   pathname: string;
//   state: ITableEntity;
//   search: string;
//   hash: string;
//   key: string;
// }

interface MDailogProps {
  open: boolean;
  onClose: () => void;
  tables: string[];
  setLocalTables: React.Dispatch<React.SetStateAction<string[]>>;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>
}


const TableSchema = zod.object({
  // identifier: zod.string().optional(),
  // uri: zod.string().optional(),
  name: zod.string().min(1, 'Digite ao menos 1 caracter'),
  // comment: zod.string().min(1, 'Digite ao menos 1 caracter'),
  // creator: zod.string().min(2, 'Digite ao menos 1 caracter'),
  // created: zod.string().optional(),
  // modified: zod.string().optional(),
});

/**Tenho que decidir como fazer a anotação das tabelas/csv das fontes de dados
 * i) Atualizar globalmente, tal que reflita em todos os GM
 * ii) Ou atualizar individualmente cada GM
 */
export function TableForm(props: MDailogProps) {
  const [tableName, setTableName] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tables, setTables] = useState([]);

  // const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ITableForm>({
  //   resolver: zodResolver(TableSchema),
  //   defaultValues: {
  //     name: '',
  //   }
  // });

  // const handleSubmitTable: SubmitHandler<IFormInputTable> = async (data) => {
  const [list, setList] = useState<{ name: string }[]>([]);
  const handleSubmitTableForm: SubmitHandler<ITableForm> = async (data, e) => {
    // console.log(e)
    console.log("*** Enviando dados da Tabela ***")
    console.log(data);
    // console.log(props.tables);
    // setList([...list, data]);c
    // console.log([...props.tables, data])
    // props.setLocalTables([...props.tables, data])
    props.setCount(old => old + 2)
    e?.preventDefault();
  };


  // const [valueTab, setValueTab] = React.useState(0);
  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  // const handleChange = (event: React.SyntheticEvent) => {
  const handleChange = (event: React.BaseSyntheticEvent) => {
    console.log(event.target.name)
    console.log(event.target.value)
    // setTableName()
    if(event.target.name === "name") setTableName(event.target.value)
  };

  const submit = () => {
    props.setCount(old => old + 2)
    props.setLocalTables([...props.tables, tableName])
    console.log(tableName)
  }

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>
        <Stack spacing={1} justifyContent="flex-start" direction="row">
          <Table size={30} />
          <Typography variant="h5">Formulário de Tabela</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {/* <form onSubmit={(e) => handleSubmit(handleSubmitTable)(e)}> */}
        <form>
          <Container fixed sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="name">Nome da Tabela</FormLabel>
                  <TextField
                    name="name"
                    variant="outlined"
                    placeholder="Ex: REDESIM"
                    size="small"
                    required
                    onChange={handleChange}
                  // {...register('name')}
                  />
                  {/* <p>{errors.name?.message}</p> */}
                </FormControl>
              </Grid>
            </Grid>
          </Container>
          <DialogActions>
            <Box display="flex" justifyContent="flex-start">
              <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
                <Button color="primary" variant="contained"
                  onClick={() => submit()}
                >
                  Submit
                </Button>
                <Button variant="contained" color="secondary" onClick={() => props.onClose()}>
                  Cancel
                </Button>
              </Stack>
            </Box>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}





