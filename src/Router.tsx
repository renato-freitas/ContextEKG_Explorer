import { Routes, Route, Link } from "react-router-dom";
import { MainLayout } from './layout/MainLayout';
import { Home } from './view/home/Home';
import { About } from './view/About';
import { MetagraphList } from './view/mokg/MetagraphList';
import { MetagraphForm } from './view/mokg/MetagraphForm';
import { OrganizationList } from './view/organizations/OrganizationList';
import { OrganizationForm } from './view/organizations/OrganizationForm';
import { OrganizationDoc } from './view/organizations/OrganizationDoc';



import { Persons } from './view/persons/Persons';
// import { DataSourceList } from './view/datasources/DataSourceList';
// import { DataSourceForm } from './view/datasources/DataSourceForm';
import { NewDataSourceForm } from './view/datasources/NewDataSourceForm';

import { DataSourceList } from './view/organizations/datasources/DataSourceList';
import { DataSourceForm } from './view/organizations/datasources/DataSourceForm';


import { NewTableList } from './view/datasources/tables/NewTableList';
import { TableForm } from './view/datasources/tables/TableForm';
import { ColumnList } from './view/datasources/columns/ColumnList';
import { ColumnForm } from './view/datasources/columns/ColumnForm';

import { Topics } from './view/topics/Topics';

import { ManageMetagraph } from './view/manage/ManageMetagraph';
import { MetaDataSources } from './view/manage/datasources/MetaDataSources';

import { SemanticView } from './view/semantic-view/SemanticView';
import { LocalGraphForm } from './view/local-graph/LocalGraphForm';
import { LocalGraphList } from './view/local-graph/LocalGraphList';


import { ROUTES } from './commons/constants';

// https://blog.devgenius.io/implementing-react-router-v6-with-code-splitting-in-a-react-typescript-project-14d98e2cab79


export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.METAGRAPHS} element={<MetagraphList />} />
        <Route path={ROUTES.METAGRAPHS_FORM} element={<MetagraphForm />} />
        <Route path={ROUTES.TOPICS} element={<Topics />} />
        <Route path={ROUTES.ORGANIZATION_LIST} element={<OrganizationList />} />
        <Route path={ROUTES.ORGANIZATION_FORM} element={<OrganizationForm />} />
        <Route path={ROUTES.ORGANIZATION_DOC} element={<OrganizationDoc />} />

        <Route path={ROUTES.PERSONS} element={<Persons />} />
        
        <Route path={ROUTES.DATASOURCE_LIST} element={<DataSourceList />} />
        <Route path={ROUTES.DATASOURCE_FORM} element={<DataSourceForm />} />

        <Route path={ROUTES.TABLE_LIST} element={<NewTableList />} />
        <Route path={ROUTES.TABLE_FORM} element={<TableForm />} />
        <Route path={ROUTES.COLUMN_LIST} element={<ColumnList />} />
        <Route path={ROUTES.COLUMN_FORM} element={<ColumnForm />} />
        {/* Build Metadata */}
        <Route path={ROUTES.MANAGE_METAGRAPH} element={<ManageMetagraph />} />
        <Route path={ROUTES.MANAGE_META_DATASOURCES} element={<MetaDataSources />} />
        <Route path={ROUTES.SEMANTIC_VIEW} element={<SemanticView />} />
        <Route path={ROUTES.LOCAL_GRAPH_FORM} element={<LocalGraphForm />} />
        <Route path={ROUTES.LOCAL_GRAPH_LIST} element={<LocalGraphList />} />
      </Route>

      {/* Para um painel de administração eu posso ter um layout diferente 
      <Route path='/admin' element={<AdminLayout />}>
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/report" element={<Reports />} />
      </Route>
      */}
    </Routes>
  )
}



