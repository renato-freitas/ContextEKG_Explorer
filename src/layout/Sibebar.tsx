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
import { Component, Key, useState } from 'react';
import { string } from 'zod';
const MENU_FONTE_SIZE = "0.7rem"
const MENU_ICON_SIZE = 20

interface itemProps {
  title: {},
  icon: Component,
  href: string[],
  type: string[]
}

export function Sidebar() {
  const { pathname } = useLocation();
  const [selectedLanguage, setSelectecLanguage] = useState<string>(window.localStorage.getItem('LANGUAGE') as any)
  return (
    <Paper elevation={3} sx={{position: 'absolute', ml: 0.3, mt:1}}>
      <SidebarContainer>
        <List>
          {
            menuEvolve.map((item:any, index:Key) => (
              // let title = item.title[lan]
              // <ListItem key={item.title['pt']} disablePadding>
              <ListItem key={index} disablePadding>
                {/* <ListItemButton component={NavLink} to={item.href} selected={pathname === item.href}> */}
                <ListItemButton component={NavLink} to={item.href[0]} selected={item.href.includes(pathname) == true}>
                  <Stack direction={'column'} >
                    <ListItemIcon>
                      <item.icon size={MENU_ICON_SIZE} />
                    </ListItemIcon>
                    <ListItemText primary={item.title[selectedLanguage]} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>

        <Divider />
        <List>
          {menuConsuming.map((item:any, index) => (
            <ListItem key={item.title[selectedLanguage]} disablePadding>
              <ListItemButton component={NavLink} to={item.href}>
                <Stack direction={'column'}>
                  <ListItemIcon>
                    <item.icon size={MENU_ICON_SIZE} />
                  </ListItemIcon>
                  <ListItemText primary={item.title[selectedLanguage]} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{pb:15, height:10}}>
          {menuConfig.map((item:any, index) => (
            <ListItem key={item.title['pt']} disablePadding>
              <ListItemButton component={NavLink} to={item.href}>
                <Stack direction={'column'}>
                  <ListItemIcon>
                    <item.icon size={MENU_ICON_SIZE} />
                  </ListItemIcon>
                  <ListItemText primary={item.title[selectedLanguage]} primaryTypographyProps={{ fontSize: MENU_FONTE_SIZE }} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SidebarContainer>
    </Paper>
  )
}




// 				{
		// 			return exportedViews.map((expview, index) => {
		// 				return <Grid item xs={12} sm={6} md={3} key={index}>
		// 					<Paper elevation={3} sx={{ minHeight: 300, justifyContent: "space-between" }} >
		// 						<Stack
		// 							direction="column"
		// 							justifyContent="space-between"
		// 							alignItems="center"
		// 							spacing={2}
		// 							sx={{ minHeight: 300 }}
		// 						>
		// 							<Box display='flex' flexDirection="column" p={1}>
		// 								{/* <Button variant="text" onClick={(event) => handleListOfClassesClick(event, classRDF)}> */}
		// 								<Button variant="text">
		// 									<Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
		// 										{expview?.datasource?.value}
		// 									</Typography>
		// 								</Button>
		// 							</Box>

		// 						</Stack>
		// 					</Paper>
		// 				</Grid>
		// 			</Grid>
		// }
		// 	: false

			// <Grid container spacing={{ xs: 2, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
			// 	{

			// 			? 
			// 			})
			// 	/** CABEÇALHO */
			// 	: !isLoading && <Grid item xs={12} sx={{ marginBottom: '-10px !important' }}>
			// 		<div style={{ background: COLORS.CINZA_01, paddingLeft: '10px' }}>
			// 			<h4>{`Classes ${typeOfClass == "0" ? "de Generalização" : typeOfClass == "1" ? 'Exportadas' : 'Metadados'}`}
			// 				{` (${classes.length > 0 ? classes.length : ""})`}
			// 			</h4>
			// 		</div>
			// 	</Grid>

			// 		/** LISTA DAS CLASSES */
			// 		!isLoading && classes.length > 0 && classes.map((classRDF, index) =>
			// 	<Grid item xs={12} sm={6} md={3} key={index}>
			// 		<Paper elevation={3} sx={{ minHeight: 300, justifyContent: "space-between" }} >
			// 			<Stack
			// 				direction="column"
			// 				justifyContent="space-between"
			// 				alignItems="center"
			// 				spacing={2}
			// 				sx={{ minHeight: 300 }}
			// 			>
			// 				<Box display='flex' flexDirection="column" p={1}>
			// 					<Button variant="text" onClick={(event) => handleListOfClassesClick(event, classRDF)}>
			// 						<Typography variant="h5" component="div" sx={{ fontSize: "1rem", fontWeight: '600' }}>
			// 							{getPropertyFromURI(classRDF?.label?.value)}
			// 						</Typography>
			// 					</Button>
			// 					<Typography sx={{ fontSize: ".55rem", fontWeight: 400, textAlign: "center" }} color="text.primary" gutterBottom>
			// 						{classRDF?.classURI.value}
			// 					</Typography>
			// 					<Typography variant="caption" component="div" color="ActiveCaption" align="center">
			// 						{classRDF?.comment?.value}
			// 					</Typography>
			// 				</Box>
			// 				<Box p={1} width={200} height={120} display="flex" alignItems="flex-end" justifyContent="flex-end">
			// 					{classRDF?.image?.value && <img src={classRDF?.image?.value} alt={getPropertyFromURI(classRDF?.label?.value)} className={style.img_responsive}></img>}
			// 				</Box>
			// 			</Stack>
			// 		</Paper>
			// 	</Grid>)
			// 	}
			// </Grid>