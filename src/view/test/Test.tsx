import { useState, useEffect } from "react"
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box  from "@mui/material/Box";
import LocationOnIcon from '@mui/icons-material/LocationOn';

import styles from '../kg/ListKG.module.css';
import { loadCountries, findOrganisationFromDBPedia, getComment } from '../../services/sparql-queries'

interface ElementOfRdfClass {
  value: string,
  type: string
}

interface IWikidataCountry {
  s: ElementOfRdfClass
  label: ElementOfRdfClass
}


export function Test() {
  /**Pais */
  const [optionsCountry, setOptionsCountry] = useState<IWikidataCountry[]>([]);
  const [valueCountry, setValueCountry] = useState<IWikidataCountry | null>(null);
  const [inputValueCountry, setInputValueCountry] = useState('');

  useEffect(() => {
    async function loadCountry() {
      const contries = await loadCountries();
      setOptionsCountry(contries);
    }
    // loadCountry()
  }, []);



  /**Organização */
  const [optionsOrganization, setOptionsOrganization] = useState<IWikidataCountry[]>([]);
  const [valueOrganization, setValueOrganization] = useState<IWikidataCountry | null>(null);
  const [inputValueOrganization, setInputValueOrganization] = useState('organi');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    async function loadOrganisations() {
      try {
        setLoading(true)
        setOpen(false)
        let organisations = await findOrganisationFromDBPedia(inputValueOrganization);
        setOptionsOrganization(organisations);
        setOpen(true)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }

    }
    loadOrganisations()
  }, [inputValueOrganization]);


  // const getCommentFromDBPedia = (label: string) => {
  //   let _p = getComment(label)
  //   console.log(_p)
  // }
  const [openComment, setOpenComment] = useState<String>("");

  const handleCloseComment = () => {
    setOpenComment("");
  };

  const handleOpenComment = async (label: String) => {
    let _p = await getComment(label)
    console.log(_p)
    setOpenComment(label);
  };

  return (

    <div className={styles.listkg}>
      <div>
        <Grid container spacing={2}>
          <Grid item sm={10}>
            <Autocomplete
              id="dbpedia"
              loading={loading}
              open={open}
              onClose={() => setOpen(false)}
              options={optionsOrganization}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label.value
              }
              value={valueOrganization}
              onChange={(event: any, newValue: IWikidataCountry | null) => {
                setValueOrganization(newValue);
              }}
              inputValue={inputValueOrganization}
              onInputChange={(event, newInputValue) => {
                console.log(newInputValue)
                setInputValueOrganization(newInputValue);
              }}
              renderInput={(params) => (<TextField {...params} label="Procure uma organização" fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />)}
              renderOption={(props, option) => {
                return (
                  <li key={option.label.value} {...props}>
                    <Grid container>
                      <Grid item>
                        <Box
                          component={LocationOnIcon}
                          sx={{ color: 'text.secondary', mr: 2 }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography color="text.primary">
                          {option.label.value}
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, color: '#ccc' }}>
                          {option.s.value}
                        </Typography> */}
                      </Grid>
                    </Grid>
                  </li>
                );
              }}
            />
          </Grid>
          <Grid item sm={2}>
            {/* <Chip label={valueCountry?.label.value} /> */}
            <Chip label={valueOrganization?.label.value} />
          </Grid>
        </Grid>
      </div>
    </div >
  )
}