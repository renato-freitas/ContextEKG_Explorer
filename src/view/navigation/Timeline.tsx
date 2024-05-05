import { useState, useEffect, useContext, ChangeEvent, KeyboardEvent, Key } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Eye } from "phosphor-react";
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

import { MHeader } from "../../components/MHeader";
import { MTable } from "../../components/MTable";

import { api } from "../../services/api";
import { ResourceModel } from "../../models/ResourceModel";
import { ClassModel } from "../../models/ClassModel";

import { LoadingContext, ClassRDFContext } from "../../App";
import { double_encode_uri, getContextFromURI, getDateFromInstantTimelin, getPropertyFromURI, printt } from "../../commons/utils";
import { COLORS, NUMBERS, ROUTES } from "../../commons/constants";

import styles from './navigation.module.css';


interface TimelineProps {
  // children: React.ReactNode;
  instants: any;
}

export function TimelineView(props: TimelineProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { contextClassRDF, setContextClassRDF } = useContext(ClassRDFContext);
  const [page, setPage] = useState(0);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedClassRDF, setSelectedClassRDF] = useState<ClassModel>();
  const [selectedResource, setSelectedResource] = useState<ResourceModel>();
  const [resources, setResources] = useState<ResourceModel[]>([]);
  const [labelToSearch, setLabelToSearch] = useState<string>("");
  const [runingSearch, setRuningSearch] = useState<boolean>(false);
  const [totalOfResources, setTotalOfResources] = useState<number>(0);




  return (
    <div>
      <MHeader
        title={`Linha do Tempo do recurso`}
      />

      {/* {
        Object.keys(props.instants).map((instant: any, idx: Key) => {
          return <Paper elevation={3} sx={{ minHeight: 300, justifyContent: "space-between" }}>
            {
              props.instants[instant].map((_prop: any) => <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "start" }} color="text.primary" gutterBottom>
                {_prop.p.value.includes("http://") ? getPropertyFromURI(_prop.p.value) : _prop.p.value}
              </Typography>
              )
            }
          </Paper>
        })
      } */}

      <Timeline position="alternate" >
        {
          Object.keys(props.instants).map((instant: any, idx: Key) => {
            return <TimelineItem>
              {/* <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                variant="body2"
                color="text.secondary"
              >
                10:00 am
              </TimelineOppositeContent> */}
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary">
                  <LaptopMacIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="h6" component="span">
                  {getDateFromInstantTimelin(instant)}
                  {/* {instant} */}
                </Typography>
                {props.instants[instant].map((update: any) => {
                  return <Stack direction={"column"}>
                    <Typography variant="caption" component="div" color="gray">{update.property.value}</Typography>
                    <Stack direction={"row"} alignItems={'center'} spacing={1}>
                      <Typography paddingLeft={2} color={'secondary'} variant="caption">{update.va.value}</Typography>
                      <span>&rarr;</span>
                      <Typography color="primary" variant="caption">{update.vn.value}</Typography>
                    </Stack>
                  </Stack>
                })}
              </TimelineContent>
            </TimelineItem>
          })
        }
      </Timeline>

      {/* <Timeline position="alternate">
        <TimelineItem>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Eat
            </Typography>
            <Typography>Because you need strength</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            variant="body2"
            color="text.secondary"
          >
            10:00 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary">
              <LaptopMacIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Code
            </Typography>
            <Typography>Because it&apos;s awesome!</Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline> */}

    </div >
  )
}