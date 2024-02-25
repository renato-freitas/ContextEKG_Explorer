import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, SelectChangeEvent, styled } from "@mui/material"
import { ResourceModel } from "../models/ResourceModel"
import { useEffect, useState } from "react"
import { getContextFromURI, printt } from "../commons/utils"
import { RDF_Node } from "../models/RDF_Node"
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { ContextsDialog } from "./MDialog"
import { PropertyObjectEntity } from "../models/PropertyObjectEntity"

interface ContextProps {
  selectedResource: ResourceModel;
  properties?: {};
  selectedContext: PropertyObjectEntity;
  getSelectedContext: React.Dispatch<React.SetStateAction<PropertyObjectEntity>>;
  openForm?: () => void
}

export const MenuContext = (props: ContextProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resources, setResources] = useState<ResourceModel[]>([] as ResourceModel[])
  const [contextos, setContextos] = useState<{ p: RDF_Node, o: RDF_Node, label: RDF_Node, same?: RDF_Node }[]>([])

  const [selectedContext, setSelectedContext] = useState<PropertyObjectEntity>({} as PropertyObjectEntity);
  const [open, setOpen] = useState(false);
  const emails = ['username@gmail.com', 'user02@gmail.com'];
  const [selectedValue, setSelectedValue] = useState<PropertyObjectEntity>();

  useEffect(() => {
    // Na primeira vez, o contexto vem do recurso selecionando
    // if (props.selectedResource) {
      setSelectedContext({
        p: { type: 'uri', value: 'http://www.w3.org/2002/07/owl#sameAs' },
        o: { type: 'uri', value: props.selectedResource?.uri?.value },
        label: { type: '', value: '' }
      })
      setSelectedValue({
        p: { type: 'uri', value: 'http://www.w3.org/2002/07/owl#sameAs' },
        o: { type: 'uri', value: props.selectedResource?.uri?.value },
        label: { type: '', value: '' }
      })
    // }
  }, [])

  useEffect(() => {
    // Na primeira vez, o contexto vem do recurso selecionando
    // if (props.selectedResource) {
      setSelectedValue({
        p: { type: 'uri', value: 'http://www.w3.org/2002/07/owl#sameAs' },
        o: { type: 'uri', value: selectedValue?.o?.value },
        label: { type: '', value: '' }
      })
    // }
  }, [selectedValue])

  useEffect(() => {
    // console.log(`4. RECURSO SELECIONADO (menu de contexto)`, props.selectedResource)
    setContextos([])
    async function buildItemsSameAs(properties: any) {
      Object.keys(properties).filter((row, idx) => {
        properties[row].filter((el: any) => {
          if (el.p.value == "http://www.w3.org/2002/07/owl#sameAs") {
            setContextos(oldState => [...oldState, el])
          }
        })
      })
    }
    buildItemsSameAs(props.properties)
  }, [])


  const handleChange = (event: SelectChangeEvent<typeof selectedContext>) => {
    const {
      target: { value },
    } = event;
    printt(`6. valor selecionada`, value)
  };



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: PropertyObjectEntity) => {
    setOpen(false);
    setSelectedValue(value);
    props.getSelectedContext(value)
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1} margin={1}>
      <Grid container>
        <Grid item>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            {
              props.selectedContext?.label?.value == "Visão Unificada"
                ? <Chip label="Contexto: Visão Unificada" color="primary" />
                : props.selectedContext?.label?.value == "Visão Higienizada"
                  ? <Chip label="Contexto: Visão Higienizada" color="primary" />
                  : <Chip label={`Contexto: ${getContextFromURI(selectedValue?.o?.value)}`} color="primary" />
            }
            <Button variant="outlined" onClick={handleClickOpen}>
              Mudar Contexto
            </Button>

            <ContextsDialog
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              contexts={contextos}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}