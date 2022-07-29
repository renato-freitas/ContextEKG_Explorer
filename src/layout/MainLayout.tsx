import React, { useState } from 'react';
import Grid from '@mui/material/Grid';


import { Outlet } from 'react-router-dom';

import { TopBar } from './TopBar';
import { THEMES } from './layout_theme';
import { Sidebar } from './Sibebar';



export const MainLayout = () => {
  return (<>
    <TopBar />
    <Grid container>
      <Grid item sm={2}>
        <Sidebar />
      </Grid>
      <Grid item sm={10}>
        <Outlet />
      </Grid>
    </Grid>
  </>
  );
};