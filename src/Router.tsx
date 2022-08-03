import { Routes, Route, Link } from "react-router-dom";
import { MainLayout } from './layout/MainLayout';
import { Home } from './view/home/Home';
import { About } from './view/About';
import { MetagraphList } from './view/mokg/MetagraphList';
import { MetagraphForm } from './view/mokg/MetagraphForm';
import { Organizations } from './view/organizations/Organization';
import { Persons } from './view/persons/Persons';
import { DataSources } from './view/datasources/DataSources';
import { Topics } from './view/topics/Topics';

import { ManageMetagraph } from './view/manage/ManageMetagraph';


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
        <Route path={ROUTES.DATASOURCES} element={<DataSources />} />
        <Route path={ROUTES.MANAGE_METAGRAPH} element={<ManageMetagraph />} />
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



