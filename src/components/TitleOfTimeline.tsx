import { useNavigate } from 'react-router-dom';
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import { CaretCircleLeft } from "phosphor-react"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../redux/store'
import { ROUTES } from '../commons/constants';


interface TitleProps {
  title: string;
  hasButtonBack?: boolean;
}

/** Esse componente tem como base um Grid.Container.12 */
export const TitleOfTimeline = ({ title, hasButtonBack }: TitleProps) => {
  const navigate = useNavigate();
  const global_context: any = useSelector((state: RootState) => state.globalContext)
  async function action() {
    navigate(`${ROUTES.PROPERTIES}/${encodeURIComponent(global_context.resourceURI)}`)
  }
  return (
    <Grid container>
      <Grid item sm={12}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {
            hasButtonBack
              ? <IconButton onClick={() => action()} sx={{ p: "0.2px 0" }}>
                <CaretCircleLeft size={30} />
              </IconButton>
              : false
          }
          <h4>{title}</h4>
        </Stack>
      </Grid>
    </Grid>
  )
}