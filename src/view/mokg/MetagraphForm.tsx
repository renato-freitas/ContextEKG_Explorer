import { Box, Button, FormLabel, Stack, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface MetagraphFormProps {
  children?: React.ReactNode;
}

export function MetagraphForm(props: MetagraphFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1>Instanciar Grafo de Metadados</h1>
      <span>
        <Link to="/">Home</Link>
      </span>
      <Grid container spacing={0}>
        <Grid item lg={12} md={12} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 0 }}
          >
            <CardContent sx={{ padding: '30px' }}>
              {/* {props.children} */}
              <form>
                <FormLabel htmlFor="name">Nome do Grafo</FormLabel>
                <TextField />

                {/* <Grid container spacing={2}>
                  <Grid item xs={8}>
                    
                  </Grid>
                  <Grid item xs={2}>
                    <CustomFormLabel htmlFor="adicionar">Adicionar</CustomFormLabel>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleSubcategoryList}
                    >
                      <FeatherIcon icon="plus" width="18" />
                    </Button>
                  </Grid>
                </Grid> */}



                {/* <Box display="flex" justifyContent="flex-start">
                  <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
                    <Button type="submit" color="primary" variant="contained">
                      {location.state ? "Atualizar" : "Cadastrar"}
                    </Button>
                    <ButtonBack cancelar />
                  </Stack>
                </Box> */}
              </form>
            </CardContent>
            {loading && <LinearProgress />}
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}