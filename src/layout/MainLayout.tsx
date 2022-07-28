import React, { useState } from 'react';
import { experimentalStyled, useMediaQuery, Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Sidebar from './sidebar/Sidebar';
// import Header from './header/Header';
// import Footer from './footer/Footer';
// import Customizer from './customizer/Customizer';
// import { TopbarHeight } from '../../assets/global/Theme-variable';
import { TopBar } from './TopBar';
import { THEMES } from './layout_theme';

const MainWrapper = experimentalStyled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
  width: '100%',
}));
const PageWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',

  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    paddingTop: THEMES.TOPBAR_HEIGTH,
  },
  [theme.breakpoints.down('lg')]: {
    paddingTop: '64px',
  },
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // const customizer = useSelector((state) => state.CustomizerReducer);
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  return (
    // <MainWrapper className={customizer.activeMode === 'dark' ? 'darkbg' : ''}>
    <MainWrapper>
      <TopBar />

      {/* <Sidebar
        isSidebardir={customizer.activeDir === 'ltr' ? 'left' : 'right'}
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      /> */}

      <PageWrapper>
        <Container
          maxWidth={false}
          sx={{
            paddingTop: '20px',
            // paddingLeft: isSidebarOpen && lgUp ? '280px!important' : '',
          }}
        >
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
            <Outlet />
          </Box>
          {/* <Customizer /> */}
          {/* <Footer /> */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
