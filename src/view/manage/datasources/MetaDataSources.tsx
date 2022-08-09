import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Button, Grid, TextField, Typography } from "@mui/material";

import { CaretCircleLeft, CaretCircleRight } from 'phosphor-react'

import styles from './Manage.module.css'

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

export function MetaDataSources() {
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

  return (
    <Container fixed>
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        Metadados de Fonte de Dados
      </h1>
      <h2 style={{ textAlign: "center" }}>** {metagraph?.title.value} **</h2>

      <Grid container spacing={2}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 300 }} />
          <Button variant="contained" onClick={() => alert("loe")}>+ Selecionar Fonte de Dados</Button>
        </Grid>
      </Grid>
    </Container>
  );
}