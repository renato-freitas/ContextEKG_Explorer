import { useState, useEffect, useContext } from "react"
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
import { LoadingContext, ClassRDFContext } from "../../App";
import { api } from "../../services/api";
import { getsetRepositoryLocalStorage } from "../../commons/utils";
import styles from '../../styles/global.module.css'
import { TextField } from "@mui/material";

export function QA() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const global_context = useSelector((state: RootState) => state.globalContext)
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [runingQuestion, setRuningQuestion] = useState<boolean>(false);

  async function make_question() {
    setIsLoading(true)
    let response: any
    try {

      // let uri = double_encode_uri(global_context.classRDF?.classURI?.value as string)
      response = await api.get(`/llm?question=${question}`)
      console.log('recursos:', response.data)
      setAnswer(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      window.scrollTo(0, 0)
    }
  }

  const handleSearchResourceLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((event.target as HTMLInputElement).value);
    // console.log((event.target as HTMLInputElement).value)
  };
  const handleSearchEscape = (event: KeyboardEvent) => {
    // console.log('', event.key)
    if (event.key == 'Escape') {
      setQuestion("")
      if (question != "") setRuningQuestion(!runingQuestion)
    }
    if (event.key == "Enter") {
      setRuningQuestion(!runingQuestion)
    }
  };


  useEffect(() => {
    console.log('--- global_context ---', global_context)
    function onEdit() {
      try {
        const _repo_in_api_header = api.defaults.headers.common['repo']
        if (_repo_in_api_header) {
          if (question != "") make_question()
        }
        else {
          navigate(ROUTES.REPOSITORY_LIST)
        }
      } catch (err) {
        console.log("Erro", err)
      } finally {
        window.scrollTo(0, 0)
      }
    }
    onEdit();
  }, [runingQuestion]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateLanguage((event.target as HTMLInputElement).value))
    // window.localStorage.setItem('LANGUAGE', (event.target as HTMLInputElement).value)
    // window.location.reload();
  };

  return (
    <div className={styles.container}>

      <MHeader title={`${global_context.language == 'pt' ? 'Pergunte ao Grafo' : 'Ask the Graph'}`} />

      <Grid container>
        {/* PERGUNTA */}
        <Grid item xs={12}>
          PERGUNTA
          <TextField sx={{ width: 450 }}
            id="outlined-basic" label={global_context.language == 'pt' ? "Pesquisar pelo nome do recurso" : "Search by name"} variant="outlined" size="small"
            value={question}
            onChange={handleSearchResourceLabel}
            // error={labelToSearch.length > 1 && foundClasses.length == 0}
            // helperText={(labelToSearch.length > 1 && resources.length == 0) ? "Sem corespondência." : false}
            onKeyUp={handleSearchEscape}
          />
        </Grid>

        {/* RESPOSTA */}
        <Grid item xs={12} sx={{ bgcolor: null }}>
          RESPOSTA
          <Typography>{answer}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}
