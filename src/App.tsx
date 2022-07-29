import CssBaseline from '@mui/material/CssBaseline';
import { Link } from 'react-router-dom';
import Router from './Router';
import { GlobalStyle } from './styles/global';


function App() {
  return (
    <>
      <CssBaseline />
      <GlobalStyle /> 
      {/* <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/topics'>Topics</Link></li>
        <li><Link to='/settings'>Settings</Link></li>
      </ul> */}
      <Router />
    </>
  )
}


export default App
