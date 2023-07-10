import { useContext, useEffect } from "react";
import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { RDF_Node } from "../../models/RDF_Node";

import { LoadingContext } from "../../App";
import { DataSourceEntity } from "../../models/DataSourceEntity";
import { MetadataGraphEntity } from "../../models/MetadataGraphEntity";
import { addtMetadataGraph, IMetadataGraphForm, updateMetadataGraph } from "../../services/sparql-metagraph";
import { addExportedView } from "../../services/sparql-exported-view";
import { LocalGraphEntity } from "../../models/LocalGraphEntity";
import { SemanticViewEntity } from "../../models/SemanticViewEntity";
import { double_encode_uri, printt } from "../../commons/utils";
import { METADATA_GRAHP_TYPE } from "../../commons/constants";
import { api } from "../../services/api";
import { MetaMashupModel } from "../../models/MetaMashupModel";

export interface LocationParams {
  pathname: string;
  state: MetadataGraphEntity;
  search: string;
  hash: string;
  key: string;
}

interface IMetaMashup {
  uri: RDF_Node;
  identifier: RDF_Node;
  title: RDF_Node;
  label: RDF_Node;
  description: RDF_Node;
  mashupClass: RDF_Node;
}
interface IMetaMashupForm {
  label: string,
  description: string,
  mashupClass: string;
}
const MetaMashupSchema = zod.object({
  identifier: zod.string().optional(),
  uri: zod.string().optional(),
  label: zod.string().min(1, 'Digite ao menos 1 caracter'),
  description: zod.string().optional(),
  mashupClass: zod.string(),

  creator: zod.string().optional(),
  created: zod.string().optional(),
  modified: zod.string().optional(),
  type: zod.string().optional(),
});

export function MashupForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<IMetaMashupForm>({
    resolver: zodResolver(MetaMashupSchema),
    defaultValues: {
      label: '',
      description: '',
      mashupClass: '',
    }
  });

  const handleSubmitMetaMashup: SubmitHandler<IMetaMashupForm> = async (data) => {
    printt("ENVIANDO DADOS DO MASHUP", data);
    try {
      setIsLoading(true);
      let uri = location?.state as IMetaMashup
      if (uri) {
        let uri_enc = double_encode_uri(uri.uri.value)
        await api.put(`/meta-mashups/${uri_enc}`, data)
      } else {
        printt("CRIANDO MASHUP")
        // await addtMetadataGraph(data)
        const response = await api.post(`/meta-mashups/`, data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      reset();
      setIsLoading(false);
      navigate(-1)
    }
  };


  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as IMetaMashup;
          printt("Colocando o Mashup Selecionado no Formulário", state)
          setValue("label", state.label.value);
          setValue("description", state.description.value);
          setValue("mashupClass", state.mashupClass.value);
          // setValue("creator", state.creator.value);
          // setValue("created", state.created.value);
          // setValue("identifier", state.identifier.value);
          // setValue("hasSematicMetadata", state.hasSemanticMetadata)
        }
      } catch (err) {
        printt("Erro", err)
      }
    }
    onEdit();
  }, [location.state]);


  return (
    <Container fixed>
      <h2>{`${location.state?'Editar':'Cadastrar'} MetaMashup`}</h2>
      <Typography variant='caption'>Instancia do Grafo de Metadados do Mashup</Typography>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              <form onSubmit={handleSubmit(handleSubmitMetaMashup)}>
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="label">Rótulo</FormLabel>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Ex: Metadados-SEFAZ-MA"
                        size="small"
                        {...register('label')}
                      />
                      <p>{errors.label?.message}</p>
                    </FormControl>
                  </Grid>
                  <Grid item sm={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="mashupClass">Classe do Mashup</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Empresa"
                        size="small"
                        {...register("mashupClass")}
                      />
                      <p>{errors.mashupClass?.message}</p>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="description">Descrição</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
                        size="small"
                        {...register('description')}
                      />
                      <p>{errors.description?.message}</p>
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