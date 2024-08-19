import { useNavigate } from 'react-router-dom';
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import { CaretCircleLeft } from "phosphor-react"

interface TitleProps {
  title: string;
  hasButtonBack?: boolean;
  buttonBackNavigateTo?: string;
  buttonLabel?: string | null | undefined;
  chip?: React.ReactElement;
  state?: object;
  openForm?: () => void
}

/** Esse componente tem como base um Grid.Container.12 */
export const MHeader = ({ title, hasButtonBack, buttonBackNavigateTo, state, buttonLabel, chip, openForm }: TitleProps) => {
  const navigate = useNavigate();
  return (
    <Grid container>
      <Grid item sm={12}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {
            hasButtonBack && buttonBackNavigateTo
              ?
              <IconButton onClick={() => navigate(buttonBackNavigateTo, state)} sx={{ p: "0.2px 0" }}>
                <CaretCircleLeft size={30} />
              </IconButton>
              : !buttonBackNavigateTo  && hasButtonBack ? <IconButton onClick={() => navigate(-1)} sx={{ p: "0.2px 0" }}>
                <CaretCircleLeft size={30} />
              </IconButton> : false
          }
          {/* {
            hasButtonBack ? <IconButton onClick={() => navigate(-1)} sx={{ p: "0.2px 0" }}>
              <CaretCircleLeft size={30} />
            </IconButton> : false
          } */}
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