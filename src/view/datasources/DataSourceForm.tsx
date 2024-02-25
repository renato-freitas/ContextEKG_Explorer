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

import { insertDataSource } from "../../services/sparql-datasource";
import { DataSourceTablesTab } from "./DataSourceTablesTab";
import { DataSourceCredentialsTab } from "./DataSourceCredentialsTab";
import { TableEntity } from "../../models/TableEntity";
import { RDF_Node } from "../../models/RDF_Node";
import { api } from "../../services/api";
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import { VSKG, NAMESPACES, VSKG_TBOX } from "../../commons/constants";
import { double_encode_uri, printt } from "../../commons/utils";

interface IDataSource {
  uri: RDF_Node;
  identifier: RDF_Node;
  title: RDF_Node;
  label: RDF_Node;
  description: RDF_Node;
  type: RDF_Node;
  comment: RDF_Node;
  page: RDF_Node;
  creator: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
}

enum DataSourceTypeEnum {
  Banco_Dados_Relacional = VSKG_TBOX.CLASS.RELATIONAL_DATABASE,
  // No_SQL = `${VSKG}NoSQL_DataSource`,
  // Triplestore = `${VSKG}Triplestore_DataSource`,
  CSV = VSKG_TBOX.CLASS.CSV_FILE,
  // RDF = `${VSKG}RDF_DataSource`
}

interface IDataSourceForm {
  label: string,
  description: string,
  subject_datasource: string,
  type: DataSourceTypeEnum,
  connection_url: string,
  username: string,
  password: string,
  jdbc_driver: string,
  csv_file: string
}

export interface LocationParams {
  pathname: string;
  state: IDataSource;
  search: string;
  hash: string;
  key: string;
}

const DataSourceSchema = zod.object({
  label: zod.string().min(1, { message: "Preencher!" }),
  description: zod.string().optional(),
  subject_datasource: zod.string().optional(),
  type: zod.nativeEnum(DataSourceTypeEnum),
  connection_url: zod.string().min(1, { message: "Preencher!" }),
  username: zod.string().min(1, { message: "Preencher!" }),
  password: zod.string().min(1, { message: "Preencher!" }),
  jdbc_driver: zod.string().min(1, { message: "Preencher!" }),
  csv_file: zod.string().optional(),
  createdAt: zod.string().optional(),
  updatedAt: zod.string().optional(),
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

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IDataSourceForm>({
    resolver: zodResolver(DataSourceSchema),
    // defaultValues: {
    // title: '',
    // label: '',
    // description: '',
    // type: '',
    // connection_url: '',
    // page: '',
    // creator: ''
    // }
  });

  const handleSubmitDataSource: SubmitHandler<IDataSourceForm> = async (data) => {
    console.log("*** Enviando dados de Fonte de Dados ***")
    console.log(data);

    try {
      setLoading(true);
      // if (location?.state) {
      let uri = location?.state as IDataSource

      printt('data 2 update', uri)
      if (uri) {
        let uri_enc = double_encode_uri(uri.uri.value)
        await api.put(`/datasources/${uri_enc}`, data)
      } else {
        console.log("*** INSERT ***")
        // const response = await insertDataSource(data)
        const response = await api.post(`/datasources`, data)
        console.log("*** RESPOSTA DO INSERT ***")
        console.log(response)
      }
      reset();
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  /**Editar uma Fonte de Dados */
  useEffect(() => {
    async function onEdit() {
      try {
        if (location.state) {
          let state = location.state as IDataSource;
          console.log("*** Colocando a Fonte de Dados Selecionada no Formulário ***")
          console.log(location, state)
          setValue("label", state.label.value);

          printt('onEdite(), uri', state.uri.value)
          try {
            let encoded_uri = double_encode_uri(state.uri.value)
            const response = await api.get(`/properties/${encoded_uri}`);
            response.data.forEach((p: any) => {
              // if (p.p.value.includes(`${NAMESPACES.VSKG}uri`)) { setValue("uri", p.o.value); }
              if (p.p.value.includes(`${NAMESPACES.DC}description`)) { setValue("description", p.o.value); }
              if (p.p.value.includes(`${NAMESPACES.VSKG}type`)) {
                if (p.o.value == DataSourceTypeEnum.Banco_Dados_Relacional) {
                  setValue("type", DataSourceTypeEnum.Banco_Dados_Relacional);
                }
                if (p.o.value == DataSourceTypeEnum.CSV) {
                  setValue("type", DataSourceTypeEnum.CSV);
                }
              }
              if (p.p.value.includes(`${NAMESPACES.VSKG}connection_url`)) { setValue("connection_url", p.o.value); }
              if (p.p.value.includes(`${NAMESPACES.VSKG}username`)) { setValue("username", p.o.value); }
              if (p.p.value.includes(`${NAMESPACES.VSKG}password`)) { setValue("password", p.o.value); }
              if (p.p.value.includes(`${NAMESPACES.VSKG}jdbc_driver`)) { setValue("jdbc_driver", p.o.value); }
            })
          } catch (error) {
            console.error("load properties", error)
          }

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
      <h4>Formulário de Fonte de Dados</h4>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
              <Box>
                <Tabs value={valueTab}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  indicatorColor="secondary">
                  {/* <Tab label={`Descrição`} icon={<PhoneMissedIcon />} iconPosition="end" {...a11yProps(0)} /> */}
                  <Tab label={`Descrição`} {...a11yProps(0)} />
                  <Tab label="Credenciais" {...a11yProps(1)} />
                </Tabs>
                <form onSubmit={handleSubmit(handleSubmitDataSource)}>
                  <TabPanel value={valueTab} index={0}>
                    <DataSourceDescriptionTab
                      schema={DataSourceSchema}
                      register={register}
                      control={control}
                      errors={errors}
                    />
                  </TabPanel>

                  <TabPanel value={valueTab} index={1}>
                    <DataSourceCredentialsTab
                      schema={DataSourceSchema}
                      register={register}
                      errors={errors}
                    />
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