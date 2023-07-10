import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, Chip, Grid, Stack, Typography } from "@mui/material";

import { CaretCircleLeft, CaretCircleRight } from 'phosphor-react'

// import styles from '../manage/Manage.module.css'
import { ROUTES } from "../../commons/constants";

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

export function SemanticView() {
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

  const layers = [
    {
      title: "Ontologia de Domínio",
      subTitle: "URI:",
      route: '',
      buttons: [
        <Button>+ Ontologia</Button>
      ],
      items: ["", ""]
    },
    {
      title: "Grafos Locais",
      subTitle: "Visões Exportadas, Grafos Locais e Ligações",
      route: ROUTES.EXPORTED_VIEW_LIST,
      buttons: [
        <Button>+ Ontologia</Button>
      ],
      items: ["", ""]
    },
    {
      title: "Visões de Ligação",
      subTitle: "Links Semânticos",
      route: "",
      buttons: [
        <Button>+ Ontologia</Button>
      ],
      items: ["", ""]
    },
  ]

  return (
    <Container fixed>
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        Gerenciar Visão Semântica
      </h1>
      <Typography variant='caption'>Nessa tela são listas as fontes de dados cadastradas globalmente na plataforma. Elas podem ser reutilizadas na construção de vários Grafos de Metadados</Typography>

      <h2 style={{ textAlign: "center" }}>** {metagraph?.title.value} **</h2>

      {layers.map(layer => {
        return (
          <Card className={styles.card}>
            <CardContent>
              <Grid container className={styles.gridItem}>
                {/* onClick={() => navigate(layer.route, { state: metagraph })}> */}
                <Grid item>
                  <Typography variant="h6" component="div">
                    {layer.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {layer.subTitle}
                  </Typography>
                  <Stack direction="row" gap={1}>
                    {layer.items.map((item) => <Chip label={item} />)}
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack direction="row">
                    {layer.buttons.map((btn) => btn)}
                  </Stack>
                </Grid>
                {/* </Link> */}
                <Grid item>
                  <CaretCircleRight size={22} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )
      })}
    </Container>
  );
}