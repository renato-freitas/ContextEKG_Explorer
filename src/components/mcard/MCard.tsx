import React from "react";
import { Card, CardContent, Grid } from "@mui/material";
import styles from "MCard.modules.css";
import { CardContainer, CardGridItem } from "./MCard.styles";

interface MCardProps {
  elevation?: number
  children: React.ReactNode;
}

export function MCard(props: MCardProps) {
  return (
    <CardContainer elevation={props.elevation}>
      <CardContent>
        <CardGridItem container>
          {props.children}
        </CardGridItem>
      </CardContent>
    </CardContainer>
  )
}