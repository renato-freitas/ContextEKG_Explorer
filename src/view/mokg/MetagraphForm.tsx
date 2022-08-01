import { useEffect } from "react";
import React, { useState } from "react";
import { Box, Button, FormLabel, Stack, TextField } from "@mui/material";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { insert } from "../../services/sparql-metagraph";

// interface MetagraphFormProps {
//   children?: React.ReactNode;
// }

interface ElementOfRdfClass {
  value: string,
  type: string
}

interface IMetagraph {
  uri: ElementOfRdfClass;
  title: ElementOfRdfClass;
  creator: ElementOfRdfClass;
  created: ElementOfRdfClass;
  modified: ElementOfRdfClass;
}

interface IFormInput {
  title: string;
  creator: string;
  created: string;
  modified: string;
}

export interface LocationParams {
  pathname: string;
  state: IMetagraph;
  search: string;
  hash: string;
  key: string;
}

export function MetagraphForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setValue } = useForm<IFormInput>();
  // const { control, handleSubmit } = useForm({
  //   defaultValues: {
  //     name: '',
  //     label: ''
  //   }
  // });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    await insert(data)
    setLoading(false);
  };

  useEffect(() => {
    function onEdit() {
      try {
        if (location.state) {
          // formik.setValues(location.state);
          let state = location.state as IMetagraph;
          console.log(location)
          setValue("title", state.title.value);
          setValue("creator", state.creator.value);

        }
      } catch (err) {
        console.log(err);
      }
    }
    onEdit();
  }, [location.state]);

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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <FormLabel htmlFor="title">Título</FormLabel>
                    <Controller
                      name="title"
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
                  <Grid item sm={6}>
                    <FormLabel htmlFor="creator">Criador</FormLabel>
                    <Controller
                      name="creator"
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
                          placeholder="Ex: Apelido"
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
                        <Button color="secondary" variant="contained"
                          onClick={() => location.state && navigate(-1)}>
                          Cancelar
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
            {loading && <LinearProgress />}
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}