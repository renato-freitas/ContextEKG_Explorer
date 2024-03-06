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
        <Grid item sm={1}>
          <Sidebar />
        </Grid>
        <Grid item sm={11} sx={{background: "#f0f0f0", height: "100%", mt:1}}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};