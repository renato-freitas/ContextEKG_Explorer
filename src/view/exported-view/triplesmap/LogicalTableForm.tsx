import { Box, Button, FormControl, FormLabel, Grid, Stack, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';

export const LogicalTableForm = () => {
  const navigate = useNavigate();
  return (<>
    <form>
      <Grid container spacing={2}>
        <Grid item sm={6}>
          <FormControl fullWidth>
            <FormLabel htmlFor="label">Nome da Tabela</FormLabel>
            <TextField
              variant="outlined"
              placeholder='Ex: "TB_DEPARTEMENT"'
              size="small"
            // {...register('label')}
            />
            {/* <p>{errors.label?.message}</p> */}
          </FormControl>
        </Grid>
        <Grid item sm={12}>
          <FormControl fullWidth>
            <FormLabel htmlFor="urlMappings">Consulta SQL</FormLabel>
            <TextField
              variant="outlined"
              placeholder='Ex: "SELECT * FROM TABLE"'
              size="small"
            // {...register('urlMappings')}
            />
            {/* <p>{errors.urlMappings?.message}</p> */}
          </FormControl>
        </Grid>

        {/* Botões */}
        <Grid item sm={12}>
          <Box display="flex" justifyContent="flex-start">
            <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
              <Button type="submit" color="primary" variant="contained">
                Salvar
              </Button>
              <Button color="secondary" variant="contained"
                onClick={() => navigate(-1)}>
                Cancelar
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>

    </form>
  </>
  );
}