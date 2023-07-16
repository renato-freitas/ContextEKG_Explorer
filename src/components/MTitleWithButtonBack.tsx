import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useNavigate } from 'react-router-dom';
import { CaretCircleLeft } from "phosphor-react"

interface TitleProps {
  title: string;
  hasButtonBack?: boolean;
  buttonLabel?: string | null | undefined;
  chip?: React.ReactElement
  openForm?: () => void
}

export const TitleWithButtonBack = ({ hasButtonBack, title, buttonLabel, chip, openForm }: TitleProps) => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" alignItems="center" spacing={1} margin={1}>
      {hasButtonBack
        ? <Box
          display="flex"
          sx={{ '&:hover': { color: '#ddaa00' }, cursor: "pointer" }}
        >
          <CaretCircleLeft
            size={35}
            onClick={() => navigate(-1)}
          />
        </Box>
        : false
      }
      <h2>{title}</h2>
      {
        !buttonLabel
          ? false
          : <>
            <TextField id="outlined-basic" label="Pesquisar" variant="outlined" size="small" sx={{ width: 400 }} />
            <Button variant="contained" onClick={openForm}>{buttonLabel}</Button>
          </>
      }
      {
        chip && chip
      }
    </Stack>
  )
}