import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import { Play } from 'phosphor-react';

import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../redux/store'
import { updateView, updateResourceAndView, updasteResourceURI } from '../../redux/globalContextSlice';

import { CompetenceQuestionModel } from '../../models/models';
import { MHeader } from "../../components/MHeader";
import { api } from '../../services/api';
import { LoadingContext } from "../../App";
import styles from '../../styles/global.module.css'
import { MTable } from '../../components/MTable';
import { COLORS, ROUTES } from '../../commons/constants';
import { MDialogToConfirmDelete } from '../../components/MDialog';
import { double_encode_uri } from '../../commons/utils';

// import spfmt from 'sparql-formatter';

// import spfmt from 'sparql-formatter';

type typeAlignOfCell = "right" | "left" | "inherit" | "center" | "justify" | undefined

export function CompetenceQuestions() {
  const navigate = useNavigate();
  const [wasDeleted, setWasDeleted] = useState<boolean>(false);
  const { setIsLoading } = useContext(LoadingContext);
  const global_context: any = useSelector((state: RootState) => state.globalContext)
  const [competenceQuestions, setCompetenceQuestions] = useState<CompetenceQuestionModel[]>([]);
  const [competenceQuestionResult, setCompetenceQuestionResult] = useState([]);
  const [competenceQuestionResulVariables, setCompetenceQuestionResultVariables] = useState<Array<[string, typeAlignOfCell]>>([]);
  const [selectedCompetenceQuestion, setSelectedCompetenceQuestion] = useState<CompetenceQuestionModel>({} as CompetenceQuestionModel);
  const [selectedLanguage, setSelectedLanguage] = useState(window.localStorage.getItem('LANGUAGE'));
  let auxLabelOfClasses = [] as string[];
  // const estaEmPortugues = selectedLanguage == 'pt'
  const estaEmPortugues = global_context.language == 'pt'


  async function loadCompetenceQuestions() {
    try {
      setIsLoading(true);
      const response = await api.get(`/competence-questions/?language=${global_context.language}`)
      console.log('-------QC---------\n', response.data)
      setCompetenceQuestions(response.data);
      setSelectedCompetenceQuestion(response.data[0])
    } catch (error) {
      console.error("load saved queries", error)
    } finally {
      setIsLoading(false);
      setWasDeleted(false)
    }
  }

  async function executeSavedQuery(uri: string, idx: number) {
    try {
      setIsLoading(true);
      // let _sparql = double_encode_uri(sparql)
      // console.log(_sparql)
      // const response = await api.get(`/queries/execute/?uri=${uri}`)
      const response = await api.get(`/competence-questions/execute/?uri=${uri}&language=${global_context.language}`)
      setCompetenceQuestionResult(response.data);

      let variables: Array<[string, typeAlignOfCell]> = Object.keys(response.data[0]).map((ele: string) => [ele, "center"])
      setCompetenceQuestionResultVariables(variables)
      console.log('excute result', response.data)
      console.log('variaveis', variables)
    } catch (error) {
      console.error("load saved queries", error)
    } finally {
      setIsLoading(false);
      setSelectedIndex(idx)
    }
  }

  useEffect(() => {
    loadCompetenceQuestions();
  }, [])


  const openForm = () => {
    // console.log("*** call: Abrir formulário de Fonte de Dados ***")
    navigate(ROUTES.SAVED_QUERY_FORM);
  }

  /**Pagination */
  const [page, setPage] = useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(6);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
    // setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const [selectedIndex, setSelectedIndex] = React.useState<Number>(0);


  /**Dialog to Delete */
  const [openDialogToConfirmDelete, setOpenDialogToConfirmDelete] = useState(false);
  const handleRemove = async (normal_uri: string) => {
    try {
      let encoded_uri = double_encode_uri(normal_uri)
      await api.delete(`/queries/?uri=${encoded_uri}`)
      setWasDeleted(true)
    } catch (error) {
      alert(error)
    }

    // await loadSavedQueries();
  }



  return (
    <div className={styles.container}>
      <MHeader title={`${estaEmPortugues ? "Questões de Competência" : "Competence Questions"}`} />

      {/* HEADER */}
      {/* <Grid container spacing={1} sx={{ p: '10px 0' }}>
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={8} gap={1} display='flex' justifyContent='flex-end'
          sx={{ pt: '0px !important' }}>
          <TextField id="outlined-basic" label="Pesquisar pelo nome" variant="outlined" size="small" sx={{ width: 400 }} />
          <Button variant="contained" onClick={openForm}>+ Nova Consulta</Button>
        </Grid>
      </Grid> */}


      <Grid container spacing={2} sx={{ mb: 1 }}>
        {/* QUESTÕES DE COMPETÊNCIA */}
        <Grid item sm={12} justifyContent={'center'}>
          <MTable
            header={[[estaEmPortugues ? "Recursos" : "Resources", "left"], [estaEmPortugues ? "Descrição" : "Description", "left"]]}
            size={competenceQuestions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            hasActions
            alignActions='right'
            loading={false}
          >
            {
              competenceQuestions.length > 0 && competenceQuestions.map((query, idx) => (
                <TableRow key={idx} sx={{ background: `${selectedIndex == idx ? "#1976d214" : false}` }}>
                  <TableCell>
                    <Stack direction={'row'} gap={1}>
                      <Typography>{query.name.value}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction={'row'} gap={1}>
                      <Typography>{query?.description?.value}</Typography>
                    </Stack>
                  </TableCell>
                  {/* BOTÕES */}
                  <TableCell align='right'>

                    <Tooltip title="Executar">
                      {/* <IconButton onClick={() => executeSavedQuery(selectedCompetenceQuestion.uri.value, selectedCompetenceQuestion?.sparql?.value)} sx={{ p: "4px 6px 0 0 !important" }}> */}
                      <IconButton onClick={() => executeSavedQuery(query.uri.value, idx)} sx={{ p: "4px 6px 0 0 !important" }}>
                        <Play size={22} weight="fill" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </MTable>
        </Grid>


      </Grid>

      {/* RENDERIZA O RESULTADO DA QUESTÃO DE COMPETÊNCIA */}
      {
        competenceQuestionResult.length > 0
          ? <><MHeader title={`${estaEmPortugues ? "Resultado" : "Result"}`} />
            <MTable
              header={competenceQuestionResulVariables}
              headerBackColor={COLORS.TO_DATA_SOURCES_IN_UNIFICATION_VIEW[0]}
              size={competenceQuestions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              loading={false}
              noFooter
            >
              {
                competenceQuestionResult.map((row, idx) => {
                  return <TableRow key={idx}>
                    {
                      Object.keys(row).map((key: string) => {
                        return <TableCell align='center'>
                          {/* <Stack direction={'row'} gap={1}> */}
                          {
                            (row[key]["value"] as string).toLowerCase().includes("http")
                              ? <IconButton color='primary' size="small"
                              onClick={() => navigate(ROUTES.PROPERTIES, { state: { resource_uri: row[key]["value"], typeOfClass: "1"}})}>
                                <ManageSearchRoundedIcon />
                              </IconButton>
                              : <Typography>{row[key]["value"]}</Typography>
                          }
                          {/* </Stack> */}
                        </TableCell>
                      })
                    }
                  </TableRow>
                })
              }
            </MTable></>
          : false
      }


      <MDialogToConfirmDelete
        openConfirmDeleteDialog={openDialogToConfirmDelete}
        setOpenConfirmDeleteDialog={setOpenDialogToConfirmDelete}
        deleteInstance={handleRemove}
        instance={selectedCompetenceQuestion}
      />
    </div >
  );
}