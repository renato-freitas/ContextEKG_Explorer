import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler, UseFormProps } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Columns, Table } from "phosphor-react";

const TabularForm = () => <Grid container spacing={2}>
  <Grid item sm={6}>
    <FormControl fullWidth>
      <FormLabel htmlFor="title">Nome da Tabela/CSV</FormLabel>
      <TextField
        variant="outlined"
        placeholder="Ex: REDESIM"
        size="small"
      // {...props.register('title')}
      />
      {/* <p>{props.errors.title?.message}</p> */}
    </FormControl>
  </Grid>
  <Grid item sm={6}>
    <FormControl fullWidth>
      <FormLabel htmlFor="creator">Nome do Schema</FormLabel>
      <TextField
        variant="outlined"
        placeholder="Ex: public"
        // required
        size="small"
      // {...props.register("creator")}
      />
      {/* <p>{props.errors.creator?.message}</p> */}
    </FormControl>
  </Grid>
  <Grid item sm={12}>
    <FormControl fullWidth>
      <FormLabel htmlFor="comment">Descrição</FormLabel>
      <TextField
        variant="outlined"
        placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
        size="small"
      // {...props.register('comment')}
      />
    </FormControl>
  </Grid>
</Grid>


export function DataSourceCredentialsTab() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tables, setTables] = useState([
    { name: 'Empresas', type: 'CSV' },
    { name: 'Empregados', type: 'BDR' },
  ]);

  return (
    <div>
      {/* Botões */}
      <Grid item sm={12} >
        <Box display="flex" justifyContent="flex-start">
          <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
            <Button type="submit" color="primary" variant="contained">
              Salvar
            </Button>
            <Button color="secondary" variant="contained" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
          </Stack>
        </Box>
      </Grid >
    </div>
  );
}