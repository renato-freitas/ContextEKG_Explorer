import { Routes, Route, Link } from "react-router-dom";
import { MainLayout } from './layout/MainLayout';
import { Home } from './view/home/Home';
import { About } from './view/About';
import { MetagraphList } from './view/ekg/Ekgs';
import { MetagraphForm } from './view/ekg/EkgForm';
import { OrganizationList } from './view/organizations/OrganizationList';
import { OrganizationForm } from './view/organizations/OrganizationForm';
import { OrganizationDoc } from './view/organizations/OrganizationDoc';


import { Persons } from './view/persons/Persons';
import { DataSourceForm } from './view/datasources/DataSourceForm';


import { DataSources } from './view/datasources/DataSources';
import { NewTableList } from './view/datasources/tables/NewTableList';
import { TableForm } from './view/datasources/tables/TableForm';
import { ColumnList } from './view/datasources/columns/ColumnList';
import { ColumnForm } from './view/datasources/columns/ColumnForm';

import { Topics } from './view/topics/Topics';

import { ManageMetagraph } from './view/ekg/manage/ManageMetagraph';
import { MetaDataSources } from './view/ekg/manage/datasources/MetaDataSources';

import { SemanticView } from './view/semantic-view/SemanticView';
import { LocalGraph } from './view/exported-view/LocalGraph';
import { ExportedViewForm } from './view/exported-view/ExportedViewForm';
import { ExportedViewList } from './view/exported-view/ExportedViewList';
import { ExportedViews } from './view/exported-view/ExportedViews';
import { ExportedViewManage } from './view/exported-view/ExportedViewManage';
import { Mappings } from './view/mappings/Mappings';

import { TriplesMapForm } from './view/exported-view/triplesmap/TriplesMap_Form';
import { Mashups } from './view/mashup/Mashups';
import { MashupForm } from './view/mashup/MashupForm';
import { MashupManage } from './view/mashup/manage/MashupManage';

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
        
        <Route path={ROUTES.DATASOURCE_LIST} element={<DataSources />} />
        {/* <Route path={ROUTES.DATASOURCE_LIST} element={<DataSourceList />} /> */}
        <Route path={ROUTES.DATASOURCE_FORM} element={<DataSourceForm />} />

        <Route path={ROUTES.TABLE_LIST} element={<NewTableList />} />
        <Route path={ROUTES.TABLE_FORM} element={<TableForm />} />
        <Route path={ROUTES.COLUMN_LIST} element={<ColumnList />} />
        <Route path={ROUTES.COLUMN_FORM} element={<ColumnForm />} />
        {/* Build Metadata */}
        <Route path={ROUTES.MANAGE_METAGRAPH} element={<ManageMetagraph />} />
        <Route path={ROUTES.MANAGE_META_DATASOURCES} element={<MetaDataSources />} />
        <Route path={ROUTES.SEMANTIC_VIEW} element={<SemanticView />} />

        <Route path={ROUTES.LOCAL_GRAPH_CONSTRUCT} element={<LocalGraph />} />
        <Route path={ROUTES.LOCAL_GRAPH_FORM} element={<ExportedViewForm />} />
        <Route path={ROUTES.LOCAL_GRAPH_LIST} element={<ExportedViews />} />
        <Route path={ROUTES.EXPORTED_VIEW_MANAGE} element={<ExportedViewManage />} />
        
        <Route path={ROUTES.MAPPINGS_LIST} element={<Mappings />} />
        
        <Route path={ROUTES.TRIPLES_MAP_FORM} element={<TriplesMapForm />} />
        
        <Route path={ROUTES.MASHUP_LIST} element={<Mashups />} />
        <Route path={ROUTES.MASHUP_FORM} element={<MashupForm />} />
        <Route path={ROUTES.MASHUP_MANAGE} element={<MashupManage />} />
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



