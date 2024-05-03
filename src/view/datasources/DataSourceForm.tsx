import { useEffect, useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
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
import Tabs from '@mui/material/Tabs';
import Autocomplete  from "@mui/material/Autocomplete";


import { RDF_Node } from "../../models/RDF_Node";
import { api } from "../../services/api";
import { LoadingContext } from "../../App";
import { double_encode_uri } from "../../commons/utils";
import { VSKG_TBOX, DATASOURCE_TYPES } from "../../commons/constants";


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
  Banco_Dados_Relacional = "http://rdbs-o#Relational_Database",
  // No_SQL = `${VSKG}NoSQL_DataSource`,
  // Triplestore = `${VSKG}Triplestore_DataSource`,
  CSV = "https://www.ntnu.no/ub/ontologies/csv#CsvDocument"
  // RDF = `${VSKG}RDF_DataSource`
}

interface IDataSourceForm {
  label: string,
  name: string,
  description: string,
  subject_datasource: string,
  // type: DataSourceTypeEnum,
  // type: string | null,
  type: string,
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
  name: zod.string().min(1, { message: "Preencher!" }),
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

const options = ['Option 1', 'Option 2'];

export function DataSourceForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const [selectecDataSourceType, setSelectecDataSourceType] = useState<DataSourceTypeEnum>();

  const [tables, setTables] = useState([]);
  const [tableNames, setTableNames] = useState<string[]>([]);

  const [value, setValuei] = useState<string | null>(null);
  const [inputValuei, setInputValue] = useState('');


  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IDataSourceForm>({
    // resolver: zodResolver(DataSourceSchema),
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
    console.log("*** Enviando dados de uma Fonte de Dados ***")
    console.log(data);

    try {
      setIsLoading(true);
      // if (location?.state) {
      let uri = location?.state as IDataSource

      console.log('*** Dados para atualizar ***', uri)
      if (uri) {
        let uri_enc = double_encode_uri(uri.uri.value)
        await api.put(`/datasources/${uri_enc}`, data)
      } else {
        console.log("*** Criando ***")
        const response = await api.post(`/datasources`, data)
        console.log("*** RESPOSTA DO INSERT ***")
        console.log(response)
      }
      reset();
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false);
      navigate(-1)
    }
  };

