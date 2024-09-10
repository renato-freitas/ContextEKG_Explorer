import { ROUTES, USER_TYPE } from '../commons/constants';
import { GearSix} from "phosphor-react";
import { Quotes } from '@phosphor-icons/react';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';


export const menuEvolve = [
  {
    title: { 'pt': 'Exploração', 'en': 'Exploration' },
    icon: ManageSearchRoundedIcon,
    href: [ROUTES.CLASSES, ROUTES.RESOURCES, ROUTES.PROPERTIES],
    type: [USER_TYPE.ADMIN]
  }
];

export const menuConsuming = [
  {
    title: { 'pt': 'Questões de Competência', 'en': 'Competence Questions' },
    icon: Quotes,
    href: ROUTES.COMPETENCE_QUESTIONS_LIST,
    type: [USER_TYPE.ADMIN]
  }
];

export const menuConfig = [
  {
    title: { 'pt': 'Configurações', 'en': 'Configurations' },
    icon: GearSix,
    href: ROUTES.ENDPOINT_CONFIG,
    type: [USER_TYPE.ADMIN]
  }
]