import { ROUTES, USER_TYPE } from '../commons/constants';
import { Horse, Person, Cube, Graph, Database, Storefront, PuzzlePiece, NavigationArrow } from "phosphor-react";

export const menuEvolve = [
  {
    title: `MetaEKG`,
    icon: Graph,
    href: ROUTES.METAGRAPHS,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: `MetaMashup`,
    icon: Graph,
    href: ROUTES.META_MASHUP_LIST,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Navegação',
    icon: NavigationArrow,
    href: ROUTES.NAVIGATION,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Fonte de Dados',
    icon: Database,
    href: ROUTES.DATASOURCE_LIST,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Organizações',
    icon: Storefront,
    href: ROUTES.ORGANIZATION_LIST,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Pessoas',
    icon: Person,
    href: ROUTES.PERSONS,
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