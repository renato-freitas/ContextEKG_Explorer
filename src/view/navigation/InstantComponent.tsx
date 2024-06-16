import { useState, useEffect, useContext, Key, ReactComponentElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { Asterisk, ClockCounterClockwise, Link as LinkIcon } from 'phosphor-react';
import { LinkSimpleBreak, Graph, ArrowRight } from '@phosphor-icons/react';

import { MHeader } from "../../components/MHeader";

import { ResourceModel } from "../../models/ResourceModel";
import { ClassModel } from "../../models/ClassModel";

import { LoadingContext, ClassRDFContext } from "../../App";
import { getContextFromURI, getDateFromInstantTimelin, getPropertyFromURI } from "../../commons/utils";

import stylesGlobal from '../../styles/global.module.css';
import { COLORS, NUMBERS, ROUTES } from "../../commons/constants";
import { api } from "../../services/api";
import { stateProps } from "./Properties";
import { Chip } from "@mui/material";

interface InstantComponentProps {
  instant: string
}

export function InstantComponent(props: InstantComponentProps) {
  function getDateFromInstantTimelin(instantURI: string): any {
    if (instantURI) {
      let lastToken1 = instantURI?.split("/Instant/")[1]
      /** NÃO PODE USAR SPLIT("-") no inicio. TEM ID QUE USA "-" */
      const splitComAno = lastToken1.split('T')[0].split("-")
      const splitComHora = lastToken1.split('T')[1]
      const _d = splitComAno[splitComAno.length - 1]
      const _m = splitComAno[splitComAno.length - 2]
      const _y = splitComAno[splitComAno.length - 3]
      let data = `${_y}-${_m}-${_d}`
      const hora = decodeURIComponent("T" + splitComHora)
      const asDate = new Date(data + hora)
      return <><Typography variant="h6" component="span" >
        {asDate.toLocaleDateString("pt-BR") + " "}
      </Typography >
        <Typography variant="body2" component="span" >
          {asDate.toLocaleTimeString()}
        </Typography >
      </>
    }
    return "";
  }
  return (
    getDateFromInstantTimelin(props.instant)
  )
}