import { useContext, useEffect } from "react";
import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, NavigateOptions, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { RDF_Node } from "../../../models/RDF_Node";

import { LoadingContext } from "../../../App";
import { DataSourceEntity } from "../../../models/DataSourceEntity";
import { MetadataGraphEntity } from "../../../models/MetadataGraphEntity";
import { OrganizationEntity } from "../../../models/OrganizationEntity";

import { CaretCircleLeft } from "phosphor-react";
import { IDataSourceForm, insertDataSource, updateDataSource } from "../../../services/sparql-datasource";
import { DATASOURCE_TYPES } from '../../../commons/constants';
const MOKG = "http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#";

export interface LocationParams {
  pathname: string;
  state: MetadataGraphEntity;
  search: string;
  hash: string;
  key: string;
}

const DataSourceSchema = zod.object({
  identifier: zod.string().optional(),
  // uri: zod.string().optional(),
  title: zod.string().min(1, 'Digite ao menos 1 caracter'),
  comment: zod.string().optional(),
  created: zod.string().optional(),
  type: zod.string().optional(),
  // modified: zod.string().optional(),
});

export function DataSourceForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationEntity>({} as OrganizationEntity);
  const [typeOfDataSource, setTypeOfDataSource] = useState<string>("");
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IDataSourceForm>({
    resolver: zodResolver(DataSourceSchema),
    defaultValues: {
      identifier: '',
      title: '',
      comment: '',
      type: '',
      created: ''
    }
  });

  const handleSubmitDataSource: SubmitHandler<IDataSourceForm> = async (data) => {
    console.log("*** Enviando dados da Fonte de Dados ***")
    console.log(data);
    try {
      setIsLoading(true);
      if (data.identifier !== "") {
        console.log("*** Atualizando Fonte de Dados ***")
        await updateDataSource(data)
      } else {
        console.log("*** Criando Fonte de Dados ***")
        await insertDataSource(data, selectedOrganization.uri.value);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        reset();
        setIsLoading(false);
        navigate(-1)
      }, 300);
    }
  };


  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as { organization: OrganizationEntity };
          console.log(state.organization)
          setSelectedOrganization(state.organization);

          // let state = location.state as DataSourceEntity;
          // console.log("*** Colocando a Fonde de Dados selecionada no formulário ***")
          // setValue("title", state.title.value);
          // setValue("comment", state.comment.value);
          // setValue("created", state.created.value);
          // setValue("identifier", state.identifier.value);


        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);

  const handleChange = (event: SelectChangeEvent) => {
    setTypeOfDataSource(event.target.value as string);
  };

  return (
    <Container fixed>
      {/* <h1>{`${'Cadastrar'} Fonte de Dados`}</h1> */}
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        {`${selectedOrganization?.title?.value}/Fonte de Dados`}
      </h1>
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
                      <FormLabel htmlFor="title">Título</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Metadados-SEFAZ-MA"
                        size="small"
                        {...register('title')}
                      />
                      <p>{errors.title?.message}</p>
                    </FormControl>
                  </Grid>
                  <Grid item sm={6}>
                    <FormControl fullWidth size="small">
                      <FormLabel htmlFor="type">Tipo de Fonte</FormLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="type"
                        {...register('type')}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {/* <MenuItem value={`${MOKG}RelationalDataBase_DataSource`}>Banco de Dados Relacional</MenuItem>
                        <MenuItem value={`${MOKG}NoSQL_DataSource`}>No-SQL</MenuItem>
                        <MenuItem value={`${MOKG}Triplestore_DataSource`}>Triplestore</MenuItem>
                        <MenuItem value={`${MOKG}CSV_DataSource`}>CSV</MenuItem>
                        <MenuItem value={`${MOKG}RDF_DataSource`}>RDF</MenuItem> */}
                        {Object.entries(DATASOURCE_TYPES).map(([k,v]) => <MenuItem value={v}>{k}</MenuItem> )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="comment">Comentário</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Fonte da Receita Federal ..."
                        size="small"
                        {...register('comment')}
                      />
                      <p>{errors.comment?.message}</p>
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
            {/* {isLoading && <LinearProgress />} */}
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}