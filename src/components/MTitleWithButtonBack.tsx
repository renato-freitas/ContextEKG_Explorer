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
  context?: {
    uri: string,
    name: string,
    properties: {}
  }
  openForm?: () => void
}

export const TitleWithButtonBack = ({ hasButtonBack, title, buttonLabel, chip, context, openForm }: TitleProps) => {
  const navigate = useNavigate();
  return (
    <Grid container>
      <Grid item sm={6}>
        <Stack direction="row" alignItems="center" spacing={1} margin={1}>
          {hasButtonBack
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

      {/* BOTÕES E MENU CONTEXTO */}
      <Grid item sm={6} sx={{ bg: '#523f23', flex: 1, justifyContent: 'flex-end', alignContent: 'flex-end' }}>
        {
          context && <MenuContext {...context} />
        }
      </Grid>
    </Grid>

  )
}