import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DialogActions, DialogContent, DialogContentText, Divider } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning"

interface MDailogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface IMDailogToConfirmDelete {
  openConfirmDeleteDialog: boolean,
  setOpenConfirmDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>,
  deleteInstance: (identifier: string, type: string ) => void,
  instance: any,
  type: string
}

export function MDialog(props: MDailogProps) {

  const handleClose = () => {
    props.onClose();
  };

  const submit = () => {
    alert("odp")
  }

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>
        <Stack spacing={1} justifyContent="flex-start" direction="row">
          {props.icon}
          <Typography variant="h5">{props.title}</Typography>
        </Stack>
      </DialogTitle>
      {props.children}
      <DialogActions>
        <Box display="flex" justifyContent="flex-start">
          <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
            <Button
              color="primary" variant="contained" onClick={() => submit()}>
              Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleClose()}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </DialogActions>
    </Dialog>
  );
}


export const MDialogToConfirmDelete = (props: IMDailogToConfirmDelete) => {

  const handleDeleteInstance = async () => {
    const deleted = props.deleteInstance(props.instance.identifier?.value, props.type);
    handleCloseDialog();
  }

  const handleCloseDialog = () => {
    props.setOpenConfirmDeleteDialog(false);
  }

  return (
    <Dialog
      open={props.openConfirmDeleteDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
          <WarningIcon color='warning' sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            fontWeight="00"
          >
            Deletar
          </Typography>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Excluir definitivamente o item `}
          <Typography
            variant="button"
            fontWeight="00"
          >
            "{props.instance.label?.value}" ?
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box sx={{}}>
          <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseDialog}
            >
              Não
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteInstance}
            >
              Sim
            </Button>
          </Stack>
        </Box>
      </DialogActions>
    </Dialog>
  )
}