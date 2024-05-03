// import { useContext, useEffect } from "react";
// import { Box, Button, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
// import Container from "@mui/material/Container";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Grid from "@mui/material/Grid";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { useLocation, useNavigate } from "react-router-dom";
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as zod from 'zod';
// import { RDF_Node } from "../../../models/RDF_Node";

// import { LoadingContext } from "../../../App";
// import { MetaEKGModel } from "../../../models/MetaEKGModel";
// import { double_encode_uri } from "../../../commons/utils";
// import { api } from "../../../services/api";

// export interface LocationParams {
//   pathname: string;
//   state: MetaEKGModel;
//   search: string;
//   hash: string;
//   key: string;
// }

// interface ISparqlQueryParams {
//   uri: RDF_Node;
//   identifier: RDF_Node;
//   title: RDF_Node;
//   label: RDF_Node;
//   description: RDF_Node;
//   exportedViewURI: RDF_Node;
//   localOntologyClass: RDF_Node;
//   sqpCol: RDF_Node;
// }
// interface ISparqlQueryParamsForm {
//   label: string,
//   description: string,
//   exportedViewURI: string,
//   localOntologyClass: string
//   sqpCol: string
// }
// const SparqlQueryParamsSchema = zod.object({
//   identifier: zod.string().optional(),
//   uri: zod.string().optional(),
//   label: zod.string().min(1, 'Digite ao menos 1 caracter'),
//   description: zod.string().optional(),
//   exportedViewURI: zod.string(),
//   localOntologyClass: zod.string().optional(),
//   sqpCol: zod.string().optional(),
// });

export function SparqlQueryParamsForm() {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const { isLoading, setIsLoading } = useContext(LoadingContext);

  // const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ISparqlQueryParamsForm>({
  //   resolver: zodResolver(SparqlQueryParamsSchema),
  //   defaultValues: {
  //     label: '',
  //     description: '',
  //     exportedViewURI: '',
  //     localOntologyClass: '',
  //     sqpCol: ''
  //   }
  // });

  // const handleSubmitSparqlQueryParams: SubmitHandler<ISparqlQueryParamsForm> = async (data) => {
  //   // printt("ENVIANDO DADOS DO MASHUP", data);
  //   try {
  //     setIsLoading(true);
  //     let uri = location?.state as ISparqlQueryParams
  //     // if (uri) {
  //       let uri_enc = double_encode_uri(uri?.uri?.value)
  //       await api.put(`/meta-mashups/${uri_enc}/sparql-query-params`, data)
  //     // } else {
  //       // printt("CRIANDO MASHUP")
  //       // await addtMetadataGraph(data)
  //       // const response = await api.post(`/meta-mashups/`, data)
  //     // }
  //   } catch (error) {
  //     // console.error(error)
  //   } finally {
  //     reset();
  //     setIsLoading(false);
  //     navigate(-1)
  //   }
  // };


  // useEffect(() => {
  //   function onEdit() {
  //     try {
  //       if (location.state) {
  //         let state = location.state as ISparqlQueryParams;
  //         // printt("Colocando o Mashup Selecionado no Formulário", state)
  //         setValue("label", state.label.value);
  //         setValue("description", state.description.value);
  //       }
  //     } catch (err) {
  //       // printt("Erro", err)
  //     }
  //   }
  //   onEdit();
  // }, [location.state]);


  // return (
  //   <Container fixed>
  //     <h2>{`${location.state ? 'Editar' : 'Cadastrar'} Parâmetro SPARQL/RML`}</h2>
  //     <Typography variant='caption'>Parâmetros para consulta SPARQL necessários para construir mapeamento RML</Typography>
  //     <Grid container spacing={0}>
  //       <Grid item lg={12} md={12} xs={12}>
  //         <Card
  //           variant="outlined"
  //           sx={{ p: 0 }}
  //         >
  //           <CardContent sx={{ padding: '30px' }}>
  //             <form onSubmit={handleSubmit(handleSubmitSparqlQueryParams)}>
  //               <Grid container spacing={2}>
  //                 <Grid item sm={6}>
  //                   <FormControl fullWidth>
  //                     <FormLabel htmlFor="label">Rótulo</FormLabel>
  //                     <TextField
  //                       required
  //                       variant="outlined"
  //                       placeholder="Ex: Metadados-SEFAZ-MA"
  //                       size="small"
  //                       {...register('label')}
  //                     />
  //                     <p>{errors.label?.message}</p>
  //                   </FormControl>
  //                 </Grid>
  //                 <Grid item sm={6}>
  //                   <FormControl fullWidth>
  //                     <FormLabel htmlFor="exportedViewURI">URI da visão exportada</FormLabel>
  //                     <TextField
  //                       variant="outlined"
  //                       placeholder="Ex: Empresa"
  //                       size="small"
  //                       {...register("exportedViewURI")}
  //                     />
  //                     <p>{errors.exportedViewURI?.message}</p>
  //                   </FormControl>
  //                 </Grid>
  //                 <Grid item sm={12}>
  //                   <FormControl fullWidth>
  //                     <FormLabel htmlFor="localOntologyClass">Classe da ontologia local</FormLabel>
  //                     <TextField
  //                       variant="outlined"
  //                       placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
  //                       size="small"
  //                       {...register('localOntologyClass')}
  //                     />
  //                     <p>{errors.localOntologyClass?.message}</p>
  //                   </FormControl>
  //                 </Grid>
  //                 <Grid item sm={12}>
  //                   <FormControl fullWidth>
  //                     <FormLabel htmlFor="sqpCol">Colunas da Tabela Lógica</FormLabel>
  //                     <TextField
  //                       variant="outlined"
  //                       placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
  //                       size="small"
  //                       {...register('sqpCol')}
  //                     />
  //                     <p>{errors.sqpCol?.message}</p>
  //                   </FormControl>
  //                 </Grid>
  //                 <Grid item sm={12}>
  //                   <Box display="flex" justifyContent="flex-start">
  //                     <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
  //                       <Button type="submit" color="primary" variant="contained">
  //                         Salvar
  //                       </Button>
  //                       <Button color="secondary" variant="contained"
  //                         onClick={() => navigate(-1)}>
  //                         Cancelar
  //                       </Button>
  //                     </Stack>
  //                   </Box>
  //                 </Grid>
  //               </Grid>
  //             </form>
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //     </Grid>
  //   </Container>
  // )
}