import CssBaseline from '@mui/material/CssBaseline';
import React, { createContext } from 'react';
import { Loading } from './components/Loading';
import Router from './Router';
import { GlobalStyle } from './styles/global';
import { ClassModel } from './models/ClassModel';

interface LoadingContextData {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  handleCloseLoading?: () => void;
}
export const LoadingContext = createContext({} as LoadingContextData);


interface ClassRDFContextData {
  contextClassRDF: ClassModel;
  setContextClassRDF: React.Dispatch<React.SetStateAction<ClassModel>>
}
export const ClassRDFContext = createContext({} as ClassRDFContextData);

function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [contextClassRDF, setContextClassRDF] = React.useState({} as ClassModel);
  return (
    <>
      <CssBaseline />
      <GlobalStyle />
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <Loading />
        <ClassRDFContext.Provider value={{ contextClassRDF, setContextClassRDF }}>
          <Router />
        </ClassRDFContext.Provider>
      </LoadingContext.Provider >
    </>
  )
}

export default App