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
import Autocomplete from "@mui/material/Autocomplete";


import { RDF_Node } from "../../models/RDF_Node";
import { SavedQueryModel } from "../../models/SavedQueryModel";
import { api } from "../../services/api";
import { LoadingContext } from "../../App";
import { double_encode_uri } from "../../commons/utils";
import { VSKG_TBOX, DATASOURCE_TYPES } from "../../commons/constants";
import styles from '../../styles/global.module.css'
import { MHeader } from "../../components/MHeader";


interface ISavedQuery {
  identifier: RDF_Node;
  name: RDF_Node;
  label: RDF_Node;
  description: RDF_Node;
  sparql: RDF_Node;
  generalizationClass: RDF_Node;
  
}

// enum DataSourceTypeEnum {
//   Banco_Dados_Relacional = "http://rdbs-o#Relational_Database",
//   CSV = "https://www.ntnu.no/ub/ontologies/csv#CsvDocument"
// }

interface ISavedQueryForm {
  identifier: string,
  name: string,
  description: string,
  sparql: string,
  repository: string | number | boolean,
  generalizationClass: string
}

export interface LocationParams {
  pathname: string;
  state: ISavedQuery;
  search: string;
  hash: string;
  key: string;
}

const DataSourceSchema = zod.object({
  label: zod.string().min(1, { message: "Preencher!" }),
  name: zod.string().min(1, { message: "Preencher!" }),
  description: zod.string().optional(),
  sparql: zod.string().optional(),
});

/**Tenho que decidir como fazer a anotação das tabelas/csv das fontes de dados
 * i) Atualizar globalmente, tal que reflita em todos os GM
 * ii) Ou atualizar individualmente cada GM
 */

const options = ['Option 1', 'Option 2'];

export function SavedQueryForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  // const [selectecDataSourceType, setSelectecDataSourceType] = useState<DataSourceTypeEnum>();

  const [tables, setTables] = useState([]);
  const [tableNames, setTableNames] = useState<string[]>([]);

  const [value, setValuei] = useState<string | null>(null);
  const [inputValuei, setInputValue] = useState('');


  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ISavedQueryForm>({
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

  const handleSubmit_SavedQuery: SubmitHandler<ISavedQueryForm> = async (data) => {
    console.log("*** Enviando dados de uma saved query***")

    try {
      const _repo_in_api_header = api.defaults.headers.common['repo']
      data = { ...data, repository: _repo_in_api_header }
      console.log(data);
      setIsLoading(true);
      // if (location?.state) {
      let uri = location?.state as SavedQueryModel

      console.log('*** Dados para atualizar ***', uri)
      if (uri) {
        let uri_enc = double_encode_uri(uri.uri.value)
        await api.put(`/queries/?uri=${uri_enc}`, data)
      } else {
        console.log("*** Criando ***")
        const response = await api.post(`/queries`, data)
        console.log("*** RESPOSTA DO INSERT ***")
        // console.log(response)
      }
      reset();
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false);
      navigate(-1)
    }
  };

  /**Editar uma consulta salva */
  useEffect(() => {
    async function onEdit() {
      try {
        if (location.state) {
          // setIsLoading(true);
          let state = location.state as ISavedQuery;
          console.log("*** Colocando a consulta salva Selecionada no Formulário ***")
          console.log(state)
          setValue("identifier", state.identifier.value)
          setValue("name", state.name.value)
          setValue("description", state.description.value)
          setValue("sparql", state.sparql.value)
          setValue("generalizationClass", state.generalizationClass.value)


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
    <div className={styles.container}>
      <MHeader title={`${'Cadastrar'} Consulta`} />

      {/* <h3>{`${'Cadastrar'} Consulta`}</h3> */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              <form onSubmit={handleSubmit(handleSubmit_SavedQuery)}>
                <Grid container spacing={2}>

                  <Grid item sm={5} gap={1}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="name">Nome*</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: artistas-nordestinos"
                        size="small"
                        {...register('name')}
                      />
                      <p>{errors.name?.message}</p>
                    </FormControl>

                    <FormControl fullWidth>
                      <FormLabel htmlFor="description">Descrição*</FormLabel>
                      <TextField
                        multiline
                        rows={6}
                        variant="outlined"
                        placeholder="Ex: Essa fontes é sobre..."
                        size="small"
                        {...register('description')}
                      />
                      <p>{errors.description?.message}</p>
                    </FormControl>

                    <FormControl fullWidth>
                      <FormLabel htmlFor="generalization">Classe de Generalização</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: foaf:Organization"
                        size="small"
                        {...register('generalizationClass')}
                      />
                      <p>{errors.generalizationClass?.message}</p>
                    </FormControl>
                  </Grid>




                  <Grid item sm={7}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="title">Consulta SPARQL*</FormLabel>
                      <TextField
                        multiline
                        rows={10}
                        variant="outlined"
                        placeholder="Ex: DB_Empresa"
                        size="small"
                        {...register('sparql')}
                      />
                      <p>{errors.sparql?.message}</p>
                    </FormControl>
                  </Grid>




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
          </Card>
        </Grid>

        <Grid item xs={6}>

        </Grid>
      </Grid>
    </div>
  )


}