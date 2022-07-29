import { Routes, Route, Link } from "react-router-dom";
import { Home } from './view/home/Home';
import { Topics } from './view/topics/Topics';
import { MetagraphList } from './view/mokg/MetagraphList';
import { Organization } from './view/organisations/Organisation';
import { About } from './view/About';
import { MainLayout } from './layout/MainLayout';

import { ROUTES } from './commons/constants';

// https://blog.devgenius.io/implementing-react-router-v6-with-code-splitting-in-a-react-typescript-project-14d98e2cab79


export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.TOPICS} element={<Topics />} />
        <Route path={ROUTES.METAGRAPHS} element={<MetagraphList />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
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



