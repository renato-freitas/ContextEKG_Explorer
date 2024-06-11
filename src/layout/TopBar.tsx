import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { getsetRepositoryLocalStorage } from '../commons/utils';
import { COLORS, ROUTES } from '../commons/constants';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)

export function TopBar() {
  // const [repository, setRepository] = useState("")
  const navigate = useNavigate()

  useEffect(() => {},[])
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <AppBar position="static"> */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ pl: 30 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* EKG Context Explorer | EKG Explorer | ContestoGraph | ConGraphex | GraphConex | ExpGraph | 
            ContextEKG Navigator | ContextEKG Explorer*/}
            ContextEKG Explorer
          </Typography>
          <Chip 
            size="small"
            label={getsetRepositoryLocalStorage()} 
            sx={{ bgcolor: `${COLORS.AMARELO_01}` }}
            onClick={() => navigate(ROUTES.REPOSITORY_LIST)}
          />
          <Button color="inherit" sx={{ mr: 15}}>Login</Button>
        </Toolbar>
      </AppBar>
      <Offset />
      {/* <LinearProgress color="secondary" /> */}
      {/* <LinearProgress color="success" /> */}
      {/* <LinearProgress color="inherit" /> */}
    </Box>
  );
}
