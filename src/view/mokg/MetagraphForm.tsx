import React, { useState, useContext, useEffect } from "react";
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
import { addtMetadataGraph, updateMetadataGraph } from "../../services/sparql-metagraph";
import { RDF_Node } from "../../models/RDF_Node";
import { LoadingContext } from "../../App";
import { MetadataGraphEntity } from '../../models/MetadataGraphEntity';

interface IFormInput {
  uri: string;
  identifier: string;
  title: string;
  comment: string;
  creator: string;
  created: string;
  modified: string;
}

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
});

export function MetagraphForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IFormInput>({
    resolver: zodResolver(MetadataGraphSchema),
    defaultValues: {
      identifier: '',
      title: '',
      comment: '',
      creator: ''
    }
  });

  const handleSubmitMetadataGraph: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);
      console.log("*** Enviando dados de Grafo de Metadados ***")
      console.log(data);
      if (data.identifier !== "") {
        console.log("*** Atulizando MetadataGraph ***")
        await updateMetadataGraph(data)
      } else {
        console.log("*** Criando MetadataGraph ***")
        await addtMetadataGraph(data)
      }
    } catch (error) {
      console.log(error);
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
          let state = location.state as MetadataGraphEntity;
          console.log("*** Colocando o Grafo de Metadados Selecionado no Formulário ***")
          console.log(location)
          setValue("title", state.title.value);
          setValue("comment", state.comment.value);
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


  return (
    <Container fixed>
      <h1>{`${"Criar"} Grafo de Metadados`}</h1>
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