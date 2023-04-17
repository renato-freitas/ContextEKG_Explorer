import { ROUTES, USER_TYPE } from '../commons/constants';
import { Horse, Person, Cube, Graph, Database, Storefront, PuzzlePiece } from "phosphor-react";

export const menuEvolve = [
  {
    title: `Grafo de Metadados`,
    icon: Graph,
    href: ROUTES.METAGRAPHS,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: `Mashups`,
    icon: Graph,
    href: ROUTES.MASHUP_LIST,
    type: [USER_TYPE.ADMIN]
  },
  {
    title: 'Tópicos',
    icon: Cube,
    href: ROUTES.TOPICS,
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