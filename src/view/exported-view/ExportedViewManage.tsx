import { SetStateAction, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

import { CaretCircleLeft, Eyeglasses } from 'phosphor-react'

// import styles from ';
import { ROUTES } from "../../commons/constants";
import { findAllExportedViews, findAllLocalGraphsBySemanticView } from "../../services/sparql-exported-view";
import { LocalGraphEntity } from "../../models/LocalGraphEntity";
import { MetaMashup } from "../../models/MetaMashup";
import { SemanticViewEntity } from "../../models/SemanticViewEntity";
import { SemanticViewForm } from "../semantic-view/SemanticViewForm";
import { findOneSemanticView } from "../../services/sparql-semantic-view";
import { TitleWithButtonBack } from "../../components/MTitleWithButtonBack";
import { printt } from "../../commons/utils";
import { EkgSelect } from "../ekg/EkgSelect";
import { EkgTulioEntity } from "../../models/EkgTulioEntity";
import { findOneMetadataGraphByIdentifier } from "../../services/sparql-metagraph";
import { MCard } from "../../components/mcard/MCard";


export function ExportedViewManage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [metaMashup, setMetaMashup] = useState<MetaMashup | null>();
  const [specificatedEKG, setSpecificatedEKG] = useState<MetaMashup | null>();
  const [ekg, setEkg] = useState<EkgTulioEntity>();
  const [semanticView, setSemanticView] = useState<SemanticViewEntity | null>();


  /**CARREGAR O MASHUP */
  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as MetaMashup;
          printt("CARREGANDO O MASHUP SELECIONADO", location.state)
          setMetaMashup(state)
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);


  /**CARREGAR EKG ESPECIFICADO PELO MASHUP */
  async function getSpecificatedEKG(uuid: string) {
    const spec_ekg = await findOneMetadataGraphByIdentifier(uuid)
    printt(`CARREGANDO EKG ESPECIFICADO PELO MASHUP`, spec_ekg)
    setSpecificatedEKG(spec_ekg)
  }

  /**CARREGAR A VISÃO SEMÂNTICA */
  async function getSemantiView(uuid: string) {
    const semantic_view = await findOneSemanticView(uuid)
    printt(`CARREGANDO VISÃO SEMANTICA DO EKG `, semantic_view)
    setSemanticView(semantic_view)
  }

  useEffect(() => {
    console.log(`*** METAGRAPH MUDOU ***`, metaMashup)
    if (metaMashup?.semanticView) {
      // console.log(`*** BUSCANDO A VISÃO SEMÂNTICA ***`)
      let identifier = metaMashup?.semanticView.value.split('#')[1]
      // console.log(`**** ID DA VISÃO SEMÂNTICA ***`, identifier)
      getSpecificatedEKG(identifier);
      getSemantiView(identifier)
    }
  }, [metaMashup]);


  /**CARREGAR AS VISÕES EXPORTADAS */
  // const [localgraphs, setLocalgraphs] = useState<LocalGraphEntity[]>([]);
  // async function loadLocalGraphs() {
  //   try {
  //     const response = await findAllLocalGraphsBySemanticView(semanticView);
  //     printt("listando VISÕES EXPORTADAS", response)
  //     setLocalgraphs(response);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //   }
  // }

  // useEffect(() => {
  //   loadLocalGraphs();
  // }, [location?.state])


  /** ABRE FORM DE SELECIONAR EKG */
  const [openEkgDialog, setOpenEkgDialog] = useState<boolean>(false);


  /** ABRE FORM DA VISÃO SEMANTICA */
  const [openSemanticViewDialog, setOpenSemanticViewDialog] = useState<boolean>(false);


  return (
    <Container fixed>

      <TitleWithButtonBack
        title="Gerenciar Visão Exportada"
        buttonLabel=""
        hasButtonBack />

      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        <Chip label={metaMashup?.uri_l?.value} color="primary" sx={{ fontSize: 20 }} />
      </h2>

      {/* Ontologia Local */}
      <MCard>
        <Grid item sm={12}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h6" component="div">
              Ontologia Local
            </Typography>
            {
              metaMashup?.uri_metaEKG
                ? false
                : <Chip
                  label={"Selecionar"}
                  onClick={() => setOpenEkgDialog(true)} />
            }
            {/* <Typography variant="caption" component="div" color="purple">
              {metaMashup?.uri_metaEKG?.value}
            </Typography> */}
          </Stack>
          {/* {metaMashup?.uri_metaEKG
            ? <Stack direction="row" spacing={1}>
              <Typography variant="caption" component="div">
                Nome:
              </Typography>
              <Typography variant="caption" component="div" color="purple">
                {ekg?.label?.value}
              </Typography>
            </Stack>
            : false} */}
          {metaMashup?.uri_metaEKG
            ? <Stack direction="row" spacing={1}>
              <Typography variant="caption" component="div">
                URI/Nome:
              </Typography>
              <Typography variant="caption" component="div" color="purple">
                {metaMashup?.uri_metaEKG?.value}
              </Typography>
            </Stack>
            : false}
        </Grid>
      </MCard>

      {/* Mapeamentos */}
      <MCard>
        <Grid item sm={6}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h6" component="div">
              Mapeamentos
            </Typography>
            <Chip
              // label={semanticView ? "Editar" : "Instaciar"}
              label={metaMashup?.uri_mashup_view ? "Editar" : "Instaciar"}
              onClick={() => setOpenSemanticViewDialog(true)} />
          </Stack>
          {/* {semanticView
            ? <Stack direction="row" spacing={1}>
              <Typography variant="caption" component="div">
                Nome:
              </Typography>
              <Typography variant="caption" component="div" color="purple">
                {semanticView?.label?.value}
              </Typography>
            </Stack>
            : false} */}
          {metaMashup?.uri_mashup_view
            ? <Stack direction="row" spacing={1}>
              <Typography variant="caption" component="div">
                URI/Nome:
              </Typography>
              <Typography variant="caption" component="div" color="purple">
                {metaMashup?.uri_mashup_view?.value}
              </Typography>
            </Stack>
            : false}
        </Grid>
        {/* <Grid item sm={6}>
          {semanticView ?
            <Stack direction="row" gap={1}>
              <Button variant="contained" onClick={() => false}>Ontologia</Button>
              <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: semanticView })}>Visões Exportadas</Button>
              <Button variant="contained">Links Semânticos</Button>
            </Stack>
            : false
          }
        </Grid> */}
        <Grid item sm={6}>
          {
            metaMashup?.uri_mashup_view
              ? <Stack direction="row" gap={1}>
                <Button variant="contained" onClick={() => false}>Ontologia</Button>
                <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: semanticView })}>Visões Exportadas</Button>
                <Button variant="contained">Links Semânticos</Button>
              </Stack>
              : false
          }
        </Grid>
        {/* {semanticView
          ? <Grid item sm={12}>
            <Divider />
            <Stack gap={1} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Ontologia de Aplicação
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Visões Exportadas
              </Typography>
              <Box sx={{ width: "100%" }}>
                {localgraphs.map((item) => <Chip
                  sx={{ mr: 0.5, mb: 0.1, mt: 0.1 }}
                  label={item.title?.value}
                  color="secondary"
                  onClick={() => navigate(ROUTES.LOCAL_GRAPH_CONSTRUCT, { state: item })}
                />)}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Links Semânticos
              </Typography>

            </Stack>
          </Grid>
          : false} */}
      </MCard>


      {/* Fonte de Dados */}
      <MCard>
        <Grid item sm={6}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h6" component="div">
              Fonte de Dados
            </Typography>
            <Chip
              // label={semanticView ? "Editar" : "Instaciar"}
              label={metaMashup?.uri_mashup_view ? "Editar" : "Instaciar"}
              onClick={() => setOpenSemanticViewDialog(true)} />
          </Stack>
          {/* {semanticView
            ? <Stack direction="row" spacing={1}>
              <Typography variant="caption" component="div">
                Nome:
              </Typography>
              <Typography variant="caption" component="div" color="purple">
                {semanticView?.label?.value}
              </Typography>
            </Stack>
            : false} */}
          {metaMashup?.uri_mashup_view
            ? <Stack direction="row" spacing={1}>
              <Typography variant="caption" component="div">
                URI/Nome:
              </Typography>
              <Typography variant="caption" component="div" color="purple">
                {metaMashup?.uri_mashup_view?.value}
              </Typography>
            </Stack>
            : false}
        </Grid>
        {/* <Grid item sm={6}>
          {semanticView ?
            <Stack direction="row" gap={1}>
              <Button variant="contained" onClick={() => false}>Ontologia</Button>
              <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: semanticView })}>Visões Exportadas</Button>
              <Button variant="contained">Links Semânticos</Button>
            </Stack>
            : false
          }
        </Grid> */}
        <Grid item sm={6}>
          {
            metaMashup?.uri_mashup_view
              ? <Stack direction="row" gap={1}>
                <Button variant="contained" onClick={() => false}>Ontologia</Button>
                <Button variant="contained" onClick={() => navigate(ROUTES.LOCAL_GRAPH_LIST, { state: semanticView })}>Visões Exportadas</Button>
                <Button variant="contained">Links Semânticos</Button>
              </Stack>
              : false
          }
        </Grid>
        {/* {semanticView
          ? <Grid item sm={12}>
            <Divider />
            <Stack gap={1} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Ontologia de Aplicação
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Visões Exportadas
              </Typography>
              <Box sx={{ width: "100%" }}>
                {localgraphs.map((item) => <Chip
                  sx={{ mr: 0.5, mb: 0.1, mt: 0.1 }}
                  label={item.title?.value}
                  color="secondary"
                  onClick={() => navigate(ROUTES.LOCAL_GRAPH_CONSTRUCT, { state: item })}
                />)}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Links Semânticos
              </Typography>

            </Stack>
          </Grid>
          : false} */}
      </MCard>
      <EkgSelect
        from="mashup"
        open={openEkgDialog}
        setOpenEkgDialog={setOpenEkgDialog}
        mashup_metadata_graph={metaMashup}
        setEkg={setEkg}
      />

      {/* <SemanticViewForm
        from="mashup"
        open={openSemanticViewDialog}
        setOpenSemanticViewDialog={setOpenSemanticViewDialog}
        metagraph={metaMashup}
        semanticView={semanticView}
        getSemanticView={getSemantiView}
      /> */}




    </Container >
  );
}