import { useEffect, useState } from "react"
import axios from "axios"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import s from './ListKG.module.css';
import { PREFIXIES_SPARQL } from '../../commons/constants';

interface ElementOfRdfClass {
  value: string,
  type: string
}

interface IRdfClasses {
  s: ElementOfRdfClass
}


export function ListKG() {
  const [rdfClasses, setRdfClasses] = useState<IRdfClasses[]>([] as IRdfClasses[]);
  useEffect(() => {
    async function loadClasses() {
      try {
        let query = PREFIXIES_SPARQL.OWL
          + "SELECT * WHERE { ?s a owl:Class . } limit 3"

        console.log(query)

        const response = await axios({
          method: 'get',
          url: "http://localhost:7200/repositories/FamilaVieira",
          params: { query }
        })

        console.log(response.data.results.bindings)
        setRdfClasses(response.data.results.bindings)
      } catch (error) {
        console.log(error)
      }
    }
    loadClasses()
  }, [])

  return (
    <div className={s.listkg}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Lista de Classes do Grafo de Conhecimento</TableCell>
              {/* <TableCell align="right">Calories</TableCell> */}
              {/* <TableCell align="right">Fat&nbsp;(g)</TableCell> */}
              {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell> */}
              {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rdfClasses.map((row) => (
              <TableRow
                key={row.s.value}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.s.value}
                </TableCell>
                {/* <TableCell align="right">{row.calories}</TableCell> */}
                {/* <TableCell align="right">{row.fat}</TableCell> */}
                {/* <TableCell align="right">{row.carbs}</TableCell> */}
                {/* <TableCell align="right">{row.protein}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}