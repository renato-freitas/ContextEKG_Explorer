import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useLocation } from 'react-router';

import { SidebarContainer } from './Sidebar.styles'

import { menuEvolve, menuConsuming, menuConfig } from './menu';
import { NavLink } from 'react-router-dom';
import { Stack } from '@mui/material';

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <SidebarContainer>
      <List>
        {
          menuEvolve.map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton component={NavLink} to={item.href} selected={pathname === item.href}>
                <Stack direction={'column'}>
                  <ListItemIcon>
                    <item.icon size={20} />
                  </ListItemIcon>
                  <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.8rem' }} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))
        }
      </List>
      <Divider />
      <List>
        {menuConsuming.map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={NavLink} to={item.href}>
              <Stack direction={'column'}>
                <ListItemIcon>
                  <item.icon size={22} />
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.8rem' }} />
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {menuConfig.map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={NavLink} to={item.href}>
              <Stack direction={'column'}>
                <ListItemIcon>
                  <item.icon size={22} />
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.8rem' }} />
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SidebarContainer>
  )
}