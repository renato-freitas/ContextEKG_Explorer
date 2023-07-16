import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

import CircleIcon from '@mui/icons-material/Circle';

import { VSGK_TBOX, ROUTES } from "../../../commons/constants";
import { MetaMashupModel } from "../../../models/MetaMashupModel";
import { SemanticViewEntity } from "../../../models/SemanticViewEntity";
import { TitleWithButtonBack } from "../../../components/MTitleWithButtonBack";
import { double_encode_uri, printt } from "../../../commons/utils";
import { EkgTulioEntity } from "../../../models/EkgTulioEntity";
import { MCard } from "../../../components/mcard/MCard";
import { SelectExportedView } from "./SelectExportedView";
import { MetaEKGProperties } from "../../../models/MetaEKGProperties";
import { api } from "../../../services/api";
import { PropertyObjectEntity } from "../../../models/PropertyObjectEntity";


export function MetaMashupManage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [metaMashup, setMetaMashup] = useState<MetaMashupModel | null>();
  const [semanticView, setSemanticView] = useState<SemanticViewEntity | null>();
  const [checkedExportedViews, setCheckedExportedViews] = useState<string[]>([]);
  const [properties, serProperties] = useState<PropertyObjectEntity[]>([] as PropertyObjectEntity[])
  const [sqps, setSqps] = useState<any[]>([] as any[])


  /**RECEBER O META-MASHUP SELECIONADO NA LISTA*/
  useEffect(() => {
    async function onEdit() {
      try {
        if (location?.state) {
          let state = location.state as MetaMashupModel;
          // printt("CARREGANDO O MASHUP SELECIONADO", location.state)
          setMetaMashup(state)

          /**OBTER AS VISÕES EXPORTADAS SELECIONADAS DO MTMSHP */
          let _uri = double_encode_uri(state?.uri?.value)
          const response = await api.get(`/properties/${_uri}`);
          let _properties = response.data.filter((ele: any) => ele.p.value == VSGK_TBOX.P_META_MASHUP_HAS_EXPORTED_VIEW)
          // printt(`properties/`, _properties)
          serProperties(_properties)
          setCheckedExportedViews(_properties.map((ele: any) => ele?.label?.value))

          /**OBTER OS PARAMETROS DE CONSULTA SPARQL PARA RML */
          const _response = await api.get(`/meta-mashups/${_uri}/sparql-query-params`);
          printt(`SQP`, _response.data)
          setSqps(_response.data)

        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location?.state]);


  /**ENCONTRAR O META-EKG PARA OBTER AS VISÕES EXPORTADAS SUGERIDAS*/
  const [selectedMetaEKG, setSelectedMetaEKG] = useState<MetaEKGProperties>({} as MetaEKGProperties);
  const [metaEKGs, setMetaEKGs] = useState<MetaEKGProperties[]>([] as MetaEKGProperties[])
  useEffect(() => {
    async function loadMetaEKG() {
      try {
        const response = await api.get("/meta-ekgs/");
        // printt('[metaekg', response.data)
        setMetaEKGs(response.data)
        setSelectedMetaEKG(response.data[0])
      } catch (error) {
        alert(error)
      }
    }
    loadMetaEKG();
  }, [])


  /**QUANDO ENTRAR NA PÁGINA, CARREGAR, SE HOUVER, AS VISÕES EXPORTADAS QUE FORAM SELECIONADAS 
   * ENTRE AS SUGERIDAS (METADADOS ATIVOS)*/

  // useEffect(() => {
  //   async function loadMetaMashupProperties() {
  //     try {
  //       if (location?.state) {
  //         let state = location.state as MetaMashupModel;
  //         let _uri = double_encode_uri(state?.uri?.value)
  //         const response = await api.get(`/properties/${_uri}`);
  //         let _properties = response.data.filter((ele: any) => ele.p.value == VSGK_TBOX.P_META_MASHUP_HAS_EXPORTED_VIEW)
  //         printt(`properties/`, _properties)
  //         serProperties(_properties)
  //         setCheckedExportedViews(_properties.map((ele: any) => ele.o.value))
  //       }
  //     } catch (error) {
  //       alert(error)
  //     } finally {
  //     }
  //   }
  //   loadMetaMashupProperties()
  // }, [location?.state])

  /**CADASTRAR AS VISÕES EXPORTADAS SELECIONADAS NO META-MASHUP  */
  async function addExportedViewForMetaMashup() {
    let uri = double_encode_uri(metaMashup?.uri.value as string)
    let response = api.put(`/meta-mashups/${uri}/add-exported-views`, {
      exportedViewCheckeds: checkedExportedViews
    })
    printt('', response)
  }
  useEffect(() => {
    printt('EV foram selecionadas', checkedExportedViews)

    if (checkedExportedViews) {
      addExportedViewForMetaMashup()
    }
  }, []);






  /** ABRE FORM PARA SELECIONAR AS VISÕES EXPORTADAS */
  const [openExportedViewDialog, setOpenExportedViewDialog] = useState<boolean>(false);


  return (
    <Container fixed>

      <TitleWithButtonBack
        title="Gerenciar MetaMashup"
        hasButtonBack
        chip={<h2 style={{ textAlign: "center", marginBottom: 5 }}>
          <Chip label={metaMashup?.label?.value} color="primary" sx={{ fontSize: 20 }} />
        </h2>}
      />



      <Grid container spacing={1}>
        {/* CLASSE DE FUSÃO DO MM */}
        <Grid item sm={12}>
          <MCard>
            <Grid container gap={1}>
              <Grid item sm={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="h6" component="div">
                    Classe de Fusão
                  </Typography>

                  <Button variant="contained" size="small" onClick={() => setOpenExportedViewDialog(true)} sx={{ fontSize: 10 }}>Selecionar</Button>
                </Stack>
              </Grid>
              <Grid>
                {checkedExportedViews.length > 0
                  ? checkedExportedViews.map((ele, idx) =>
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
              </Grid>
            </Grid>
          </MCard>
        </Grid>

        {/* VISÃO EXPORTADA DO META-MASHUP */}
        <Grid item sm={12}>
          <MCard>
            <Grid container gap={1}>
              <Grid item sm={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="h6" component="div">
                    Visão Exportada
                  </Typography>

                  <Button variant="contained" size="small" onClick={() => setOpenExportedViewDialog(true)} sx={{ fontSize: 10 }}>Selecionar</Button>
                </Stack>
              </Grid>
              <Grid>
                {checkedExportedViews.length > 0
                  ? checkedExportedViews.map((ele, idx) =>
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
              </Grid>
            </Grid>
          </MCard>
        </Grid>

        {/* PARAMETROS PARA CONSULTA SPARQL 2 RML*/}
        <Grid item sm={12}>
          <MCard>
            <Grid container gap={1}>
              <Grid item sm={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="h6" component="div">
                    Parâmetros R2RML
                  </Typography>

                  <Button variant="contained" size="small" onClick={() => navigate(ROUTES.META_MASHUP_SPARQP_QUERY_PARAMS_FORM, { state: metaMashup })} sx={{ fontSize: 10 }}>+ Adicionar</Button>
                </Stack>
              </Grid>
              <Grid>
                {sqps.length > 0
                  ? sqps.map((ele, idx) =>
                    <Stack direction="row" spacing={1} key={ele} paddingBottom={0.5}>
                      <Typography variant="caption" component="div">
                        <CircleIcon color="secondary" sx={{ fontSize: 10 }} />
                      </Typography>
                      <Typography variant="caption" component="div" color="purple">
                        {ele?.label?.value}
                      </Typography>
                    </Stack>
                  )
                  : false}
              </Grid>
            </Grid>
          </MCard>
        </Grid>

        {/* METADADOS PARA O KG DE FUSÃO*/}
        <Grid item sm={12}>
          <MCard>
            <Grid container gap={1}>
              <Grid item sm={12}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="h6" component="div">
                    Metadados para o KG de Fusão
                  </Typography>

                  {/* <Button variant="contained" size="small" onClick={() => navigate(ROUTES.META_MASHUP_SPARQP_QUERY_PARAMS_FORM, { state: metaMashup })} sx={{ fontSize: 10 }}>+ Adicionar</Button> */}
                </Stack>
              </Grid>
              <Grid>
                {sqps.length > 0
                  ? sqps.map((ele, idx) =>
                    <Stack direction="row" spacing={1} key={ele} paddingBottom={0.5}>
                      <Typography variant="caption" component="div">
                        <CircleIcon color="secondary" sx={{ fontSize: 10 }} />
                      </Typography>
                      <Typography variant="caption" component="div" color="purple">
                        {ele?.label?.value}
                      </Typography>
                    </Stack>
                  )
                  : false}
              </Grid>
            </Grid>
          </MCard>
        </Grid>
      </Grid>




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
      {/* </MCard> */}


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
          from="MetaMashupManage"
          open={openExportedViewDialog}
          setOpenEkgDialog={setOpenExportedViewDialog}
          // metaMashup={metaMashup}
          // setEkg={setEkg}
          selectedMetaEKG={selectedMetaEKG}
          setCheckedExportedViews={setCheckedExportedViews}
          submit={addExportedViewForMetaMashup}
        />
      }




    </Container >
  );
}