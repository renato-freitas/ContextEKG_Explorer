import React from "react";
import { CardContent } from "@mui/material";
import { CardContainer, CardGridItem } from "./MCard.styles";

interface MCardProps {
  elevation?: number
  bgcolor?: string
  children: React.ReactNode;
}

export function MCard(props: MCardProps) {
  return (
    <CardContainer elevation={props.elevation} sx={{ bgcolor: props.bgcolor }}>
      <CardContent>
        <CardGridItem container>
          {props.children}
        </CardGridItem>
      </CardContent>
    </CardContainer>
  )
}