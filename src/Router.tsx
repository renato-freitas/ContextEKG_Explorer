import { Routes, Route, Link } from "react-router-dom";
import { MainLayout } from './layout/MainLayout';
import { Home } from './view/home/Home';
import { About } from './view/About';
import { MetagraphList } from './view/mokg/MetagraphList';
import { MetagraphForm } from './view/mokg/MetagraphForm';
import { Organizations } from './view/organizations/Organization';
import { Persons } from './view/persons/Persons';
import { DataSourceList } from './view/datasources/DataSourceList';
// import { DataSourceForm } from './view/datasources/DataSourceForm';
import { NewDataSourceForm } from './view/datasources/NewDataSourceForm';
import { NewTableList } from './view/datasources/tables/NewTableList';
import { TableForm } from './view/datasources/tables/TableForm';
import { ColumnList } from './view/datasources/columns/ColumnList';
import { ColumnForm } from './view/datasources/columns/ColumnForm';

import { Topics } from './view/topics/Topics';

import { ManageMetagraph } from './view/manage/ManageMetagraph';
import { MetaDataSources } from './view/manage/datasources/MetaDataSources';


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
        <Route path={ROUTES.ORGANIZATIONS} element={<Organizations />} />
        <Route path={ROUTES.PERSONS} element={<Persons />} />
        <Route path={ROUTES.DATASOURCE_LIST} element={<DataSourceList />} />
        <Route path={ROUTES.DATASOURCE_FORM} element={<NewDataSourceForm />} />
        <Route path={ROUTES.TABLE_LIST} element={<NewTableList />} />
        <Route path={ROUTES.TABLE_FORM} element={<TableForm />} />
        <Route path={ROUTES.COLUMN_LIST} element={<ColumnList />} />
        <Route path={ROUTES.COLUMN_FORM} element={<ColumnForm />} />
        {/* Build Metadata */}
        <Route path={ROUTES.MANAGE_METAGRAPH} element={<ManageMetagraph />} />
        <Route path={ROUTES.MANAGE_META_DATASOURCES} element={<MetaDataSources />} />
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



