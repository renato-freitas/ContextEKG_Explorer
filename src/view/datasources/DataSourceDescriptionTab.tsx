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
import { InputLabel, MenuItem, Select } from "@mui/material";
import { DATASOURCE_TYPES, VSKG } from "../../commons/constants";

interface DataSourceDescriptionProps {
  schema: any;
  register: any;
  control: any;
  errors: any;
}





export function DataSourceDescriptionTab(props: DataSourceDescriptionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <FormControl fullWidth>
          <FormLabel htmlFor="label">Rótulo</FormLabel>
          <TextField
            variant="outlined"
            placeholder="Ex: REDESIM"
            size="small"
            {...props.register('label')}
          />
          <p>{props.errors.label?.message}</p>
        </FormControl>
      </Grid>
      <Grid item sm={6}>
        <FormControl fullWidth size="small">
          <FormLabel htmlFor="type">Tipo da Fonte de Dados</FormLabel>
          <Controller
            name="type"
            defaultValue={""}
            control={props.control}
            render={({ field }) => <Select
              {...field}
            >
              {Object.entries(DATASOURCE_TYPES).map(([k, v]) => <MenuItem value={v}>{k}</MenuItem>)}
            </Select>
            }
          />
        </FormControl>
      </Grid>
      <Grid item sm={12}>
        <FormControl fullWidth>
          <FormLabel htmlFor="description">Descrição</FormLabel>
          <TextField
            variant="outlined"
            placeholder="Ex: Metadados que descrevem o KG do MDCC ..."
            size="small"
            {...props.register('description')}
          />
        </FormControl>
      </Grid>
      {/* <Grid item sm={12}>
        <FormControl fullWidth>
          <FormLabel htmlFor="page">Página Web sobre a Fonte de Dados</FormLabel>
          <TextField
            variant="outlined"
            placeholder="Ex: http://www.exemplo.com"
            size="small"
            {...props.register('page')}
          />
        </FormControl>
      </Grid> */}

    </Grid>
  );
}