import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler, UseFormProps } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { v4 as uuidv4 } from 'uuid';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
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
import { CaretCircleLeft, Columns, Table } from "phosphor-react";
import styles from '../DataSource.module.css';
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export function NewTableList() {
  const navigate = useNavigate();
  return (
    <div className={styles.listkg}>
      <h1>
        <CaretCircleLeft onClick={() => navigate(-1)} />
        Tabelas</h1>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          {/* <Button variant="contained" onClick={handleShowTableForm}>+ Nova Tabela</Button> */}
          <Button variant="contained" color="secondary" onClick={() => { }}>+ Nova Tabela</Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item>
          <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItemButton
                // selected={selectedIndex === 0}
                // onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon>
                  <Table size={22} />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItemButton>
              <ListItemButton
                // selected={selectedIndex === 1}
                // onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemIcon>
                  <Table size={22} />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItemButton>
            </List>
          </Box>
        </Grid>
      </Grid>



      {
        ["renato", "Eliene"].map((ele, idx) => <Accordion key={idx} sx={{ width: 300 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Stack direction={"row"} spacing={1}>
              <Table size={22} />
              <Typography>{ele}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Button variant="text" color="error">Remover</Button>
            <Button variant="text">Add Coluna</Button>
          </AccordionDetails>
        </Accordion>
        )}

      {/* {`Contagem: ${count}`} */}
    </div>
  );
}