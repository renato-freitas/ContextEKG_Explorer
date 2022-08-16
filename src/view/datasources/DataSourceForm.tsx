import { useEffect } from "react";
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

import { DataSourceDescriptionTab } from './DataSourceDescriptionTab'
import { DataSourceColumnsTab } from "./DataSourceColumnsTab";

import { insert } from "../../services/sparql-datasource";
import { DataSourceTablesTab } from "./DataSourceTablesTab";
import { DataSourceCredentialsTab } from "./DataSourceCredentialsTab";
import { TableEntity } from "../../models/TableEntity";
import { RDF_Node } from "../../models/RDF_Node";

interface IDataSource {
  uri: RDF_Node;
  identifier: RDF_Node;
  title: RDF_Node;
  comment: RDF_Node;
  page: RDF_Node;
  creator: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
}

interface IDataSourceForm {
  uri: string;
  identifier: string;
  title: string;
  comment: string;
  page: string;
  tables: TableEntity[];
  tableNames: string[];
  creator: string;
  created: string;
  modified: string;
}

export interface LocationParams {
  pathname: string;
  state: IDataSource;
  search: string;
  hash: string;
  key: string;
}

const DataSourceSchema = zod.object({
  identifier: zod.string().optional(),
  uri: zod.string().optional(),
  title: zod.string().min(1, 'Digite ao menos 1 caracter'),
  comment: zod.string().min(1, 'Digite ao menos 1 caracter'),
  page: zod.string().optional(),
  creator: zod.string().min(2, 'Digite ao menos 1 caracter'),
  created: zod.string().optional(),
  modified: zod.string().optional(),
});

/**Tenho que decidir como fazer a anotação das tabelas/csv das fontes de dados
 * i) Atualizar globalmente, tal que reflita em todos os GM
 * ii) Ou atualizar individualmente cada GM
 */


export function DataSourceForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tables, setTables] = useState([]);
  const [tableNames, setTableNames] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IDataSourceForm>({
    resolver: zodResolver(DataSourceSchema),
    defaultValues: {
      identifier: '',
      title: '',
      comment: '',
      page: '',
      creator: ''
    }
  });

  const handleSubmitDataSource: SubmitHandler<IDataSourceForm> = async (data) => {
    console.log("*** Enviando dados de Grafo de Metadados ***")
    console.log(data);
    setLoading(true);
    if (data.identifier !== "") {
      console.log("*** UPDATE ***")
      // await update(data)
    } else {
      console.log("*** INSERT ***")
      const response = await insert(data)
      console.log("*** RESPOSTA DO INSERT ***")
      console.log(response)
    }
    setLoading(false);
    // navigate(-1);
    reset();
  };

  /**Editar uma Fonte de Dados */
  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as IDataSource;
          console.log("*** Colocando a Fonte de Dados Selecionada no Formulário ***")
          console.log(location)
          setValue("title", state.title.value);
          setValue("comment", state.comment.value);
          setValue("page", state.page.value);
          setValue("creator", state.creator.value);
          setValue("created", state.created.value);
          setValue("identifier", state.identifier.value);
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);


  // Tabs
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [valueTab, setValueTab] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  return (
    <Container fixed>
      <h1>Formulário de Fonte de Dados</h1>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
              <Box>
                <Tabs value={valueTab} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Descrição" {...a11yProps(0)} />
                  <Tab label="Tabelas" {...a11yProps(1)} />
                  <Tab label="Colunas" {...a11yProps(2)} />
                  <Tab label="Credenciais" {...a11yProps(3)} />
                </Tabs>
                <form onSubmit={handleSubmit(handleSubmitDataSource)}>
                  <TabPanel value={valueTab} index={0}>
                    <DataSourceDescriptionTab
                      schema={DataSourceSchema}
                      register={register}
                      errors={errors}
                    />
                  </TabPanel>
                  <TabPanel value={valueTab} index={1}>
                    <DataSourceTablesTab
                      schema={DataSourceSchema}
                      register={register}
                      errors={errors}
                      tables={tables}
                      setTables={setTables}
                      tableNames={tableNames}
                      setTableNames={setTableNames}
                    />
                  </TabPanel>
                  <TabPanel value={valueTab} index={2}>
                    <DataSourceColumnsTab />
                  </TabPanel>
                  <TabPanel value={valueTab} index={3}>
                    <DataSourceCredentialsTab />
                  </TabPanel>
                </form>
              </Box>
            </CardContent>
            {loading && <LinearProgress />}
          </Card>
        </Grid>
      </Grid>
    </Container >
  )
}