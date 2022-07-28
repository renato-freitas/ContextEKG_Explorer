import CssBaseline from '@mui/material/CssBaseline';
import { Link } from 'react-router-dom';
import Router from './routes/Router';


function App() {
  return (
    <>
      <CssBaseline />
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
