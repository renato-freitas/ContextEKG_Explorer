import { useNavigate } from 'react-router-dom';
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import { CaretCircleLeft } from "phosphor-react"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../redux/store'
import { removeResourceOfStackOfResourcesNavigated, update_index_context_menu } from '../redux/globalContextSlice';
import { removeResourceOfStack_ResourcesNavigated } from '../redux/globalContextSlice';
import { ROUTES } from '../commons/constants';


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
export const TitleOfProperties = ({ title, hasButtonBack, buttonBackNavigateTo, state, buttonLabel, chip, openForm }: TitleProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const global_context: any = useSelector((state: RootState) => state.globalContext)
  async function action() {
    // const stack_length = global_context.stack_of_resource_navigated.length
    const stack_length = global_context.stack_of_resources_navigated.length
    console.log('---STACK---', stack_length)
    if (stack_length > 0) {
      // dispatch(removeResourceOfStackOfResourcesNavigated())
      dispatch(removeResourceOfStack_ResourcesNavigated())

      if (stack_length < 2) {
        navigate(ROUTES.RESOURCES)
      } else {
        console.log('1. TITLE OF PROPERTY - STACK:',global_context.stack_of_resources_navigated)
        let resource_uri = global_context.stack_of_resources_navigated[stack_length - 2]
        // navigate(`/properties/${encodeURIComponent(resource_uri)}`)
        dispatch(update_index_context_menu(resource_uri.index_of_context_menu))
        navigate(`${ROUTES.PROPERTIES}/${encodeURIComponent(resource_uri.resource)}`)
      }
    }
  }
  return (
    <Grid container>
      <Grid item sm={12}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {
            hasButtonBack ? <IconButton onClick={() => action()} sx={{ p: "0.2px 0" }}>
              <CaretCircleLeft size={30} />
            </IconButton> : false
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