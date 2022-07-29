import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useLocation } from 'react-router';

import { SidebarContainer } from './Sidebar.styles'

import { menuEvolve, menuConsuming } from './menu';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <SidebarContainer>
      <List>
        {menuEvolve.map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={NavLink} to={item.href} selected={pathname === item.href}>
              <ListItemIcon>
                <item.icon size={22} />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {menuConsuming.map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={NavLink} to={item.href}>
              <ListItemIcon>
                <item.icon size={22} />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SidebarContainer>
  )
}