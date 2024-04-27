import { ROUTES, USER_TYPE } from '../commons/constants';
import { Binoculars, Person, Graph, Database, Storefront, PuzzlePiece, NavigationArrow, PaperPlaneTilt } from "phosphor-react";
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';

export const menuEvolve = [
  {
    title: `MetaEKG`,
    icon: Graph,
    href: [ROUTES.METAGRAPHS],
    type: [USER_TYPE.ADMIN]
  },
  {
    title: `MetaMashup`,
    icon: Graph,
    href: [ROUTES.META_MASHUP_LIST],
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Exploração',
    // icon: PaperPlaneTilt,
    icon: ManageSearchRoundedIcon,
    href: [ROUTES.NAVIGATION, ROUTES.RESOURCES, ROUTES.PROPERTIES],
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Fonte de Dados',
    icon: Database,
    href: [ROUTES.DATASOURCE_LIST],
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Organizações',
    icon: Storefront,
    href: [ROUTES.ORGANIZATION_LIST],
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Pessoas',
    icon: Person,
    href: [ROUTES.PERSONS],
    type: [USER_TYPE.ADMIN]
  },
  // {
  //   title: 'Fontes de Dados',
  //   icon: Database,
  //   href: ROUTES.DATASOURCE_LIST,
  //   type: [USER_TYPE.ADMIN]
  // }
];

export const menuConsuming = [
  {
    title: 'Consulta',
    icon: PuzzlePiece,
    href: ROUTES.HOME,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Visualização',
    icon: Graph,
    href: ROUTES.HOME,
    type: [USER_TYPE.ADMIN]
  },
];

export const menuConfig = [
  {
    title: 'Usuários',
    icon: Database,
    href: ROUTES.PERSONS,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Configuração',
    icon: PuzzlePiece,
    href: ROUTES.HOME,
    type: [USER_TYPE.ADMIN]
  }
]