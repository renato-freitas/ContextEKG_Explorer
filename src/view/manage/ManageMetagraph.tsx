import { SetStateAction, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

import { CaretCircleLeft, Eyeglasses } from 'phosphor-react'

import styles from './Manage.module.css'
import { ROUTES } from "../../commons/constants";
import { findAllLocalGraphs } from "../../services/sparql-localgraph";
import { LocalGraphEntity } from "../../models/LocalGraphEntity";
import { MetadataGraphEntity } from "../../models/MetadataGraphEntity";
import { SemanticViewEntity } from "../../models/SemanticViewEntity";
import { SemanticViewForm } from "../semantic-view/SemanticViewForm";
import { findOneSemanticView } from "../../services/sparql-semantic-view";

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
  const [metagraph, setMetagraph] = useState<MetadataGraphEntity>();
  const [semanticView, setSemanticView] = useState<SemanticViewEntity>();

  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as MetadataGraphEntity;
          console.log("*** Carregando o Grafo de Metadados selecionado ***\n")
          console.log(location)
          setMetagraph(state)
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);

  useEffect(() => {
    async function getSemantiView(uuid: string) {
      const semantic_view = await findOneSemanticView(uuid)
      console.log(`*** VISÃO SEMANTICA ENCONTRADA *** `, semantic_view)
      setSemanticView(semantic_view[0])
    }
    // console.log(`*** METAGRAPH MUDOU ***`, metagraph)
    if (metagraph?.semanticView) {
      // console.log(`*** BUSCANDO A VISÃO SEMÂNTICA ***`)
      let identifier = metagraph.semanticView.value.split('#')[1]
      // console.log(`**** ID DA VISÃO SEMÂNTICA ***`, identifier)
      getSemantiView(identifier)
    }
  }, [metagraph]);

  let dataSourcelayer = {
    title: "Fontes de Dados", subTitle: "Quantidade:", route: ROUTES.MANAGE_META_DATASOURCES,
    buttons: [
      <Button variant="contained">+ Fonte de Dados</Button>
    ], items: ["Fonte 01", "Fonte 02"]
  }

  // {
  //   title: "Grafo de Conhecimento", subTitle: "Prefixo, Namespace", route: "manage-metagraph", buttons: [
  //     <Button variant="contained">+ Ontologia</Button>
  //   ], items: ["Fonte 01", "Fonte 02"]
  // },
  // ]

  // let semanticViewLayer = {
  //   title: "Visão Semântica", subTitle: "Ontologia de Domínio, Grafos Locais e Ligações", route: ROUTES.SEMANTIC_VIEW,
  //   buttons: [
  //     <Button variant="contained" onClick={() => false}>Ontologia</Button>,
  //     <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST)}>Grafos Locais</Button>,
  //     <Button variant="contained">Links Semânticos</Button>,
  //   ]
  // }

  let applicationLayer = {
    title: "Aplicações & Ferramentas", subTitle: "...", route: "manage-metagraph", buttons: [
      <Button variant="contained">+ Ontologia</Button>
    ], items: ["Fonte 01", "Fonte 02"]
  }

  let accessLayer = {
    title: "Acesso e Integração", subTitle: "Enpoint e Wrapper", route: "manage-metagraph", buttons: [
      <Button variant="contained">+ Ontologia</Button>
    ], items: ["Fonte 01", "Fonte 02"]
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

  /** ABRE FORM DA VISÃO SEMANTICA */
  const [openSemanticViewDialog, setOpenSemanticViewDialog] = useState<boolean>(false);
  // const handleClickOpenSemanticViewDialog = () => {
  //   setOpenSemanticViewDialog(true);
  // };


  return (
    <Container fixed>
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        Gerenciar EKG
      </h1>
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        <Chip label={metagraph?.title.value} color="primary" sx={{ fontSize: 20 }} />
      </h2>

      <Card className={styles.card}>
        <CardContent>
          <Grid container className={styles.gridItem}>
            <Grid item sm={6}>
              <Typography variant="h6" component="div">
                Visão Semântica {' '}
                <span>
                  <Chip label={semanticView ? "Atualizar" : "Instaciar"} onClick={setOpenSemanticViewDialog} />
                </span>
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography variant="caption" component="div">
                  Nome:
                </Typography>
                <Typography variant="caption" component="div" color="purple">
                  {semanticView?.label?.value}
                </Typography>
              </Stack>
            </Grid>
            <Grid item sm={6}>
              {semanticView ?
                <Stack direction="row" gap={1}>
                  {/* {semanticViewLayer.buttons.map((btn) => btn)} */}
                  <Button variant="contained" onClick={() => false}>Ontologia</Button>
                  <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: semanticView })}>Grafos Locais</Button>
                  {/* <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: metagraph })}>Grafos Locais</Button> */}
                  <Button variant="contained">Links Semânticos</Button>
                </Stack>
                : false
              }
            </Grid>
            <Grid item sm={12}>
              <Divider />
              <Stack gap={1} sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ontologia de Domínio
                </Typography>
                <Stack direction="row" gap={1}>
                  <Chip label='Ontologia de Dominio' color="info" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Grafos Locais
                </Typography>
                <Box sx={{ width: "100%" }}>
                  {localgraphs.map((item) => <Chip
                    sx={{ mr: 0.5, mb: 0.1, mt: 0.1 }}
                    label={item.title?.value}
                    color="secondary"
                    onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: item })}
                  />)}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Links Semânticos
                </Typography>
                <Box sx={{ width: "100%" }}>
                  {/* {localgraphs.map((item) => <Chip label={item.title?.value} color="warning" sx={{ mr: 0.5, mb: 0.1, mt: 0.1 }} />)} */}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <SemanticViewForm
        open={openSemanticViewDialog}
        setOpenSemanticViewDialog={setOpenSemanticViewDialog}
        ekg={metagraph}
        semanticView={semanticView}
      />

      {/* {layers.map(layer => {
        return (
          <Card className={styles.card}>
            <CardContent>
              <Grid container className={styles.gridItem}>
                <Grid item>
                  <Typography variant="h6" component="div">
                    {layer.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {layer.subTitle}
                  </Typography>
                  <Stack direction="row" gap={1}>
                    {layer.items.map((item) => <Chip label={item.title?.value} />)}
                  </Stack>
                </Grid>
                <Grid item display='flex' justifyContent="flex-start" alignItems={"flex-start"}>
                  <Stack direction="row" gap={1}>
                    {layer.buttons.map((btn) => btn)}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )
      })} */}
    </Container >
  );
}