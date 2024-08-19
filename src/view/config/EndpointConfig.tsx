import { Link, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../redux/store'
import { updateLanguage } from '../../redux/globalContextSlice';

import { MHeader } from "../../components/MHeader";
import { ROUTES } from "../../commons/constants";
import { getsetRepositoryLocalStorage } from "../../commons/utils";
import styles from '../../styles/global.module.css'

export function EndpointConfig() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
	const global_context = useSelector((state: RootState) => state.globalContext)

  console.log('--- global_context ---', global_context)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateLanguage((event.target as HTMLInputElement).value))
    // window.localStorage.setItem('LANGUAGE', (event.target as HTMLInputElement).value)
    // window.location.reload();
  };

  return (
    <div className={styles.container}>

      <MHeader title={`${global_context.language == 'pt' ? 'Configurações' : 'Settings'}`} />

      <Grid container>
        <Grid item xs={12}>
          <Stack direction={'column'} spacing={1}>
            <Link to="/">Home</Link>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Typography variant="body1">
                Endpoint
              </Typography>
              <Chip
                label={getsetRepositoryLocalStorage()}
                size="small"
                onClick={() => { navigate(ROUTES.REPOSITORY_LIST) }}
              />
            </Stack>

          </Stack>
        </Grid>

        {/* IDIOMA */}
        <Grid item xs={12} sx={{ bgcolor: null }}>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Typography variant="body1">
              {`${global_context.language == 'pt' ? 'Idioma' : 'Language'}`}
            </Typography>

            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={global_context.language}
                onChange={handleChange}
              >
                <FormControlLabel value="pt" control={<Radio size="small" />} label={global_context.language == 'pt' ? "Português" : "Portuguese"} sx={{
                  '.css-ahj2mt-MuiTypography-root': {
                    fontSize: '0.9rem !important',
                  },
                }} />
                <FormControlLabel value="en" control={<Radio size="small" />} label={global_context.language == 'pt' ? "Inglês" : "English"} sx={{
                  '.css-ahj2mt-MuiTypography-root': {
                    fontSize: '0.9rem !important',
                  },
                }} />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

// https://freerangestock.com/sample/39701/group-of-kids.jpg