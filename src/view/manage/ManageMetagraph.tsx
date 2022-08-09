import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, Grid, Typography } from "@mui/material";

import { CaretCircleRight } from 'phosphor-react'

import styles from './Manage.module.css'
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

export function ManageMetagraph() {
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
    { title: "Metadados de Fontes de Dados", subTitle: "Quantidade:", route: ROUTES.MANAGE_META_DATASOURCES },
    { title: "Metadados de Visão Semântica", subTitle: "Ontologia de Domínio, Grafos Locais e Ligações", route: "" },
    { title: "Metadados de Acesso e Integração", subTitle: "Enpoint e Wrapper", route: "" },
    { title: "Metadados de Aplicações & Ferramentas", subTitle: "...", route: "" },
    { title: "Metadados de Grafo de Conhecimento", subTitle: "Prefixo, Namespace", route: "" },
  ]

  return (
    <Container fixed>
      <h1>Gerenciar Grafo de Metadados</h1>
      <h2 style={{ textAlign: "center" }}>** {metagraph?.title.value} **</h2>

      {layers.map(layer => {
        return (
          <Card className={styles.card}>
            <CardContent>
              <Grid container className={styles.gridItem}
                onClick={() => navigate(ROUTES.MANAGE_META_DATASOURCES, { state: metagraph })}>
                <Grid item>
                  <Typography variant="h6" component="div">
                    {layer.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {layer.subTitle}
                  </Typography>
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