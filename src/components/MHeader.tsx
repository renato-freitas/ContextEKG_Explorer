import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useNavigate } from 'react-router-dom';
import { CaretCircleLeft } from "phosphor-react"
import { Chip, IconButton } from "@mui/material"
import { MenuContext } from './MenuContext'
import { getContextFromURI } from "../commons/utils"

interface TitleProps {
  title: string;
  hasButtonBack?: boolean;
  buttonLabel?: string | null | undefined;
  chip?: React.ReactElement;
  openForm?: () => void
}

export const MHeader = ({ hasButtonBack, title, buttonLabel, chip, openForm }: TitleProps) => {
  const navigate = useNavigate();
  return (
    <Grid container>
      <Grid item sm={12}>
        {/* <Stack direction="row" alignItems="center" spacing={1} margin={1}> */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {
            hasButtonBack
              ?
              // <Box
              //   display="flex"
              //   fontSize={35}
              //   sx={{ '&:hover': { color: '#ddaa00' }, cursor: "pointer" }}
              // >
              <IconButton onClick={() => navigate(-1)} sx={{p:"0.2px 0"}}>
                <CaretCircleLeft
                  size={30}
                  // onClick={() => navigate(-1)}
                />
              </IconButton>
              // </Box>
              : false
          }
          <h4>{title}</h4>
          {
            !buttonLabel
              ? false
              : <>
                <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
                <Button variant="contained" onClick={openForm}>{buttonLabel}</Button>
              </>
          }
          {
            chip && chip
          }
        </Stack>
      </Grid>
    </Grid>

  )
}