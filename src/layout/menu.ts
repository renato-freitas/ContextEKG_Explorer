import { ROUTES, USER_TYPE } from '../commons/constants';
import { Binoculars, Person, Graph, Database, Storefront, PuzzlePiece, NavigationArrow, PaperPlaneTilt, Sparkle, BracketsCurly, GearSix } from "phosphor-react";
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import { Component } from 'react';

interface itemProps {
  title: {},
  icon: Component,
  href: string[],
  type: string[]
}

export const menuEvolve = [
  // {
  //   title: `MetaEKG`,
  //   icon: Graph,
  //   href: [ROUTES.METAGRAPHS],
  //   type: [USER_TYPE.ADMIN]
  // },
  // {
  //   title: `MetaMashup`,
  //   icon: Graph,
  //   href: [ROUTES.META_MASHUP_LIST],
  //   type: [USER_TYPE.ADMIN]
  // },
  {
    // title: 'Exploration',
    title: { 'pt': 'Exploração', 'en': 'Exploration' },
    // icon: PaperPlaneTilt,
    icon: ManageSearchRoundedIcon,
    href: [ROUTES.NAVIGATION, ROUTES.RESOURCES, ROUTES.PROPERTIES],
    type: [USER_TYPE.ADMIN]
  },
  {
    // title: 'Data Sources',
    title: { 'pt': 'Fonte de Dados', 'en': 'Data Sources' },
    icon: Database,
    href: [ROUTES.DATASOURCE_LIST],
    type: [USER_TYPE.ADMIN]
  },
  // {
  //   title: 'Organizações',
  //   icon: Storefront,
  //   href: [ROUTES.ORGANIZATION_LIST],
  //   type: [USER_TYPE.ADMIN]
  // },
  // {
  //   title: 'Pessoas',
  //   icon: Person,
  //   href: [ROUTES.PERSONS],
  //   type: [USER_TYPE.ADMIN]
  // },
  // {
  //   title: 'Fontes de Dados',
  //   icon: Database,
  //   href: ROUTES.DATASOURCE_LIST,
  //   type: [USER_TYPE.ADMIN]
  // }
];

export const menuConsuming = [
  {
    // title: 'Saved Queries',
    title: { 'pt': 'Consultas', 'en': 'Saved Queries' },
    icon: Sparkle,
    href: ROUTES.QUERY_SAVED,
    type: [USER_TYPE.ADMIN]
  },
  // {
  //   title: 'Visualização',
  //   icon: Graph,
  //   href: ROUTES.HOME,
  //   type: [USER_TYPE.ADMIN]
  // },
];

export const menuConfig = [
  // {
  //   title: 'Usuários',
  //   icon: Database,
  //   href: ROUTES.PERSONS,
  //   type: [USER_TYPE.ADMIN]
  // },
  {
    // title: 'Configurations',
    title: { 'pt': 'Configurações', 'en': 'Configurations' },
    icon: GearSix,
    href: ROUTES.ENDPOINT_CONFIG,
    type: [USER_TYPE.ADMIN]
  }
]