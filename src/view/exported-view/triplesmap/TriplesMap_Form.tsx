import React, { useContext, useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Card, CardContent, Container, FormControl, FormLabel, Grid, TextField, Stack, Chip } from '@mui/material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { LoadingContext } from "../../../App";

import { CaretCircleLeft } from 'phosphor-react';
import { LogicalTableForm } from './LogicalTableForm';
import { IExportedViewForm } from '../../../services/sparql-exported-view';
import { ITriplesMapForm } from '../../../services/sparql-triplesmap';
import { LocalGraphEntity } from "../../../models/LocalGraphEntity";

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
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export function TriplesMapForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [localGraph, setLocalGraph] = useState<LocalGraphEntity>();
  const [value_, setValue_] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue_(newValue);
  };

  useEffect(() => {
    function onEdit() {

      console.log("*** TRIPLES MAP ***")
      try {
        if (location.state) {
          // let state = location.state as IMetagraph;
          let state = location.state as LocalGraphEntity;
          console.log("*** CARREGANDO GRAFO LOCAL SELECIONADO ***", location.state)
          setLocalGraph(state)
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);


  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ITriplesMapForm>({
    // resolver: zodResolver(LocalGraphSchema),
    defaultValues: {
      identifier: '',
      label: '',
      urlMappings: '',
      created: '',
      modified: '',
      belongsTo: ''
    }
  });

  const handleSubmitLocalGraph: SubmitHandler<IExportedViewForm> = async (data) => {
    console.log("*** ENVIANDO DADOS DO TRIPLES MAP ***")
    console.log(data);
    try {
      setIsLoading(true);
      if (data.identifier !== "") {
        console.log("*** ATUALIZANDO TRIPLES MAP ***")
        // await updateDataSource(data)
      } else {
        console.log("*** CRIANDO TRIPLES MAP ***")
        // await insertOrganization(data);
        // await addLocalGraph(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        reset();
        setIsLoading(false);
        // navigate(-1)
      }, 300);
    }
  };

  return (
    <Container fixed>
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        {`${'Cadastrar'} Mapeamento R2RML`}
      </h1>
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        <Chip label={localGraph?.title.value} color="primary" sx={{ fontSize: 20 }} />
      </h2>

      <Card
        variant="outlined"
        sx={{ p: 0 }}
      >
        <CardContent sx={{ padding: '30px' }}>
          <Box
            sx={{ bgcolor: 'background.paper', display: 'flex' }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value_}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="Dados Base" {...a11yProps(0)} sx={{ p: 0 }} />
              <Tab label="Tabela Lógica" {...a11yProps(1)} />
              <Tab label="Sujeito" {...a11yProps(2)} />
              <Tab label="Propriedades" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={value_} index={0}>
              <form onSubmit={handleSubmit(handleSubmitLocalGraph)}>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="label">Rótulo</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: Mapeamento da tabela XYZ"
                        size="small"
                        {...register('label')}
                      />
                      {/* <p>{errors.label?.message}</p> */}
                    </FormControl>
                  </Grid>
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="urlMappings">URL do Mapeamento</FormLabel>
                      <TextField
                        variant="outlined"
                        placeholder="Ex: `http://drive.google.com/file/..."
                        size="small"
                        {...register('urlMappings')}
                      />
                      {/* <p>{errors.urlMappings?.message}</p> */}
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
            </TabPanel>
            <TabPanel value={value_} index={1}>
              <LogicalTableForm />
            </TabPanel>
            <TabPanel value={value_} index={2}>
              Classe
            </TabPanel>
            <TabPanel value={value_} index={3}>
              Propriedades
            </TabPanel>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
