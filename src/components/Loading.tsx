import { useState, useContext } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingContext } from "../App";

export function Loading() {
  const { isLoading } = useContext(LoadingContext);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
 
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}