  /**Editar uma Fonte de Dados */
  useEffect(() => {
    async function onEdit() {
      try {
        if (location.state) {
          setIsLoading(true);
          let state = location.state as IDataSource;
          console.log("*** Colocando a Fonte de Dados Selecionada no Formulário ***")
          console.log(location, state)
          setValue("label", state.label.value);

          console.log('onEdite(), uri', state.uri.value)
          try {
            // let encoded_uri = double_encode_uri(state.uri.value)
            // const response = await api.get(`/properties/${encoded_uri}`);
            // const response = await api.get(`/datasources/${encoded_uri}/properties/`);
            const response = await api.get(`/datasources/properties/?resourceURI=${state.uri.value}`);
            console.log(`response: ${JSON.stringify(response.data)}`)

            // Object.keys(response.data).map((p, idx) => {
            response.data.map((row:any) => {
              row?.p?.value
              let _p: any = row?.p,
                _o: any = row?.o
              console.log(`props: ${_p.value}`)
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.NAME}`)) { setValue("name", _o?.value); }
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.DCTERMS_DESCRIPTION}`)) { setValue("description", _o?.value); }
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.DATASOURCE_TYPE}`)) {
                if (_o?.value == `${VSKG_TBOX.CLASS.RELATIONAL_DATABASE}`) {
                  setValue("type", `${VSKG_TBOX.CLASS.RELATIONAL_DATABASE}`);
                  setValuei("Banco de Dados Relacional")
                }
                if (_o?.value == `${VSKG_TBOX.CLASS.CSV_FILE}`) {
                  setValue("type", `${VSKG_TBOX.CLASS.CSV_FILE}`);
                  setValuei("CSV")
                }
              }
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.DB_CONNECTION_URL}`)) { setValue("connection_url", _o?.value); }
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.DB_USERNAME}`)) { setValue("username", _o?.value); }
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.DB_PASSWORD}`)) { setValue("password", _o?.value); }
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.DB_JDBC_DRIVER}`)) { setValue("jdbc_driver", _o?.value); }
              if (_p?.value.includes(`${VSKG_TBOX.PROPERTY.CSV_FILE_PATH}`)) { setValue("csv_file", _o?.value); }
            })
          } catch (error) {
            console.error("load properties", error)
          } finally {
            setIsLoading(false);
          }

        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);


  Tabs
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

  const [valueTab, setValueTab] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };


  return (
    <Container fixed>
      <h3>{`${'Cadastrar'} Fonte de Dados`}</h3>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              <form onSubmit={handleSubmit(handleSubmitDataSource)}>
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="label">Rótulo</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: REDESIM"
                        size="small"
                        {...register('label')}
                      />
                      <p>{errors.label?.message}</p>
                    </FormControl>
                  </Grid>


                  <Grid item sm={6}>
                    <FormControl fullWidth size="small">
                      <FormLabel htmlFor="type">Tipo da Fonte de Dados</FormLabel>
                      <Autocomplete
                        size="small"
                        value={value}
                        onChange={(event: any, newValue: string | null) => {
                          setValuei(newValue);
                          if (newValue == "Banco de Dados Relacional") {
                            setValue("type", DATASOURCE_TYPES[newValue])
                          } else if (newValue == "CSV") {
                            setValue("type", DATASOURCE_TYPES[newValue])
                          }
                        }}
                        inputValue={inputValuei}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        id="controllable-states-demo"
                        // options={options}
                        options={Object.entries(DATASOURCE_TYPES).map(([k, v]) => k)}
                        // sx={{ width: 300 }}
                        // renderInput={(params) => <TextField {...params} label="Controllable" />}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="descriptin">Descrição</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Essa fontes é sobre..."
                        size="small"
                        {...register('description')}
                      />
                      <p>{errors.description?.message}</p>
                    </FormControl>
                  </Grid>

                  {
                    value == "Banco de Dados Relacional" && <>
                      <Grid item sm={4}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="title">Nome do Banco de Dados</FormLabel>
                          <TextField
                            variant="outlined"
                            placeholder="Ex: DB_Empresa"
                            size="small"
                            {...register('name')}
                          />
                          <p>{errors.name?.message}</p>
                        </FormControl>
                      </Grid>
                      <Grid item sm={4}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="title">URL de Conexão</FormLabel>
                          <TextField
                            variant="outlined"
                            placeholder="Ex: jdbc:postgresql://ip:porta/nome_bd"
                            size="small"
                            {...register('connection_url')}
                          />
                          <p>{errors.connection_url?.message}</p>
                        </FormControl>
                      </Grid>

                      <Grid item sm={4}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="title">Driver JDBC</FormLabel>
                          <TextField
                            variant="outlined"
                            placeholder="Ex: org.postgresql.Driver"
                            size="small"
                            {...register('jdbc_driver')}
                          />
                          <p>{errors.jdbc_driver?.message}</p>
                        </FormControl>
                      </Grid>

                      <Grid item sm={6}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="creator">Nome de Usuário</FormLabel>
                          <TextField
                            variant="outlined"
                            placeholder="Ex: public"
                            size="small"
                            {...register("username")}
                          />
                          <p>{errors.username?.message}</p>
                        </FormControl>
                      </Grid>

                      <Grid item sm={6}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="password">Senha</FormLabel>
                          <TextField
                            variant="outlined"
                            placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
                            size="small"
                            {...register('password')}
                          />
                          <p>{errors.password?.message}</p>
                        </FormControl>
                      </Grid>
                    </>
                  }

                  {
                    value == "CSV" && <>
                      <Grid item sm={4}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="title">Nome do Documento</FormLabel>
                          <TextField
                            variant="outlined"
                            placeholder="Ex: DB_Empresa"
                            size="small"
                            {...register('name')}
                          />
                          <p>{errors.name?.message}</p>
                        </FormControl>
                      </Grid>

                      <Grid item sm={8}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="csv_file">Path do arquivo CSV</FormLabel>
                          <TextField
                            variant="outlined"
                            placeholder="Ex: http://www.meu-repositorio.com/csv-file.csv"
                            size="small"
                            {...register('csv_file')}
                          />
                          <p>{errors.csv_file?.message}</p>
                        </FormControl>
                      </Grid>
                    </>
                  }


                  {/* Botões */}
                  <Grid item sm={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
                        <Button type="submit" color="primary" variant="contained">
                          Salvar
                        </Button>
                        <Button color="secondary" variant="contained"
                          onClick={() => navigate(-1)}>
                          Cancelar
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

              </form>
            </CardContent>
            {/* {isLoading && <LinearProgress />} */}
          </Card>
        </Grid>
      </Grid>
    </Container>
  )

  // return (
  //   <Container fixed>
  //     <h4>Formulário de Fonte de Dados</h4>
  //     <Grid container spacing={0}>
  //       <Grid item lg={12} md={12} xs={12}>
  //         <Card
  //           variant="outlined"
  //           sx={{ p: 0 }}
  //         >
  //           <CardContent sx={{ padding: '30px' }}>
  //             <Box>
  //               <Tabs value={valueTab}
  //                 onChange={handleChange}
  //                 aria-label="basic tabs example"
  //                 indicatorColor="secondary">
  //                 <Tab label={`Descrição`} {...a11yProps(0)} />
  //                 <Tab label="Credenciais" {...a11yProps(1)} />
  //               </Tabs>
  //               <form onSubmit={handleSubmit(handleSubmitDataSource)}>
  //                 <TabPanel value={valueTab} index={0}>
  //                   <DataSourceDescriptionTab
  //                     schema={DataSourceSchema}
  //                     register={register}
  //                     control={control}
  //                     errors={errors}
  //                   />
  //                 </TabPanel>

  //                 <TabPanel value={valueTab} index={1}>
  //                   <DataSourceCredentialsTab
  //                     schema={DataSourceSchema}
  //                     register={register}
  //                     errors={errors}
  //                   />
  //                 </TabPanel>
  //               </form>
  //             </Box>
  //           </CardContent>
  //           {loading && <LinearProgress />}
  //         </Card>
  //       </Grid>
  //     </Grid>
  //   </Container >
  // )
}