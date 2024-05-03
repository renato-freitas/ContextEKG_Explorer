// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Container from "@mui/material/Container";
// import { Button, Chip, Grid, Stack, Typography } from "@mui/material";


// import { ROUTES } from "../../commons/constants";
// import { MetaMashupModel } from "../../models/MetaMashupModel";
// import { SemanticViewEntity } from "../../models/SemanticViewEntity";
// import { findOneSemanticView } from "../../services/sparql-semantic-view";
// import { TitleWithButtonBack } from "../../components/MTitleWithButtonBack";
// import { printt } from "../../commons/utils";
// import { EkgTulioEntity } from "../../models/EkgTulioEntity";
// import { MCard } from "../../components/mcard/MCard";


export function ExportedViewManage() {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const [metaMashup, setMetaMashup] = useState<MetaMashupModel | null>();
  // const [specificatedEKG, setSpecificatedEKG] = useState<MetaMashupModel | null>();
  // const [ekg, setEkg] = useState<EkgTulioEntity>();


  /**CARREGAR O MASHUP */
  // useEffect(() => {
  //   function onEdit() {
  //     try {
  //       if (location.state) {
  //         let state = location.state as MetaMashupModel;
  //         printt("CARREGANDO O MASHUP SELECIONADO", location.state)
  //         setMetaMashup(state)
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   onEdit();
  // }, [location.state]);


  /**CARREGAR EKG ESPECIFICADO PELO MASHUP */
  // async function getSpecificatedEKG(uuid: string) {
  //   const spec_ekg = await findOneMetadataGraphByIdentifier(uuid)
  //   printt(`CARREGANDO EKG ESPECIFICADO PELO MASHUP`, spec_ekg)
  //   setSpecificatedEKG(spec_ekg)
  // }

  /**CARREGAR A VISÃO SEMÂNTICA */
  // async function getSemantiView(uuid: string) {
  //   const semantic_view = await findOneSemanticView(uuid)
  //   printt(`CARREGANDO VISÃO SEMANTICA DO EKG `, semantic_view)
  //   setSemanticView(semantic_view)
  // }

  // useEffect(() => {
  //   console.log(`*** METAGRAPH MUDOU ***`, metaMashup)
  //   if (metaMashup?.semanticView) {
  //     let identifier = metaMashup?.semanticView.value.split('#')[1]
  //     getSemantiView(identifier)
  //   }
  // }, [metaMashup]);


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
  // const [openEkgDialog, setOpenEkgDialog] = useState<boolean>(false);


  /** ABRE FORM DA VISÃO SEMANTICA */
  // const [openSemanticViewDialog, setOpenSemanticViewDialog] = useState<boolean>(false);


  // return (
  //   <Container fixed>

  //     <TitleWithButtonBack
  //       title="Gerenciar Visão Exportada"
  //       buttonLabel=""
  //       hasButtonBack />

  //     <h2 style={{ textAlign: "center", marginBottom: 10 }}>
  //       <Chip label={metaMashup?.uri_l?.value} color="primary" sx={{ fontSize: 20 }} />
  //     </h2>

  //     <MCard>
  //       <Grid item sm={12}>
  //         <Stack direction="row" spacing={2}>
  //           <Typography variant="h6" component="div">
  //             Ontologia Local
  //           </Typography>
  //           {
  //             metaMashup?.uri_metaEKG
  //               ? false
  //               : <Chip
  //                 label={"Selecionar"}
  //                 onClick={() => setOpenEkgDialog(true)} />
  //           }
           
  //         </Stack>
  //         {metaMashup?.uri_metaEKG
  //           ? <Stack direction="row" spacing={1}>
  //             <Typography variant="caption" component="div">
  //               URI/Nome:
  //             </Typography>
  //             <Typography variant="caption" component="div" color="purple">
  //               {metaMashup?.uri_metaEKG?.value}
  //             </Typography>
  //           </Stack>
  //           : false}
  //       </Grid>
  //     </MCard>

  //     <MCard>
  //       <Grid item sm={6}>
  //         <Stack direction="row" spacing={2}>
  //           <Typography variant="h6" component="div">
  //             Mapeamentos
  //           </Typography>
  //           <Chip
  //             label={metaMashup?.uri_mashup_view ? "Editar" : "Instaciar"}
  //             onClick={() => setOpenSemanticViewDialog(true)} />
  //         </Stack>
         
  //         {metaMashup?.uri_mashup_view
  //           ? <Stack direction="row" spacing={1}>
  //             <Typography variant="caption" component="div">
  //               URI/Nome:
  //             </Typography>
  //             <Typography variant="caption" component="div" color="purple">
  //               {metaMashup?.uri_mashup_view?.value}
  //             </Typography>
  //           </Stack>
  //           : false}
  //       </Grid>
       
  //       <Grid item sm={6}>
  //         {
  //           metaMashup?.uri_mashup_view
  //             ? <Stack direction="row" gap={1}>
  //               <Button variant="contained" onClick={() => false}>Ontologia</Button>
  //               <Button variant="contained" onClick={() => navigate(ROUTES.EXPORTED_VIEW_LIST, { state: semanticView })}>Visões Exportadas</Button>
  //               <Button variant="contained">Links Semânticos</Button>
  //             </Stack>
  //             : false
  //         }
  //       </Grid>
       
  //     </MCard>


  //     <MCard>
  //       <Grid item sm={6}>
  //         <Stack direction="row" spacing={2}>
  //           <Typography variant="h6" component="div">
  //             Fonte de Dados
  //           </Typography>
  //           <Chip
  //             label={metaMashup?.uri_mashup_view ? "Editar" : "Instaciar"}
  //             onClick={() => setOpenSemanticViewDialog(true)} />
  //         </Stack>
         
  //         {metaMashup?.uri_mashup_view
  //           ? <Stack direction="row" spacing={1}>
  //             <Typography variant="caption" component="div">
  //               URI/Nome:
  //             </Typography>
  //             <Typography variant="caption" component="div" color="purple">
  //               {metaMashup?.uri_mashup_view?.value}
  //             </Typography>
  //           </Stack>
  //           : false}
  //       </Grid>
        
  //       <Grid item sm={6}>
  //         {
  //           metaMashup?.uri_mashup_view
  //             ? <Stack direction="row" gap={1}>
  //               <Button variant="contained" onClick={() => false}>Ontologia</Button>
  //               <Button variant="contained" onClick={() => navigate(ROUTES.EXPORTED_VIEW_LIST, { state: semanticView })}>Visões Exportadas</Button>
  //               <Button variant="contained">Links Semânticos</Button>
  //             </Stack>
  //             : false
  //         }
  //       </Grid>
  //     </MCard>
  //   </Container >
  // );
}