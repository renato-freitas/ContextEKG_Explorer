import CssBaseline from '@mui/material/CssBaseline';
import React, { createContext } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from './components/Loading';
import Router from './Router';
import { GlobalStyle } from './styles/global';

// const LoadingContext = React.createContext({
//   loading: false,
//   message: null,
//   showLoading: (message: string) => { },
//   hideLoading: () => { }
// })

interface LoadingContextData {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  handleCloseLoading?: () => void;
}
export const LoadingContext = createContext({} as LoadingContextData);


function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <>
      <CssBaseline />
      <GlobalStyle />
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <Loading />
        <Router />
      </LoadingContext.Provider>
    </>
  )
}


export default App
