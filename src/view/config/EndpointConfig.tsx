import { useState } from 'react'
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
import { decrement, increment } from '../../redux/counterState';

import { MHeader } from "../../components/MHeader";
import { ROUTES } from "../../commons/constants";
import { getsetRepositoryLocalStorage, updateGlobalContext } from "../../commons/utils";
import styles from '../../styles/global.module.css'

export function EndpointConfig() {
  const navigate = useNavigate()
  const count = useSelector((state: RootState) => state.context.value)
  const dispatch = useDispatch()
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(window.localStorage.getItem('LANGUAGE'));



  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateGlobalContext({language:(event.target as HTMLInputElement).value})
    setSelectedLanguage((event.target as HTMLInputElement).value);
    window.localStorage.setItem('LANGUAGE', (event.target as HTMLInputElement).value)
    window.location.reload();
  };

  return (
    <div className={styles.container}>

      <MHeader title={`${selectedLanguage == 'pt' ? 'Configurações' : 'Settings'}`} />

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

        {/* LINGUAGEM */}
        <Grid item xs={12} sx={{ bgcolor: null }}>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Typography variant="body1">
              {`${selectedLanguage == 'pt' ? 'Linguagem de preferência' : 'Language'}`}
            </Typography>

            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={selectedLanguage}
                onChange={handleChange}
              >
                <FormControlLabel value="pt" control={<Radio size="small" />} label={selectedLanguage == 'pt' ? "Português" : "Portuguese"} sx={{
                  '.css-ahj2mt-MuiTypography-root': {
                    fontSize: '0.9rem !important',
                  },
                }} />
                <FormControlLabel value="en" control={<Radio size="small" />} label={selectedLanguage == 'pt' ? "Inglês" : "English"} sx={{
                  '.css-ahj2mt-MuiTypography-root': {
                    fontSize: '0.9rem !important',
                  },
                }} />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}

// https://freerangestock.com/sample/39701/group-of-kids.jpg