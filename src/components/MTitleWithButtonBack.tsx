import React from 'react'
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { useNavigate } from 'react-router-dom';
import { CaretCircleLeft } from "phosphor-react"

interface TitleProps {
  icon?: boolean;
  title: string;
}

export const TitleWithButtonBack = ({ icon, title }: TitleProps) => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {icon
        ? <Box
          display="flex"
          sx={{ '&:hover': { color: '#ddaa00' }, cursor: "pointer" }}
        >
          <CaretCircleLeft
            size={35}
            onClick={() => navigate(-1)}
          />
        </Box>
        : false}
      <h1>{title}</h1>
    </Stack>
  )
}