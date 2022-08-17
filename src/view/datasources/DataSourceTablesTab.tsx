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
import { Columns, Table } from "phosphor-react";
import { updateMetadataGraph } from "../../services/sparql-metagraph";
import { TableForm } from "./tables/TableForm";
import { TableEntity } from "../../models/TableEntity";
import { MDialog } from '../../components/MDialog';

interface ITableForm {
  // identifier: string;
  // uri: string;
  name: string;
  // comment: string;
  // creator: string;
  // created: string;
  // modified: string;
}

interface DataSourceProps {
  schema: any;
  register: any;
  errors: any;
  tables: any,
  setTables: any
  tableNames: string[],
  setTableNames: React.Dispatch<React.SetStateAction<string[]>>
}

interface TableProps {
  name: string;
  // identifier: string;
  // type: string;
}

export function DataSourceTablesTab(props: DataSourceProps, tableProps: TableProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [localTables, setLocalTables] = useState<TableProps[]>([{ name: "renato" }]);
  const [myTables, setMyTables] = useState<string[]>(["table 01"]);
  const [count, setCount] = useState<number>(0);

  const [keepExpanded, setKeepExpanded] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedTable, setSelectedTable] = useState<ITableForm>({
    // identifier: '',
    // uri: '',
    name: '',
    // comment: '',
    // creator: '',
    // created: '',
    // modified: '',
  });


  const [openDialog, setOpenDialog] = useState(false);
  // const [showTableForm, setShowTableForm] = useState(false);
  // const handleShowTableForm = () => {
  //   console.log("*** Clicando para abrir o formulári de tabela ***")
  //   setShowTableForm(true);
  // }
  // const handleCloseTableForm = () => {
  //   console.log("*** Clicando para fechar o formulári de tabela ***")
  //   setShowTableForm(false);
  // }

  const handleOpenMDailog = () => {
    console.log("*** Clicando para abrir o diálog FormTable ***")
    setOpenDialog(true);
  }
  const handleCloseMDialog = () => {
    console.log("*** Clicando para fechar o diálog FormTable ***")
    setOpenDialog(false);
  }


  return (
    <div>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item gap={2} sm={12} justifyContent="flex-end" display="flex">
          {/* <Button variant="contained" onClick={handleShowTableForm}>+ Nova Tabela</Button> */}
          <Button variant="contained" color="secondary" onClick={handleOpenMDailog}>+ Nova Tabela Modal</Button>
        </Grid>
      </Grid>


      <TableForm //Dialog
        // open={openDialog}
        // onClose={handleCloseMDialog}
        // tables={myTables}
        // setLocalTables={setMyTables}
        // count={count}
        // setCount={setCount}
        // tables={props.tableNames}
        // setLocalTables={props.setTableNames}
      />

      {/* <List>
        {props.tableNames.map((ele, idx) => <ListItem key={idx}>{ele}</ListItem>)}
      </List> */}
      {
        props.tableNames.map((ele, idx) => <Accordion key={idx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{ele}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>Nome | string</ListItem>
            </List>
            <Button variant="text" color="error">Remover</Button>
            <Button variant="text">Add Coluna</Button>
          </AccordionDetails>
        </Accordion>
        )}

      {/* {`Contagem: ${count}`} */}
    </div>
  );
}









{/* {localTables.map((table: TableProps) => <Accordion
        key={table.identifier}
        onChange={(event, expanded) => {
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Table size={24} />
            <Typography variant="h6">{table.name}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
        </AccordionDetails>
      </Accordion>)} */}