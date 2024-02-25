import { useEffect } from "react";
import React, { useState } from "react";
import { Box, List, ListItemButton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";



import { getPropertyFromURI, double_encode_uri, getContextFromURI, printt } from "../../commons/utils";
import { ROUTES } from "../../commons/constants";
import { api } from "../../services/api";
import { MetaMashupModel } from "../../models/MetaMashupModel";
import { MCard } from "../../components/mcard/MCard";
import { ResourceModel } from "../../models/ResourceModel";
import { MHeader } from "../../components/MHeader";

export interface LocationParams {
  pathname: string;
  state: MetaMashupModel;
  search: string;
  hash: string;
  key: string;
}


export function Resources() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [selectedResource, setSelectedResource] = useState<ResourceModel>();
  const [resources, setResources] = useState<ResourceModel[]>([]);

  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          let classURI = location.state as string;
          console.log("1. CLASSE ESCOLHIDA", classURI)
          console.log('')
          setSelectedClass(classURI)
          loadResourcesOfSelectedClass(classURI, page)
        }
      } catch (err) {
        printt("Erro", err)
      }
    }
    onEdit();
  }, [location.state]);


  async function loadResourcesOfSelectedClass(RDFClass: string, page: Number) {
    try {
      let uri = double_encode_uri(RDFClass)
      const response = await api.get(`/classes/${uri}/resources/${page}`)
      console.log(`2. RECURSOS DA CLASSE`, response.data)
      console.log('')
      setResources(response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      // setLoading(false);
    }

  }

  


  const [selectedIndex, setSelectedIndex] = React.useState<Number>(1);
  const handleListItemClick = (event: any, idx: Number, row: ResourceModel) => {
    setSelectedIndex(idx);
    setSelectedResource(row)
    navigate(ROUTES.PROPERTIES, { state: row })
  };

  const changeBgColorCard = (idx: Number) => selectedIndex == idx ? "#edf4fc" : "None";


  return (
    // <div className={styles.listkg}>
    <div>
      <MHeader
        title={`Recursos da classe ${getPropertyFromURI(selectedClass)}`}
        hasButtonBack
      />

      {/* <Box sx={{ flexGrow: 1, padding: 1 }}> */}
        <Grid container spacing={1}>
          {/* LISTA DOS RECURSOS */}
          <Grid item sm={12}>
            <List sx={{
              bgcolor: 'None',
              position: 'relative',
              overflow: 'auto',
              // maxHeight: 500,
              '& ul': { padding: 0 },
            }}>
              {resources.map((row, idx) => <ListItemButton key={row?.uri?.value}
                selected={selectedIndex === idx}
                onClick={(event) => handleListItemClick(event, idx, row)}
              >
                <MCard
                  bgcolor={changeBgColorCard(idx)}>
                  <Box sx={{ width: window.screen.width * 0.6 }}>
                  {/* <Box sx={{ width: window.window.innerWidth * 0.6 }}> */}
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
        </Grid>
      {/* </Box> */}
    </div>
  )
}