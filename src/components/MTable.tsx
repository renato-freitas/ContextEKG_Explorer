import {
  Card, CardContent,
  Typography,
  Box,
  TableHead, Table, TableBody, TableCell, TablePagination, TableRow, TableFooter, TableContainer, Paper
} from '@mui/material';
import { TablePaginationActions } from '../commons/pagination';

type typeAlignOfCell = "right" | "left" | "inherit" | "center" | "justify" | undefined

export function MTable(props: any) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table
        stickyHeader={false}
        aria-label={"sticky table"}
        sx={{ whiteSpace: 'nowrap', minWidth: 650 }}
      >
        <TableHead>
          <TableRow>
            {props.header.map((column: [string, typeAlignOfCell]) =>
              <TableCell key={column[0]} align={column[1]}>
                <Typography component={'span'} variant="body1" fontWeight="600">{column[0]}</Typography>
              </TableCell>
            )}
            {
              props.hasActions === undefined &&
              <TableCell key={'Ações'} align='center'>
                <Typography component={'span'} variant="body1" fontWeight="600">Ações</Typography>
              </TableCell>
            }
          </TableRow>
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'Todas', value: -1 }]}
              colSpan={props.header.lenght}
              count={props.size}
              rowsPerPage={props.rowsPerPage}
              page={props.page}
              // SelectProps={{
              //   inputprops: {
              //     'aria-label': 'Linhas por página',
              //   },
              //   native: false,
              // }}
              onPageChange={props.handleChangePage}
              onRowsPerPageChange={props.handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}