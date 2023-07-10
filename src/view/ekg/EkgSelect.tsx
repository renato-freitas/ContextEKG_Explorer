import { useContext, useEffect, useState } from "react";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormLabel, Grid, InputLabel, MenuItem, Modal, ModalManager, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { addSemanticView, ISemanticViewForm, updateSemanticView } from "../../services/sparql-semantic-view";

import { LoadingContext } from "../../App";
import { api } from "../../services/api";
import { printt } from "../../commons/utils";
import { findAllKGOfMetadata } from "../../services/sparql-vskg";
import { EkgTulioEntity } from "../../models/EkgTulioEntity";
import { add_gk_metadados_on_mashup } from "../../services/sparql-mashup";
import { MetaEKGProperties } from "../../models/MetaEKGProperties";

export const MetaEkgSelect = ({ from, open, setOpenEkgDialog, mashup_metadata_graph, setEkg }) => {
  /**Preciso de model porque vem do kg de metadados do Tulio */
  const [metadataGraphs, setMetadataGraphs] = useState<EkgTulioEntity[]>([]);
  const [selectedMetaEKG, setSelectedMetaEKG] = useState<EkgTulioEntity | null>();
  // const [inputValue, setInputValue] = useState('');

  const [metaEKGs, setMetaEKGs] = useState<MetaEKGProperties[]>([] as MetaEKGProperties[])
  useEffect(() => {
    async function getAllEkg() {
      // const response = await findAllKGOfMetadata();
      const response = await api.get("/meta-ekg/");
      printt('CARREGANDO meta EKGs', response.data)
      // response.data só verm uri e uri_l
      // setMetadataGraphs(response)
      setMetaEKGs(response.data)
    }
    getAllEkg();
  }, []);


  const handleCloseDialog = () => {
    setOpenEkgDialog(false);
  };



  interface IEkgForm {
    // kg_metadata: object;
    // meta_ekg: object;
    meta_ekg: MetaEKGProperties
  }

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IEkgForm>({
    // resolver: zodResolver(SemanticViewSchema),
    defaultValues: {
      meta_ekg: {}
    }
  });


  const handleSubmitEkgTulio: SubmitHandler<IEkgForm> = async (data) => {
    try {
      const obj = { uri_meta_mashup: mashup_metadata_graph.uri.value, uri_meta_ekg: data.meta_ekg?.uri?.value}
      printt('obj', obj)
      const response = await api.post("/meta-mashup/associa-meta-ekg", data=obj);
      printt('retorno', response)
      handleCloseDialog();
    } catch (error) {
      console.error(error)
    } finally {
    }
  };


  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>{'Selecionar KG de Metadados'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleSubmitEkgTulio)}>
          <DialogContentText>
            Selecione o KG de Metadados para ter acesso aos metadados da visâo semântica.
          </DialogContentText>
          <br />
          <p>{selectedMetaEKG?.label?.value}</p>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                {/* <FormLabel htmlFor="ekg">KGs de Metadados</FormLabel> */}
                <InputLabel id="demo-simple-select-label">KGs de Metadados</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedMetaEKG}
                  label="KGs de Metadados"
                  // onChange={handleChange}
                  {...register('meta_ekg')}
                >
                  {/* {metadataGraphs.map((ele) => <MenuItem key={ele.uri.value} value={ele}>{ele.label.value}</MenuItem>)} */}
                  {metaEKGs.map((ele) => <MenuItem key={ele?.uri?.value} value={ele}>
                    {ele?.uri_l?.value}
                  </MenuItem>)}
                </Select>
                {/* <p>{errors.title?.message}</p> */}
              </FormControl>
            </Grid>
          </Grid>

          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog >
  );
}