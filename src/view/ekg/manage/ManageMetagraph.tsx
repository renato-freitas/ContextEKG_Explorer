// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Container from "@mui/material/Container";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import { Box, Button, Chip, Divider, Grid, Stack, Typography } from "@mui/material";


// import styles from './Manage.module.css'
// import { ROUTES } from "../../../commons/constants";
// import { findAllExportedViews } from "../../../services/sparql-exported-view";
// import { LocalGraphEntity } from "../../../models/LocalGraphEntity";
// import { MetaEKGModel } from "../../../models/MetaEKGModel";
// import { SemanticViewEntity } from "../../../models/SemanticViewEntity";
// import { findOneSemanticView } from "../../../services/sparql-semantic-view";
// import { TitleWithButtonBack } from "../../../components/MTitleWithButtonBack";


export function ManageMetagraph() {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const [ekgMetadata, setEkgMetadata] = useState<MetaEKGModel>();
  // const [semanticView, setSemanticView] = useState<SemanticViewEntity>();

  /**CARREGAR O EKG */
  // useEffect(() => {
  //   function onEdit() {
  //     try {
  //       if (location?.state) {
  //         let state = location.state as MetaEKGModel;
  //         console.log("*** CARREGANDO O KG DE METADADOS SELECIONADO ***", location.state)
  //         setEkgMetadata(state)
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   onEdit();
  // }, [location?.state]);


  /**CARREGAR A VISÃO SEMÂNTICA */
  // async function getSemantiView(uuid: string) {
  //   const semantic_view = await findOneSemanticView(uuid)
  //   console.log(`*** CARREGANDO VISÃO SEMANTICA DO KG DE METADADOS *** `, semantic_view)
  //   setSemanticView(semantic_view)
  // }
  // useEffect(() => {
  //   if (ekgMetadata?.semanticView) {
  //     let identifier = ekgMetadata?.semanticView.value.split('#')[1]
  //     getSemantiView(identifier)
  //   }
  // }, [ekgMetadata]);




  /**CARREGAR AS VISÕES LOCAIS */
  // const [localgraphs, setLocalgraphs] = useState<LocalGraphEntity[]>([]);
  // async function loadExpotedViews() {
  //   try {
  //     const response = await findAllExportedViews();
  //     console.log("\n *** LISTA DAS VISÕES EXPORTADAS *** ", response)
  //     setLocalgraphs(response);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //   }
  // }

  // useEffect(() => {
  //   loadExpotedViews();
  // }, [location?.state])

  /** ABRE FORM DA VISÃO SEMANTICA */
  // const [openSemanticViewDialog, setOpenSemanticViewDialog] = useState<boolean>(false);

  // return (
  //   <Container fixed>

  //     <TitleWithButtonBack title="Gerenciar EKG" hasButtonBack/>
      
  //     <h2 style={{ textAlign: "center", marginBottom: 10 }}>
  //       <Chip label={ekgMetadata?.title.value} color="primary" sx={{ fontSize: 20 }} />
  //     </h2>

  //     <Card className={styles.card}>
  //       <CardContent>
  //         <Grid container className={styles.gridItem}>
  //           <Grid item sm={6}>
  //             <Stack direction="row" spacing={2}>
  //               <Typography variant="h6" component="div">
  //                 Visão Semântica
  //               </Typography>
  //               <Chip label={semanticView ? "Atualizar" : "Instaciar"} onClick={() => setOpenSemanticViewDialog(true)} />
  //             </Stack>
  //             {semanticView
  //               ? <Stack direction="row" spacing={1}>
  //                 <Typography variant="caption" component="div">
  //                   Nome:
  //                 </Typography>
  //                 <Typography variant="caption" component="div" color="purple">
  //                   {semanticView?.label?.value}
  //                 </Typography>
  //               </Stack>
  //               : false}
  //           </Grid>
  //           <Grid item sm={6}>
  //             {semanticView ?
  //               <Stack direction="row" gap={1}>
  //                 <Button variant="contained" onClick={() => false}>Ontologia</Button>
  //                 <Button variant="contained" onClick={() => navigate(ROUTES.EXPORTED_VIEW_LIST, { state: semanticView })}>Grafos Locais</Button>
  //                 <Button variant="contained">Links Semânticos</Button>
  //               </Stack>
  //               : false
  //             }
  //           </Grid>
  //           {semanticView
  //             ? <Grid item sm={12}>
  //               <Divider />
  //               <Stack gap={1} sx={{ mt: 2 }}>
  //                 <Typography variant="body2" color="text.secondary">
  //                   Ontologia de Domínio
  //                 </Typography>
  //                 <Stack direction="row" gap={1}>
  //                 </Stack>
  //                 <Typography variant="body2" color="text.secondary">
  //                   Grafos Locais
  //                 </Typography>
  //                 <Box sx={{ width: "100%" }}>
  //                   {localgraphs.map((item) => <Chip
  //                     sx={{ mr: 0.5, mb: 0.1, mt: 0.1 }}
  //                     label={item.title?.value}
  //                     color="secondary"
  //                     onClick={() => navigate(ROUTES.LOCAL_GRAPH_CONSTRUCT, { state: item })}
  //                   />)}
  //                 </Box>
  //                 <Typography variant="body2" color="text.secondary">
  //                   Links Semânticos
  //                 </Typography>
  //                 <Box sx={{ width: "100%" }}>
  //                 </Box>
  //               </Stack>
  //             </Grid>
  //             : false}
  //         </Grid>
  //       </CardContent>
  //     </Card>
  //   </Container >
  // );
}

{/* <SemanticViewForm
        open={openSemanticViewDialog}
        setOpenSemanticViewDialog={setOpenSemanticViewDialog}
        ekgMetadate={ekgMetadata}
        semanticView={semanticView}
        getSemanticView={getSemantiView}
      /> */}

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