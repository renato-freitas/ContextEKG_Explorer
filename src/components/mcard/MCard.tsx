import React from "react";
import { Card, CardContent, Grid } from "@mui/material";
import styles from "MCard.modules.css";
import { CardContainer, CardGridItem } from "./MCard.styles";

interface MCardProps {
  children: React.ReactNode;
}

export function MCard(props: MCardProps) {
  return (
    <CardContainer>
      <CardContent>
        <CardGridItem container>
          {props.children}
        </CardGridItem>
      </CardContent>
    </CardContainer>
  )
}