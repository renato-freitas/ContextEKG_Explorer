import { useContext, useEffect } from "react";
import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Stack, TextField } from "@mui/material";
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
import { addLocalGraph } from "../../services/sparql-localgraph";
import { LocalGraphEntity } from "../../models/LocalGraphEntity";
import { SemanticViewEntity } from "../../models/SemanticViewEntity";
import { print } from "../../commons/utils";
import { METADATA_GRAHP_TYPE } from "../../commons/constants";

export interface LocationParams {
  pathname: string;
  state: MetadataGraphEntity;
  search: string;
  hash: string;
  key: string;
}

const MetadataGraphSchema = zod.object({
  identifier: zod.string().optional(),
  uri: zod.string().optional(),
  title: zod.string().min(1, 'Digite ao menos 1 caracter'),
  comment: zod.string().optional(),
  creator: zod.string().optional(),
  created: zod.string().optional(),
  modified: zod.string().optional(),
  type: zod.string().optional(),
});

export function MashupForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IMetadataGraphForm>({
    resolver: zodResolver(MetadataGraphSchema),
    defaultValues: {
      identifier: '',
      title: '',
      comment: '',
      creator: '',
      type: METADATA_GRAHP_TYPE.MASHUP
    }
  });

  const handleSubmitMetadataGraph: SubmitHandler<IMetadataGraphForm> = async (data) => {
    print("ENVIANDO DADOS DO MASHUP", data);
    try {
      setIsLoading(true);
      if (data.identifier !== "") {
        print("ATUALIZANDO MASHUP")
        await updateMetadataGraph(data)
      } else {
        print("CRIANDO MASHUP")
        await addtMetadataGraph(data)
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
          let state = location.state as MetadataGraphEntity;
          print("Colocando o Mashup Selecionado no Formulário", state)
          setValue("title", state.title.value);
          setValue("comment", state.comment.value);
          setValue("creator", state.creator.value);
          setValue("created", state.created.value);
          setValue("identifier", state.identifier.value);
          // setValue("hasSematicMetadata", state.hasSemanticMetadata)
        }
      } catch (err) {
        print("Erro", err)
      }
    }
    onEdit();
  }, [location.state]);

  // const title = watch('title');

  return (
    <Container fixed>
      <h1>{`${'Cadastrar'} Mashup`}</h1>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              <form onSubmit={handleSubmit(handleSubmitMetadataGraph)}>
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="title">Título</FormLabel>
                      <TextField
                        required
                        variant="outlined"
                        placeholder="Ex: Metadados-SEFAZ-MA"
                        size="small"
                        {...register('title')}
                      />
                      <p>{errors.title?.message}</p>
                    </FormControl>
                  </Grid>
                  <Grid item sm={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="creator">Criador</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Apelido"
                        size="small"
                        {...register("creator")}
                      />
                      <p>{errors.creator?.message}</p>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="comment">Comentário</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
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