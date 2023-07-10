import { SetStateAction, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Avatar, Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

import { CaretCircleLeft, Eyeglasses } from 'phosphor-react'
import CircleIcon from '@mui/icons-material/Circle';

// import styles from ';
import { OVSGK, ROUTES } from "../../../commons/constants";
import { findAllExportedViews, findAllLocalGraphsBySemanticView } from "../../../services/sparql-exported-view";
import { LocalGraphEntity } from "../../../models/LocalGraphEntity";
import { MetaMashupModel } from "../../../models/MetaMashupModel";
import { SemanticViewEntity } from "../../../models/SemanticViewEntity";
import { SemanticViewForm } from "../../semantic-view/SemanticViewForm";
import { findOneSemanticView } from "../../../services/sparql-semantic-view";
import { TitleWithButtonBack } from "../../../components/MTitleWithButtonBack";
import { printt } from "../../../commons/utils";
import { MetaEkgSelect } from "../../ekg/EkgSelect";
import { EkgTulioEntity } from "../../../models/EkgTulioEntity";
// import { findOneMetadataGraphByIdentifier } from "../../../services/sparql-metagraph";
import { MCard } from "../../../components/mcard/MCard";
import { SelectExportedView } from "./SelectExportedView";
import { MetaEKGProperties } from "../../../models/MetaEKGProperties";
import { api } from "../../../services/api";
import { RDF_Node } from "../../../models/RDF_Node";
import { PropertyObjectEntity } from "../../../models/PropertyObjectEntity";


export function MetaMashupManage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [metaMashup, setMetaMashup] = useState<MetaMashupModel | null>();
  const [specificatedEKG, setSpecificatedEKG] = useState<MetaMashupModel | null>();
  const [ekg, setEkg] = useState<EkgTulioEntity>();
  const [semanticView, setSemanticView] = useState<SemanticViewEntity | null>();
  const [CheckedExportedViews, setCheckedExportedViews] = useState<string[]>([]);


  /**CARREGAR O META-MASHUP */
  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let state = location.state as MetaMashupModel;
          printt("CARREGANDO O MASHUP SELECIONADO", location.state)
          setMetaMashup(state)
        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);


  /**CARREGAR O META-EKG*/
  const [selectedMetaEKG, setSelectedMetaEKG] = useState<MetaEKGProperties>({} as MetaEKGProperties);
  const [metaEKGs, setMetaEKGs] = useState<MetaEKGProperties[]>([] as MetaEKGProperties[])
  async function loadMetaEKG() {
    try {
      const response = await api.get("/meta-ekgs/");
      printt('[metaekg', response.data)
      setMetaEKGs(response.data)
      setSelectedMetaEKG(response.data[0])
    } catch (error) {
      alert(error)
    } finally {
      // setLoading(false);
    }
  }
  useEffect(() => {
    loadMetaEKG();
  }, [])

  /**CARREGAR  */
  useEffect(() => {
    printt('EV foram selecionadas', CheckedExportedViews)
    async function addExportedView2MetaMashup() {

    }
    if (CheckedExportedViews) {
      addExportedView2MetaMashup()
    }
  }, [CheckedExportedViews]);


  /**CARREGAR AS VISÕES EXPORTADAS */
  const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  useEffect(() => {
    async function loadMetaMashupProperties() {
      try {
        if (location?.state) {
          let state = location.state as MetaMashupModel;
          printt(`/propriedades/mashup/?uri=${encodeURIComponent(state?.uri?.value)}`)
          const response = await api.get(`/propriedades/mashup/?uri=${encodeURIComponent(state?.uri?.value)}`);
          let _x = response.data.filter((ele:any) => ele.p.value == OVSGK.P_META_MASHUP_HAS_EXPORTED_VIEW)
          printt(`propriedades/meta-mashup/`, _x)
          serProperties(_x)
          setCheckedExportedViews(_x.map((ele:any) => ele.o.value))
        }
        // setMetaEKG(response.data)
      } catch (error) {
        alert(error)
      } finally {
      }
    }
    loadMetaMashupProperties()
  }, [location?.state])


  /** ABRE FORM DE SELECIONAR EKG */
  // const [openEkgDialog, setOpenEkgDialog] = useState<boolean>(false);


  /** ABRE FORM PARA SELECIONAR AS VISÕES EXPORTADAS */
  const [openExportedViewDialog, setOpenExportedViewDialog] = useState<boolean>(false);


  return (
    <Container fixed>

      <TitleWithButtonBack
        title="Gerenciar MetaMashup"
        hasButtonBack />

      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        <Chip label={metaMashup?.label?.value} color="primary" sx={{ fontSize: 20 }} />
      </h2>

      {/* KG DE METADADOS */}
      {/* <MCard>
        <Grid item sm={12}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h6" component="div">
              MetaEKG Utilizado
            </Typography>
            {
              metaMashup?.uri_metaEKG
                ? false
                : <Chip
                  label={"Selecionar"}
                  onClick={() => setOpenEkgDialog(true)} />
            }
            <Typography variant="caption" component="div" color="purple">
              {metaMashup?.uri_metaEKG?.value}
            </Typography>
          </Stack>
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
      </MCard> */}

      {/* VISÃO EXPORTADA DO META-MASHUP */}
      <MCard>
        <Grid item sm={6}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h6" component="div">
              Visão Exportada
            </Typography>
            {/* <Chip
              label={metaMashup?.uri_mashup_view ? "Editar" : "Selecionar"}
              onClick={() => setOpenExportedViewDialog(true)} /> */}
            <Button variant="contained" size="small" onClick={() => setOpenExportedViewDialog(true)} sx={{ fontSize: 10 }}>Selecionar</Button>
          </Stack>
          {CheckedExportedViews.length > 0
            ? CheckedExportedViews.map((ele, idx) =>
              <Stack direction="row" spacing={1} key={ele} paddingBottom={0.5}>
                <Typography variant="caption" component="div">
                  <CircleIcon color="secondary" sx={{ fontSize: 10 }} />
                </Typography>
                <Typography variant="caption" component="div" color="purple">
                  {ele}
                </Typography>
              </Stack>
            )
            : false}
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
          <Stack direction="row" gap={1}>
            <Button variant="contained" onClick={() => navigate(ROUTES.EXPORTED_VIEW_LIST, { state: semanticView })}>Visões Exportadas</Button>
            <Button variant="contained">Links Semânticos</Button>
          </Stack>
        </Grid> */}
        <Grid item sm={6}>
          {
            metaMashup?.uri_mashup_view
              ? <Stack direction="row" gap={1}>
                <Button variant="contained" onClick={() => false}>Ontologia</Button>
                <Button variant="contained" onClick={() => navigate(ROUTES.EXPORTED_VIEW_LIST, { state: semanticView })}>Visões Exportadas</Button>
                <Button variant="contained">Links Semânticos</Button>
              </Stack>
              : false
          }
        </Grid>
        {semanticView
          ? <Grid item sm={12}>
            <Divider />
            <Stack gap={1} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Ontologia de Aplicação
              </Typography>

              {/* <Stack direction="row" gap={1}> */}
              {/* <Chip label='Ontologia de Dominio' color="info" /> */}
              {/* </Stack> */}
              <Typography variant="body2" color="text.secondary">
                Visões Exportadas
              </Typography>
              {/* <Box sx={{ width: "100%" }}>
                {localgraphs.map((item) => <Chip
                  sx={{ mr: 0.5, mb: 0.1, mt: 0.1 }}
                  label={item.title?.value}
                  color="secondary"
                  onClick={() => navigate(ROUTES.LOCAL_GRAPH_CONSTRUCT, { state: item })}
                />)}
              </Box> */}
              <Typography variant="body2" color="text.secondary">
                Links Semânticos
              </Typography>

              {/* <Box sx={{ width: "100%" }}> */}
              {/* {localgraphs.map((item) => <Chip label={item.title?.value} color="warning" sx={{ mr: 0.5, mb: 0.1, mt: 0.1 }} />)} */}
              {/* </Box> */}

            </Stack>
          </Grid>
          : false}
      </MCard>

      {/* <MetaEkgSelect
        from="mashup"
        open={openEkgDialog}
        setOpenEkgDialog={setOpenEkgDialog}
        mashup_metadata_graph={metaMashup}
        setEkg={setEkg}
      /> */}

      {/* <SemanticViewForm
        from="mashup"
        open={openSemanticViewDialog}
        setOpenSemanticViewDialog={setOpenSemanticViewDialog}
        metagraph={metaMashup}
        semanticView={semanticView}
        getSemanticView={getSemantiView}
      /> */}

      {
        selectedMetaEKG && <SelectExportedView
          from="mashup"
          open={openExportedViewDialog}
          setOpenEkgDialog={setOpenExportedViewDialog}
          mashup_metadata_graph={metaMashup}
          // setEkg={setEkg}
          selectedMetaEKG={selectedMetaEKG}
          setCheckedExportedViews={setCheckedExportedViews}
        />
      }




    </Container >
  );
}