import { useContext, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormLabel, Grid, Modal, ModalManager, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { addSemanticView, ISemanticViewForm, updateSemanticView } from "../../services/sparql-semantic-view";

import { LoadingContext } from "../../App";
import { print } from "../../commons/utils";

export const SemanticViewForm = ({ from, open, setOpenSemanticViewDialog, metagraph, semanticView, getSemanticView }) => {
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

  useEffect(() => {
    if (open) {
      console.log(`*** PREENCHENDO FORM COM DADOS DA VS: `, semanticView)
      setValue('belongsTo', semanticView?.belongsTo.value)
      setValue('created', semanticView?.created.value)
      setValue('identifier', semanticView?.identifier.value)
      setValue('label', semanticView?.label.value)
      setValue('page', semanticView?.page.value)
    }
  }, [open]);

  const handleSubmitSemanticView: SubmitHandler<ISemanticViewForm> = async (data) => {
    print("ENVIANDO DADOS DA VS", { ...data, belongsTo: metagraph.identifier.value })
    try {
      setIsLoading(true);
      if (data.identifier) {
        print("ATUALIZANDO A VS")
        const updated = await updateSemanticView({ ...data, belongsTo: metagraph.identifier.value })
        print(`VS ATUALIZADA: `, updated)
        await getSemanticView(data.identifier);
      } else {
        print("CRIANDO VS")
        const created = await addSemanticView({ ...data, belongsTo: metagraph.identifier.value })
        print(`VS CRIADA: `, created)
        await getSemanticView(created.identifier.value);
      }
    } catch (error) {
      console.error(error)
    } finally {
      reset();
      setIsLoading(false);
      handleCloseDialog()
      // setTimeout(() => {
      // }, 300);
    }
  };


  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>{`${semanticView ? 'Atualizar' : 'Instaciar'} Visão Semântica`}</DialogTitle>
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