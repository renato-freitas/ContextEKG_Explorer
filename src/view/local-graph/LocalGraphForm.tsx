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
import { ILocalGraphForm, insertOrganization } from "../../services/sparql-organization";
import { addLocalGraph } from "../../services/sparql-localgraph";
import { LocalGraphEntity } from "../../models/LocalGraphEntity";
import { SemanticViewEntity } from "../../models/SemanticViewEntity";

export interface LocationParams {
  pathname: string;
  state: MetadataGraphEntity;
  search: string;
  hash: string;
  key: string;
}

const LocalGraphSchema = zod.object({
  identifier: zod.string().optional(),
  // uri: zod.string().optional(),
  title: zod.string().min(1, 'Digite ao menos 1 caracter'),
  comment: zod.string().optional(),
  created: zod.string().optional(),
  prefix: zod.string().optional(),
  modified: zod.string().optional(),
  belongsTo: zod.string().optional(),
});

export function LocalGraphForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ILocalGraphForm>({
    resolver: zodResolver(LocalGraphSchema),
    defaultValues: {
      identifier: '',
      title: '',
      comment: '',
      created: '',
      modified: '',
      prefix: '',
      belongsTo: ''
    }
  });

  const handleSubmitLocalGraph: SubmitHandler<ILocalGraphForm> = async (data) => {
    console.log("*** Enviando dados da Fonte de Dados ***")
    console.log(data);
    try {
      setIsLoading(true);
      if (data.identifier !== "") {
        console.log("*** Atualizando Fonte de Dados ***")
        // await updateDataSource(data)
      } else {
        console.log("*** Criando Fonte de Dados ***")
        // await insertOrganization(data);
        await addLocalGraph(data)
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
          let state;
          console.log(location.state);
          if (location.state?.from === "d") {
            // state = location.state as MetadataGraphEntity;
            state = location.state as SemanticViewEntity;
            console.log(`*** Visão Semãntica selecionado *** `, state)
            setValue("belongsTo", state.identifier.value)
          } else {
            state = location.state as LocalGraphEntity;
            console.log("*** Colocando o Grafo Local selecionado no formulário ***")
            console.log(state)
            setValue("title", state.title.value);
            setValue("comment", state.comment.value);
            setValue("prefix", state.prefix.value);
            setValue("created", state.created.value);
            setValue("identifier", state.identifier.value);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);

  // const title = watch('title');

  return (
    <Container fixed>
      <h1>{`${'Cadastrar'} Grafo Local`}</h1>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              <form onSubmit={handleSubmit(handleSubmitLocalGraph)}>
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="title">Título</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Ministério da Educação do Brasil"
                        size="small"
                        {...register('title')}
                      />
                      <p>{errors.title?.message}</p>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="comment">Comentário</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: `Núcleo do Governo Federal responsável ..."
                        size="small"
                        {...register('comment')}
                      />
                      <p>{errors.comment?.message}</p>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="prefix">Prefixo de Preferência</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: rdf:"
                        size="small"
                        {...register('prefix')}
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