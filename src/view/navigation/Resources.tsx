import { useState, useEffect, useContext, ChangeEvent } from "react";
// import React, { useState } from "react";
import { Box, IconButton, List, ListItemButton, Stack, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";

import { LoadingContext } from "../../App";
import { getPropertyFromURI, double_encode_uri, getContextFromURI, printt } from "../../commons/utils";
import { NUMBERS, ROUTES } from "../../commons/constants";
import { api } from "../../services/api";
import { MetaMashupModel } from "../../models/MetaMashupModel";
import { MCard } from "../../components/mcard/MCard";
import { ResourceModel } from "../../models/ResourceModel";
import { MHeader } from "../../components/MHeader";
import { ClassModel } from "../../models/ClassModel";
import styles from './navigation.module.css';
import { MTable } from "../../components/MTable";
import { Eye } from "phosphor-react";
import { findAllExportedViews } from "../../services/sparql-exported-view";

// export interface LocationParams {
//   pathname: string;
//   state: MetaMashupModel;
//   search: string;
//   hash: string;
//   key: string;
// }


export function Resources() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedClassRDF, setSelectedClassRDF] = useState<ClassModel>();
  const [selectedResource, setSelectedResource] = useState<ResourceModel>();
  const [resources, setResources] = useState<ResourceModel[]>([]);


  async function loadResourcesOfSelectedClass(RDFClass: string, page: Number) {
    let response: any
    try {
      setIsLoading(true)
      // const element = document.getElementsByName("body");
      // var width = document.body.clientWidth;
      // console.log("Width: " + JSON.stringify(element) + "px" + width);


      let uri = double_encode_uri(RDFClass)
      response = await api.get(`/resources/?classURI=${uri}&page=${page}`)
      console.log(`2. RECURSOS DA CLASSE`, response.data)
      console.log('')
    } catch (error) {
      console.log(`><`, error);
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setResources(response.data)
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
        }
      } catch (err) {
        printt("Erro", err)
      } finally {
        window.scrollTo(0, 0)
      }
    }
    onEdit();
  }, [location.state]);





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
    // setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div className={styles.listkg}>
      {/* <div> */}
      <MHeader
        // title={`Recursos da classe ${getPropertyFromURI(selectedClass)}`}
        title={`Recursos da classe ${selectedClassRDF?.label?.value}`}
        hasButtonBack
      />

      {/* CONTENT */}
      {!isLoading && <Grid container spacing={4} sx={{ mb: 1 }}>
        {/* DATA SOURCES */}
        <Grid item sm={12} justifyContent={'center'}>
          <MTable
            header={[["Recursos", "left"], ["Proveniência", "left"]]}
            size={resources.length}
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
    </div>
  )
}