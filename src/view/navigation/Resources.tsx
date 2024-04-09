import { useState, useEffect, useContext, ChangeEvent, KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton, Stack, TableCell, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { LoadingContext } from "../../App";
import { double_encode_uri, getContextFromURI, printt } from "../../commons/utils";
import { NUMBERS, ROUTES } from "../../commons/constants";
import { api } from "../../services/api";
import { ResourceModel } from "../../models/ResourceModel";
import { MHeader } from "../../components/MHeader";
import { ClassModel } from "../../models/ClassModel";
import styles from './navigation.module.css';
import { MTable } from "../../components/MTable";
import { Eye } from "phosphor-react";


export function Resources() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedClassRDF, setSelectedClassRDF] = useState<ClassModel>();
  const [selectedResource, setSelectedResource] = useState<ResourceModel>();
  const [resources, setResources] = useState<ResourceModel[]>([]);
  const [labelToSearch, setLabelToSearch] = useState<string>("");
  const [runingSearch, setRuningSearch] = useState<boolean>(false);
  const [totalOfResources, setTotalOfResources] = useState<number>(0);


  async function loadResourcesOfSelectedClass(RDFClass: string, page: Number) {
    let response: any
    try {
      setIsLoading(true)
      console.log(`label to search: ${labelToSearch}`)
      console.log(`label to search: ${page}`)
      let uri = double_encode_uri(RDFClass)
      response = await api.get(`/resources/?classURI=${uri}&page=${page}&rowPerPage=${rowsPerPage}&label=${labelToSearch}`)
      console.log(`2. RECURSOS DA CLASSE`, response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setResources(response.data)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }

  async function getTotalResources(RDFClass: string) {
    let response: any
    try {
      let uri = double_encode_uri(RDFClass)
      response = await api.get(`/resources/count/?classURI=${uri}`)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      setTimeout(() => {
        setTotalOfResources(response.data)
        console.log(`total: `, response.data)
        console.log(`total: `, typeof response.data)
      }, NUMBERS.TIME_OUT_FROM_REQUEST)
    }
  }
  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let classRDF = location.state as ClassModel;
          let classURI = classRDF.class?.value as string
          console.log("1. CLASSE ESCOLHIDA", classRDF.class?.value)
          setSelectedClass(classURI)
          setSelectedClassRDF(classRDF)
          loadResourcesOfSelectedClass(classURI, page)
          getTotalResources(classURI)
        }
      } catch (err) {
        printt("Erro", err)
      } finally {
        window.scrollTo(0, 0)
      }
    }
    onEdit();
  }, [location.state, runingSearch]);


  // useEffect(() => {
  //   loadResourcesOfSelectedClass(selectedClassRDF?.class?.value as string, page)
  // }, [runingSearch]);


  const [selectedIndex, setSelectedIndex] = useState<Number>(1);
  const handleListItemClick = (event: any, idx: Number, resource: ResourceModel) => {
    setSelectedIndex(idx);
    setSelectedResource(resource)
    navigate(ROUTES.PROPERTIES, { state: resource })
  };

  const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#edf4fc" : "None";


  /**Pagination */
  const [page, setPage] = useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(0);
  };



  const handleSearchResourceLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelToSearch((event.target as HTMLInputElement).value);
    console.log((event.target as HTMLInputElement).value)
  };
  const handleSearchEscape = (event: KeyboardEvent) => {
    if (event.key == 'Escape') {
      setLabelToSearch("")
      setPage(0)
      if (labelToSearch != "") {
        setRuningSearch(!runingSearch)
      }
    }
    if (event.key == "Enter") {
      setRuningSearch(!runingSearch)
    }
  };
  return (
    <div className={styles.listkg}>
      <Grid container spacing={1} sx={{ p: '2px 0' }}>
        <Grid item xs={6} sx={{ bgcolor: null }}>
          <MHeader
            // title={`Recursos da classe ${getPropertyFromURI(selectedClass)}`}
            title={`Recursos da classe ${selectedClassRDF?.label?.value}`}
            hasButtonBack
          />
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='flex-end' sx={{ bgcolor: null }}>
          <TextField sx={{ width: 500 }}
            id="outlined-basic" label="Pesquisar" variant="outlined" size="small"
            value={labelToSearch}
            onChange={handleSearchResourceLabel}
            // error={labelToSearch.length > 1 && foundClasses.length == 0}
            // helperText={(labelToSearch.length > 1 && foundClasses.length == 0) ? "Sem corespondência." : null}
            onKeyUp={handleSearchEscape}
          />
        </Grid>
      </Grid>

      {/* CONTENT */}
      {
        !isLoading && <Grid container spacing={4} sx={{ mb: 1 }}>
          {/* DATA SOURCES */}
          <Grid item sm={12} justifyContent={'center'}>
            <MTable
              header={[["Recursos", "left"], ["Proveniência", "left"]]}
              // size={resources.length}
              size={totalOfResources}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              hasActions
              alignActions='right'
              loading={false}
            >
              {
                (rowsPerPage > 0
                  ? resources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : resources
                ).map((resource, idx) => (
                  <TableRow key={idx} >
                    <TableCell>
                      <Stack direction={'row'} gap={1}>
                        {/* {DATASOURCE_TYPES_ICONS[resource?.type?.value]} */}
                        <Typography>{resource.label.value}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ p: "0 6px 0 0" }}>
                      <Tooltip title="Propriedades">
                        <Typography variant="caption" component="div" color="gray">
                          {getContextFromURI(resource?.uri?.value)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align='right' sx={{ p: "0 6px 0 0" }}>
                      <Tooltip title="Propriedades">
                        <IconButton onClick={(event) => handleListItemClick(event, idx, resource)} sx={{ p: "4px !important" }}>
                          <Eye size={22} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </MTable>
          </Grid>
        </Grid>
      }

      {/* <Grid container spacing={1}>
        <Grid item sm={12}>
          <List sx={{
            bgcolor: 'None',
            position: 'relative',
            overflow: 'auto',
            '& ul': { padding: 0 },
          }}>
            {resources.map((row, idx) => <ListItemButton key={row?.uri?.value}
              selected={selectedIndex === idx}
              onClick={(event) => handleListItemClick(event, idx, row)}
            >
              <MCard
                bgcolor={changeBgColorCard(idx)}>
                <Box sx={{ width: window.screen.width * 0.6 }}>
                  <Grid item sm={12} gap={3}>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" component="div">
                        {idx + 1} - {getPropertyFromURI(row.label.value)}
                      </Typography>
                      <Typography variant="caption" component="div" color="gray">
                        - {getContextFromURI(row?.uri?.value)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Box>
              </MCard>
            </ListItemButton>
            )}
          </List>
        </Grid>
      </Grid> */}
    </div >
  )
}