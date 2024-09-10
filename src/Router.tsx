import { Routes, Route } from "react-router-dom";
import { MainLayout } from './layout/MainLayout';
import { Home } from './view/home/Home';
import { About } from './view/About';

import { Classes } from './view/navigation/Classes';
import { Resources } from './view/navigation/Resources';
import { Properties } from './view/navigation/Properties';
import { TimelineView } from './view/navigation/Timeline';

import { EndpointConfig } from './view/config/EndpointConfig';
import { Repositories } from './view/config/Repositories';
import { SavedQueries } from './view/queries/SavedQueries';
import { SavedQueryForm } from './view/queries/SavedQueryForm';

import { CompetenceQuestions } from './view/competence/Competencies';
import { MetadataProperties } from './view/metadata/MetadataProperties';
import { ROUTES } from './commons/constants';


export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CLASSES} element={<Classes />} />
        <Route path={ROUTES.RESOURCES} element={<Resources />} />
        <Route path={ROUTES.PROPERTIES} element={<Properties />} />
        <Route path={ROUTES.PROPERTIES_URI} element={<Properties />} />
        <Route path={ROUTES.TIMELINE} element={<TimelineView />} />
        <Route path={ROUTES.TIMELINE_URI} element={<TimelineView />} />
        <Route path={ROUTES.TIMELINE_RESOURCE} element={<TimelineView />} />
        <Route path={ROUTES.ENDPOINT_CONFIG} element={<EndpointConfig />} />
        <Route path={ROUTES.REPOSITORY_LIST} element={<Repositories />} />
        <Route path={ROUTES.SAVED_QUERY} element={<SavedQueries />} />
        <Route path={ROUTES.SAVED_QUERY_FORM} element={<SavedQueryForm />} />
        <Route path={ROUTES.COMPETENCE_QUESTIONS_LIST} element={<CompetenceQuestions />} />
        <Route path={ROUTES.METADATA_PROPERTIES} element={<MetadataProperties />} />
        <Route path={"*"} element={<h1>Page Not Found</h1>} />
      </Route>
    </Routes>
  )
}