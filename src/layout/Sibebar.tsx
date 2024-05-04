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
import { Paper, Stack } from '@mui/material';
const MENU_FONTE_SIZE = "0.7rem"
const MENU_ICON_SIZE = 20

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <Paper elevation={3} sx={{position: 'absolute', ml: 0.3, mt:1}}>
      <SidebarContainer>
        <List>
          {
            menuEvolve.map((item, index) => (
              <ListItem key={item.title} disablePadding>
                {/* <ListItemButton component={NavLink} to={item.href} selected={pathname === item.href}> */}
                <ListItemButton component={NavLink} to={item.href[0]} selected={item.href.includes(pathname) == true}>
                  <Stack direction={'column'} >
                    <ListItemIcon>
                      <item.icon size={MENU_ICON_SIZE} />
                    </ListItemIcon>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
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
                    <item.icon size={MENU_ICON_SIZE} />
                  </ListItemIcon>
                  <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{pb:15, height:10}}>
          {menuConfig.map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton component={NavLink} to={item.href}>
                <Stack direction={'column'}>
                  <ListItemIcon>
                    <item.icon size={MENU_ICON_SIZE} />
                  </ListItemIcon>
                  <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SidebarContainer>
    </Paper>
  )
}