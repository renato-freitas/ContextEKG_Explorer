import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DialogActions } from "@mui/material";

interface MDailogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
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