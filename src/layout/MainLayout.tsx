import React from 'react';
import Grid from '@mui/material/Grid';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sibebar';

export const MainLayout = () => {
  return (
    <>
      <TopBar />
      <Grid container>
        <Grid item sm={1}>
          <Sidebar />
        </Grid>
        <Grid item sm={11} sx={{height: "100%", mt:1}}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};