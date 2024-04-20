import React, { useState } from 'react';
import {
  Typography,
  TableHead, Table, TableBody, TableCell, TablePagination, TableRow, TableFooter, TableContainer, Paper,
  IconButton,
  TextField,
  Stack,
  Pagination,
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { TablePaginationActions } from '../commons/pagination';
import { CaretLeft, CaretRight } from 'phosphor-react';

type typeAlignOfCell = "right" | "left" | "inherit" | "center" | "justify" | undefined

interface MTable {
  header: Array<[string, typeAlignOfCell]>;
  hasActions?: boolean;
  alignActions?: typeAlignOfCell;
  loading?: boolean;
  size: number,
  rowsPerPage: number;
  page: number;
  children: React.ReactNode;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

let widthOfBody = document.body.clientWidth;
// const PAINEL_LEFT_SIZE = window.screen.width * 0.2
const PAINEL_LEFT_SIZE = widthOfBody * 0.2
// const element = document.getElementById("body");
// console.log("Width: " + element?.offsetWidth + "px"); 

export function MTable(props: MTable) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); console.log(value)
  };

  return (
    <TableContainer component={Paper}>
      <Table
        stickyHeader={false}
        aria-label={"sticky table"}
        sx={{ whiteSpace: 'nowrap', minWidth: PAINEL_LEFT_SIZE }}
      >
        <TableHead>
          <TableRow>
            {props.header.map((column: [string, typeAlignOfCell]) =>
              <TableCell key={column[0]} align={column[1]}>
                <Typography component={'p'} variant="caption" fontWeight="800">{column[0]}</Typography>
              </TableCell>
            )}
            {
              props.hasActions &&
              <TableCell key={'Ações'} align={props.alignActions ? props.alignActions : 'center'}>
                <Typography component={'p'} variant="caption" fontWeight="800">Ações</Typography>
              </TableCell>
            }
          </TableRow>
          {props.loading && <LinearProgress />}
        </TableHead>
        <TableBody>
          {props.size ? props.children :
            <TableRow>
              <TableCell align="center" colSpan={(props.header.length + 1)}>
                Nenhum dado para mostrar
              </TableCell>
            </TableRow>
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            {/* <TableCell align="ri" colSpan={(props.header.length + 1)}> */}
            {/* <TableCell align='right'> */}
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, { label: 'Todas', value: -1 }]}
                colSpan={props.hasActions ? props.header.length + 1 : props.header.length}
                count={props.size}
                rowsPerPage={props.rowsPerPage}
                page={props.page ? props.page : page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "oxi"
                  },
                  native: false,
                }}
                labelRowsPerPage="Linhas por Página"
                onPageChange={props.handleChangePage}
                onRowsPerPageChange={props.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            {/* </TableCell> */}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}