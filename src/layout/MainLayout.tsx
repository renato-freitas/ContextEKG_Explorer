import React, { useState } from 'react';
import Grid from '@mui/material/Grid';


import { Outlet } from 'react-router-dom';

import { TopBar } from './TopBar';
import { THEMES } from './layout_theme';
import { Sidebar } from './Sibebar';



export const MainLayout = () => {
  return (
    <>
      <TopBar />
      <Grid container>
        <Grid item sm={1.5}>
          <Sidebar />
        </Grid>
        <Grid item sm={10.5} sx={{background: "#f6f6f6", height: "100%"}}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};