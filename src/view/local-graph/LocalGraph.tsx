import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";

import { CaretCircleLeft, CaretCircleRight } from 'phosphor-react'

import styles from '../manage/Manage.module.css'
import { ROUTES } from "../../commons/constants";
import { findAllLocalGraphs } from "../../services/sparql-localgraph";
import { LocalGraphEntity } from "../../models/LocalGraphEntity";

interface ElementOfRdfClass {
  value: string,
  type: string
}

interface IMetagraph {
  uri: ElementOfRdfClass;
  identifier: ElementOfRdfClass;
  title: ElementOfRdfClass;
  creator: ElementOfRdfClass;
  created: ElementOfRdfClass;
  modified: ElementOfRdfClass;
}

export function LocalGraph() {
  const location = useLocation();
  const navigate = useNavigate();
  const [metagraph, setMetagraph] = useState<IMetagraph>();

  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as IMetagraph;
          console.log("\n*** Carregando o Grafo de Metadados selecionado que será gerenciado ***\n")
          console.log(location)
          setMetagraph(state)
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);


  let localGraphMetadata = {
    title: "Grafo Local", subTitle: "Vocabulário, TriplesMap e LinkSpec", route: ROUTES.SEMANTIC_VIEW,
    buttons: [
      <Button variant="contained" onClick={() => false}>+ Vocabulário</Button>,
      <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_FORM)}>+ Mapeamento</Button>,
      <Button variant="contained">+ LinkSpec</Button>,
    ]
  }


  const [localgraphs, setLocalgraphs] = useState<LocalGraphEntity[]>([]);
  async function loadLocalGraphs() {
    try {
      // setLoading(true);
      console.log("\n *** Lista de Grafos Locais ***\n")
      const response = await findAllLocalGraphs();
      console.log(response)
      setLocalgraphs(response);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  }

  useEffect(() => {
    loadLocalGraphs();
  }, [location?.state])

  return (
    <Container fixed>
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        Gerenciar Grafo Local
      </h1>
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        <Chip label={`** ${metagraph?.title.value} **`} color="primary" sx={{ fontSize: 20 }} />
      </h2>

      <Card className={styles.card}>
        <CardContent>
          <Grid container className={styles.gridItem}>
            <Grid item sm={6}>
              <Typography variant="h6" component="div">
                {localGraphMetadata.title}
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                {localGraphMetadata.subTitle}
              </Typography> */}
            </Grid>
            <Grid item sm={6}>
              <Stack direction="row" gap={1}>
                {localGraphMetadata.buttons.map((btn) => btn)}
              </Stack>
            </Grid>
            <Grid item sm={12}>
              <Stack gap={1}>
                <Typography variant="body2" color="text.secondary">
                  Ontologia Local
                </Typography>
                <Stack direction="row" gap={1}>
                  <Chip label='Ontologia de Dominio' color="info" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Mapeamentos
                </Typography>
                <Box sx={{ width: "100%" }}>
                  {localgraphs.map((item) => <Chip
                    label={item.title?.value}
                    color="secondary"
                    onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: item })}
                  />)}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Especificações de Links Semânticos
                </Typography>
                <Box sx={{ width: "100%" }}>
                  {localgraphs.map((item) => <Chip label={item.title?.value} color="warning" />)}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}