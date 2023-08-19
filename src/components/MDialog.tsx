import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Avatar, DialogActions, DialogContent, DialogContentText, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning"
import { PersonPinCircleOutlined } from "@mui/icons-material";
import { blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { getContextFromURI, printt } from "../commons/utils";
import { PropertyObjectEntity } from "../models/PropertyObjectEntity";

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
  // deleteInstance: (uri: string, type: string ) => void,
  deleteInstance: (uri: string) => void,
  instance: any,
  // type: string
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
    const deleted = props.deleteInstance(props.instance.uri?.value);
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
            {/* "{props.instance.label?.value}" ? */}
            "{props.instance?.uri_l?.value}" ?
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

const emails = ['username@gmail.com', 'user02@gmail.com'];
export interface ContextsDialogProps {
  open: boolean;
  selectedValue: PropertyObjectEntity;
  contexts: PropertyObjectEntity[];
  onClose: (value: PropertyObjectEntity) => void;
}
export function ContextsDialog(props: ContextsDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: PropertyObjectEntity) => {
    onClose(value);
  };
  printt(`contextos`, props.contexts)
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Contextos do Recurso</DialogTitle>
      <List sx={{ pt: 0 }}>
        {
          props.contexts.map((contexto) => (
            <ListItem disableGutters>
              <ListItemButton onClick={() => handleListItemClick(contexto)} key={contexto.o.value}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonPinCircleOutlined />
                  </Avatar>
                </ListItemAvatar>
                {
                  contexto.o.value.includes("http://www.sefaz.ma.gov.br/resource/App")
                    ? <ListItemText primary={"Visão Higienizada"} />
                    : <ListItemText primary={getContextFromURI(contexto.o.value)} />
                }
              </ListItemButton>
            </ListItem>
          ))
        }
        {/* {
          props.contexts.every((contexto) => {
            if (!contexto.o.value.includes("http://www.sefaz.ma.gov.br/resource/App")) {
              return <ListItem disableGutters>
                <ListItemButton onClick={() => handleListItemClick(contexto)} key={contexto.o.value}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <PersonPinCircleOutlined />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={"Visão Unificada"} />
                </ListItemButton>
              </ListItem>

            } else {
              return false

            }

          })
        } */}
        {/* <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick()}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Visão Unificada" />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Dialog>
  );
}