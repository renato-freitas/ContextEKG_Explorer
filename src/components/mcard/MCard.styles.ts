import styled from 'styled-components';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid';

export const CardContainer = styled(Card)`
  transition: background 0.2s !important;
`
export const CardGridItem = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 10px;
`