import React, { useState } from 'react';
import {
  Typography,
  TableHead, Table, TableBody, TableCell, TablePagination, TableRow, TableFooter, TableContainer, Paper,
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { TablePaginationActions } from '../commons/pagination';
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../redux/store'

type typeAlignOfCell = "right" | "left" | "inherit" | "center" | "justify" | undefined

interface MTable {
  header: Array<[string, typeAlignOfCell]>;
  headerBackColor?: string;
  hasActions?: boolean;
  alignActions?: typeAlignOfCell;
  loading?: boolean;
  size: number,
  rowsPerPage: number;
  page: number;
  children: React.ReactNode;
  noFooter?: boolean;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

let widthOfBody = document.body.clientWidth;
const PAINEL_LEFT_SIZE = widthOfBody * 0.2

export function MTable(props: MTable) {
	const global_context = useSelector((state: RootState) => state.globalContext)
  const [page, setPage] = useState(0);
  const estaEmPortugues = global_context.language == 'pt'
  

  return (
    <TableContainer component={Paper}>
      <Table
        stickyHeader={false}
        aria-label={"sticky table"}
        sx={{ whiteSpace: 'nowrap', minWidth: PAINEL_LEFT_SIZE }}
        size='small'
      >
        <TableHead>
          <TableRow sx={{background: props.headerBackColor}}>
            {props.header.map((column: [string, typeAlignOfCell]) =>
              <TableCell key={column[0]} align={column[1]}>
                <Typography component={'p'} variant="caption" fontWeight="800">{column[0]}</Typography>
              </TableCell>
            )}
            {
              props.hasActions &&
              <TableCell key={'Ações'} align={props.alignActions ? props.alignActions : 'center'}>
                <Typography component={'p'} variant="caption" fontWeight="800">{global_context.language == 'pt' ? "Ações" : "Actions"}</Typography>
              </TableCell>
            }
          </TableRow>
          {props.loading && <LinearProgress />}
        </TableHead>
        <TableBody>
          {props.size ? props.children :
            <TableRow>
              <TableCell align="center" colSpan={(props.header.length + 1)}>
                {estaEmPortugues ? "Nenhum dado para mostrar" : "No data to show"}
              </TableCell>
            </TableRow>
          }
        </TableBody>
        {
          props.noFooter ? false : <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[6, 12, 24, 48, { label: 'Todas', value: -1 }]}
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
                labelRowsPerPage={global_context.language == 'pt' ? "Linhas por Página" : "Rows per Page"}
                onPageChange={props.handleChangePage}
                onRowsPerPageChange={props.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        }
      </Table>
    </TableContainer>
  )
}