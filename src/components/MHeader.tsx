import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useNavigate } from 'react-router-dom';
import { CaretCircleLeft } from "phosphor-react"
import { Chip } from "@mui/material"
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
        <Stack direction="row" alignItems="center" spacing={1} margin={1}>
          {
            hasButtonBack
              ? <Box
                display="flex"
                sx={{ '&:hover': { color: '#ddaa00' }, cursor: "pointer" }}
              >
                <CaretCircleLeft
                  size={35}
                  onClick={() => navigate(-1)}
                />
              </Box>
              : false
          }
          <h3>{title}</h3>
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