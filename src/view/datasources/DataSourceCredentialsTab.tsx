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

interface DataSourceDescriptionProps {
  schema: any;
  register: any;
  errors: any;
}

export function DataSourceCredentialsTab(props: DataSourceDescriptionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [tables, setTables] = useState([
    { name: 'Empresas', type: 'CSV' },
    { name: 'Empregados', type: 'BDR' },
  ]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item sm={6}>
          <FormControl fullWidth>
            <FormLabel htmlFor="title">URL de Conexão</FormLabel>
            <TextField
              variant="outlined"
              placeholder="Ex: REDESIM"
              size="small"
              {...props.register('connection_url')}
            />
            <p>{props.errors.connection_url?.message}</p>
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl fullWidth>
            <FormLabel htmlFor="creator">Nome de Usuário</FormLabel>
            <TextField
              variant="outlined"
              placeholder="Ex: public"
              // required
              size="small"
              {...props.register("username")}
            />
            <p>{props.errors.username?.message}</p>
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl fullWidth>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <TextField
              variant="outlined"
              placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
              size="small"
              {...props.register('password')}
            />
            <p>{props.errors.password?.message}</p>
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl fullWidth>
            <FormLabel htmlFor="jdbc_driver">Driver JDBC</FormLabel>
            <TextField
              variant="outlined"
              placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
              size="small"
              {...props.register('jdbc_driver')}
            />
            <p>{props.errors.jdbc_driver?.message}</p>
          </FormControl>
        </Grid>
      </Grid>
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