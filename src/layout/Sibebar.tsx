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
import { Component, Key } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../redux/store'
const MENU_FONTE_SIZE = "0.7rem"
const MENU_ICON_SIZE = 20
const PADDING_LEFT_ITEMS = 1.3
const SIDEBAR_MARGIN_WHEN_FOR_PAPER_IMAGE = {position: 'absolute', ml: 8, mt:0, width:90}
const SIDEBAR_MARGIN_WHEN_PRODUCTION = {position: 'absolute', ml: 0.3, mt:0, width:100}

interface itemProps {
  title: {},
  icon: Component,
  href: string[],
  type: string[]
}

export function Sidebar() {
  const { pathname } = useLocation();
	const dispatch = useDispatch();
	const global_context = useSelector((state: RootState) => state.globalContext)
  return (
    <Paper elevation={3} sx={SIDEBAR_MARGIN_WHEN_PRODUCTION}>
      <SidebarContainer>
        <List>
          {
            menuEvolve.map((item:any, index:Key) => (
              <ListItem key={index} disablePadding>
                <ListItemButton 
									sx={{pl:PADDING_LEFT_ITEMS}}
									component={NavLink} 
									to={item.href[0]} 
									selected={item.href.includes(pathname) == true}>
                  <Stack direction={'column'} >
                    <ListItemIcon>
                      <item.icon size={MENU_ICON_SIZE} />
                    </ListItemIcon>
                    <ListItemText primary={item.title[global_context.language]} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>

        <Divider />
        <List>
          {menuConsuming.map((item:any, index) => (
            <ListItem key={item.title[global_context.language]} disablePadding>
              <ListItemButton 
								sx={{pl:PADDING_LEFT_ITEMS}}
								component={NavLink} 
								to={item.href}>
                <Stack direction={'column'}>
                  <ListItemIcon>
                    <item.icon size={MENU_ICON_SIZE} />
                  </ListItemIcon>
                  <ListItemText primary={item.title[global_context.language]} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{pb:15, height:10}}>
          {menuConfig.map((item:any, index) => (
            <ListItem key={item.title['pt']} disablePadding>
              <ListItemButton 
								sx={{pl:PADDING_LEFT_ITEMS}}
								component={NavLink} to={item.href}>
                <Stack direction={'column'}>
                  <ListItemIcon>
                    <item.icon size={MENU_ICON_SIZE} />
                  </ListItemIcon>
                  <ListItemText primary={item.title[global_context.language]} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SidebarContainer>
    </Paper>
  )
}