import { Box, Button, FormLabel, Stack, TextField } from "@mui/material";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";

import styles from './ListMokg.module.css';
import { insert } from "../../services/sparql-metagraph";

interface MetagraphFormProps {
  children?: React.ReactNode;
}

export function MetagraphForm(props: MetagraphFormProps) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      label: ''
    }
  });

  const onSubmit = async (data: { name: string, label: string }) => {
    console.log(data)
    await insert(data)
  }

  return (
    <Container fixed>
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <FormLabel htmlFor="name">Nome do Grafo</FormLabel>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        <TextField
                          {...field}
                          // inputRef={inputCategoryRef}
                          // id="name"
                          // name="name"
                          // error={formik.touched.name && Boolean(formik.errors.name)}
                          // helperText={formik.touched.name && formik.errors.name}
                          variant="outlined"
                          placeholder="Ex: Metadados-SEFAZ-MA"
                          fullWidth
                          size="small"
                        // onChange={formik.handleChange}
                        // value={formik.values.name}
                        />
                      }
                    />

                  </Grid>
                  <Grid item sm={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
                        <Button type="submit" color="primary" variant="contained">
                          Salvar
                        </Button>
                        <Button>Cancelar</Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>


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




              </form>
            </CardContent>
            {loading && <LinearProgress />}
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}