import { useContext, useEffect, useState } from "react";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormLabel, Grid, InputLabel, MenuItem, Modal, ModalManager, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { addSemanticView, ISemanticViewForm, updateSemanticView } from "../../../services/sparql-semantic-view";
import { Theme, useTheme } from '@mui/material/styles';
import { LoadingContext } from "../../../App";
import { api } from "../../../services/api";
import { double_encode_uri, printt } from "../../../commons/utils";
import { findAllKGOfMetadata } from "../../../services/sparql-vskg";
import { EkgTulioEntity } from "../../../models/EkgTulioEntity";
import { add_gk_metadados_on_mashup } from "../../../services/sparql-mashup";
import { MetaEKGProperties } from "../../../models/MetaEKGProperties";
import { LocalGraphEntity } from "../../../models/LocalGraphEntity";

interface SelectExportedViewProps {
  from: any, 
  open: any, 
  setOpenEkgDialog: any, 
  submit: any, 
  selectedMetaEKG: any, 
  setCheckedExportedViews?: any
}

export const SelectExportedView = (props: SelectExportedViewProps) => {
  let { from, open, setOpenEkgDialog, submit, selectedMetaEKG, setCheckedExportedViews } = props
  const theme = useTheme();
  const [exportedViewCheckeds, setExportedViewCheckeds] = useState<string[]>([]);

  
  const [exportedViews, setExportedViews] = useState<LocalGraphEntity[]>([]);
  useEffect(() => {
    async function getSuggestedExportedViews(metaekgUri:string) {
      let uri_encoded = double_encode_uri(metaekgUri)
      const response = await api.get(`/meta-ekgs/${uri_encoded}/mashupClass/${"Estabelecimento"}`);
      printt('CARREGANDO EVs', response.data)
      setExportedViews(response.data)
    }
    if(selectedMetaEKG?.uri){
      getSuggestedExportedViews(selectedMetaEKG?.uri.value);
    }
  }, [selectedMetaEKG?.uri]);


  const handleCloseDialog = () => {
    setOpenEkgDialog(false);
  };



  interface IEkgForm {
    meta_ekg: MetaEKGProperties
  }

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IEkgForm>({
    defaultValues: {
      meta_ekg: {}
    }
  });


  const handleSubmitExporteViewsSelected: SubmitHandler<IEkgForm> = async (data) => {
    try {
      setCheckedExportedViews(exportedViewCheckeds)
      submit()
      handleCloseDialog();
    } catch (error) {
      console.error(error)
    } finally {
    }
  };


  function getStyles(name: string, personName: string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const handleChange = (event: SelectChangeEvent<typeof exportedViewCheckeds>) => {
    const {
      target: { value },
    } = event;
    setExportedViewCheckeds(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>{'Selecionar Visão Exportada'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleSubmitExporteViewsSelected)}>
          <DialogContentText>
            Selecione as Visões Exportadas entre as sugeridas pelos metadados ativos.
          </DialogContentText>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Visões Exportadas Sugeridas</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={exportedViewCheckeds}
                  onChange={handleChange}
                  multiple
                  label="Visões Exportadas Sugeridas"
                >
                  {exportedViews.map((ele) => <MenuItem key={ele?.uri?.value} value={ele.label.value} style={getStyles(ele.uri.value, exportedViewCheckeds, theme)}>
                    {ele?.label?.value}
                  </MenuItem>)}
                </Select>
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