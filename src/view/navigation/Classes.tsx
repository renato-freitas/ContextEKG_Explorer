import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'
import { ClassModel } from "../../models/ClassModel";
import { Button, Typography } from "@mui/material";
import { getPropertyFromURI } from "../../commons/utils";
import { ROUTES, HIGHLIGHT_CLASSES } from "../../commons/constants";
import { api } from "../../services/api";
import { MHeader } from "../../components/MHeader";

export function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [classesDestaque, setClassesDestaque] = useState<ClassModel[]>([]);
  const [agroupedClasses, setLeis] = useState<any>({});
  const [agroupedClassesDestaque, setAgroupeeClassesDestaque] = useState<any>({});

  async function loadDomainOntologyClasses() {
    try {
      const response = await api.get("/classes");
      response.data.forEach((ele: ClassModel) => {
        if (!agroupedClasses[ele.class.value]) {
          agroupedClasses[ele.class.value] = [ele]
        }
        else {
          agroupedClasses[ele.class.value].push(ele)
        }
        if (HIGHLIGHT_CLASSES.includes(ele.class.value)) {
          if (!agroupedClassesDestaque[ele.class.value]) {
            agroupedClassesDestaque[ele.class.value] = [ele]
          }
          else {
            agroupedClassesDestaque[ele.class.value].push(ele)
          }
          setClassesDestaque([...classesDestaque, ele])
        }
      });

      setClasses(response.data)
    } catch (error) {
      console.log(`><`, error);
    } finally {
      // setLoading(false);
    }

  }

  useEffect(() => {
    loadDomainOntologyClasses();
  }, [])

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: 300
  }));


  return (
    <div>
      <MHeader title={`Classes da Ontologia de Domínio`} />

      {/* CLASSES DESTAQUE */}
      <Box sx={{ flexGrow: 1, padding: 1 }}>
        <div style={{ background: "#ddd", padding: "0px 10px 0px 10px" }}>
          <h4>Classes Destaque</h4>
        </div>
        <Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {
            Object.keys(agroupedClassesDestaque).map((row, index) =>
              <Grid xs={12} sm={6} md={3} key={index}>
                <Item>
                  <Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: row }) }}>
                    <Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
                      {getPropertyFromURI(agroupedClasses[row][0]?.label.value)}
                    </Typography>
                  </Button>
                  <Typography variant="caption" component="div" color="gray" sx={{ wordBreak: "break-word" }}>
                    {agroupedClasses[row][0]?.class.value}
                  </Typography>
                  <Typography variant="caption" component="div" color="ActiveCaption">
                    {agroupedClasses[row][0]?.comment.value}
                  </Typography>

                  <Box sx={{ textAlign: "left", mt: 3 }}>
                    {
                      agroupedClasses[row][0]?.subclass && <Typography variant="caption" component="div" color="brown" sx={{ fontSize: "1rem" }}>
                        SubClasses
                      </Typography>
                    }
                    {
                      agroupedClasses[row][0]?.subclass && [...Array(agroupedClasses[row].length).keys()].map((ele, i) =>
                        <Button variant="text" onClick={() => { navigate(ROUTES.RESOURCES, { state: agroupedClasses[row][ele]?.subclass?.value }) }}>
                          <Typography key={i} variant="h6" component="div" sx={{ fontSize: "0.7rem", fontWeight: '500' }}>
                            {getPropertyFromURI(agroupedClasses[row][ele]?.subclass?.value)}
                          </Typography>
                        </Button>
                      )
                    }
                  </Box>
                </Item>
              </Grid>
            )}
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1, padding: 1 }}>
        <div style={{ background: "#ddd", padding: "0px 10px 0px 10px" }}>
          <h4>Classes</h4>
        </div>
        <Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {
            Object.keys(agroupedClasses).map((row, index) =>
              <Grid xs={12} sm={6} md={3} key={index}>
                <Item>
                  <Button onClick={() => { navigate(ROUTES.RESOURCES, { state: row }) }}>
                    <Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
                      {getPropertyFromURI(agroupedClasses[row][0]?.label.value)}
                    </Typography>
                  </Button>
                  <Typography variant="caption" component="div" color="gray" sx={{ wordBreak: "break-word" }}>
                    {agroupedClasses[row][0]?.class.value}
                  </Typography>
                  <Typography variant="caption" component="div" color="ActiveCaption">
                    {agroupedClasses[row][0]?.comment.value}
                  </Typography>

                  <Box sx={{ textAlign: "left", mt: 3 }}>
                    {
                      agroupedClasses[row][0]?.subclass && <Typography variant="caption" component="div" color="brown" sx={{ fontSize: "1rem" }}>
                        SubClasses
                      </Typography>
                    }
                    {
                      agroupedClasses[row][0]?.subclass && [...Array(agroupedClasses[row].length).keys()].map((ele, i) =>
                        <Button size="small" onClick={() => { navigate(ROUTES.RESOURCES, { state: row }) }}>
                          <Typography key={i} variant="h6" component="div" sx={{ fontSize: "0.7rem", fontWeight: '500' }}>
                            {getPropertyFromURI(agroupedClasses[row][ele]?.subclass?.value)}
                          </Typography>
                        </Button>
                      )
                    }
                  </Box>
                </Item>
              </Grid>
            )}
        </Grid>
      </Box>
    </div>
  );
}



