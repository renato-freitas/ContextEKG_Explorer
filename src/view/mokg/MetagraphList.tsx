import React, { useEffect, useState } from "react"
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import Construction from '@mui/icons-material/Construction';
import DeleteForever from '@mui/icons-material/DeleteForever';

import { useNavigate } from 'react-router-dom';

import styles from './ListMokg.module.css';
import { findAllMetadataGraphs, remove } from '../../services/sparql-metagraph';
import { ROUTES } from '../../commons/constants';
import { Typography } from "@mui/material";



interface ElementOfRdfClass {
  value: string,
  type: string
}

interface IMetagraph {
  uri: ElementOfRdfClass;
  identifier: ElementOfRdfClass;
  title: ElementOfRdfClass;
  creator: ElementOfRdfClass;
  created: ElementOfRdfClass;
  modified: ElementOfRdfClass;
}

export function MetagraphList() {
  const navigate = useNavigate();

  const [metagraphs, setMetagraphs] = useState<IMetagraph[]>([] as IMetagraph[]);
  async function loadMetagraphs() {
    const response = await findAllMetadataGraphs();
    setMetagraphs(response)
  }
  useEffect(() => {
    console.log("\n *** Carregando os Grafos de Metadados ***\n")
    loadMetagraphs();
  }, [])

  const openForm = () => {
    console.log("*** call: Abrir formulário de Metadados de GC ***")
    navigate(ROUTES.METAGRAPHS_FORM);
  }

  const handleRemove = async (identifier: string) => {
    await remove(identifier);
    loadMetagraphs();
  }


  interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - metagraphs.length) : 0;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={styles.listkg}>

      <h1>Grafos de Metadados</h1>
      <Grid container spacing={2}>
        <Grid item sm={12} justifyContent="flex-end" display="flex">
          <Button variant="contained" onClick={openForm}>+ Novo Grafo de Metadados</Button>
        </Grid>
        <Grid item sm={12} justifyContent="flex-end" display="flex">
          <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 500 }} />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table
          stickyHeader={false}
          aria-label={"sticky table"}
          sx={{ whiteSpace: 'nowrap', minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Criador por</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell>Atualizado em</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metagraphs.map((row) => (
              <TableRow
                key={row.identifier.value}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => navigate(ROUTES.METAGRAPHS_FORM, { state: row })}>
                      <EditTwoTone />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Construir">
                    <IconButton onClick={() => navigate(ROUTES.MANAGE_METAGRAPH, { state: row })}>
                      <Construction />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton onClick={() => handleRemove(row.identifier.value)}>
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography>{row.title.value}</Typography>
                    <Typography variant="caption" display="block" gutterBottom>{row.identifier.value}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.creator?.value}</TableCell>
                <TableCell>
                  <Stack>
                    <Typography>{new Date(row.created.value).toLocaleDateString()}</Typography>
                    <Typography variant="caption" display="block" gutterBottom>{new Date(row.created.value).toLocaleTimeString()}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography>{new Date(row.modified.value).toLocaleDateString()}</Typography>
                    <Typography variant="caption" display="block" gutterBottom>{new Date(row.modified.value).toLocaleTimeString()}</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={metagraphs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  )
}