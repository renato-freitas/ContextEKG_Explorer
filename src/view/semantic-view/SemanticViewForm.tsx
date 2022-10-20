import { useContext, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormLabel, Grid, Modal, ModalManager, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { addSemanticView, ISemanticViewForm } from "../../services/sparql-semantic-view";

import { LoadingContext } from "../../App";

export const SemanticViewForm = ({ open, setOpenSemanticViewDialog, ekg }) => {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const handleCloseDialog = () => {
    setOpenSemanticViewDialog(false);
  };

  const SemanticViewSchema = zod.object({
    identifier: zod.string().optional(),
    label: zod.string().min(1, 'Digite ao menos 1 caracter'),
    page: zod.string().optional(),
    belongsTo: zod.string().optional(),
    comment: zod.string().optional(),
    created: zod.string().optional(),
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ISemanticViewForm>({
    resolver: zodResolver(SemanticViewSchema),
    defaultValues: {
      identifier: '',
      label: '',
      page: '',
      created: '',
      belongsTo: ''
    }
  });

  const handleSubmitSemanticView: SubmitHandler<ISemanticViewForm> = async (data) => {
    console.log("*** Enviando dados da Visão Semântica ***")
    console.log({...data, belongsTo: ekg.identifier.value});
    try {
      setIsLoading(true);
      if (data.identifier !== "") {
        console.log("*** Atualizando a Visão Semântica ***")
        // await updateDataSource(data)
      } else {
        console.log("*** Criando a Visão Semântica ***")
        // await insertOrganization(data);
        await addSemanticView({...data, belongsTo: ekg.identifier.value})
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        reset();
        setIsLoading(false);
        // navigate(-1)
      }, 300);
    }
  };


  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>{`${'Instaciar'} Visão Semântica`}</DialogTitle>
      {/* <Divider /> */}
      <form onSubmit={handleSubmit(handleSubmitSemanticView)}>
        <DialogContent>
          {/* <DialogContentText>
            No portal semântico, a Visão Semântica é conhecida como Camada Semântica
          </DialogContentText> */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="label">Rótulo</FormLabel>
                <TextField
                  variant="outlined"
                  placeholder="Ex: Visão Semântica do Aracati/CE"
                  size="small"
                  {...register('label')}
                />
                {/* <p>{errors.title?.message}</p> */}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="page">Homepage</FormLabel>
                <TextField
                  variant="outlined"
                  placeholder="Ex: http://exemplo.com/page"
                  size="small"
                  {...register('page')}
                />
                {/* <p>{errors.title?.message}</p> */}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog >
  );
}