import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import Footer from './Footer';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, Button, TextField, Box, Alert, Snackbar } from '@mui/material';
import "../style.css"
import api from '@/utils/api';
import guard from '@/utils/guard'

const Layout = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    // @ts-ignore
    api.onUnauthorized(() => showSnackbar("Сначала авторизуйтесь"))
    guard.onUnauthorized(() => showSnackbar("Сначала авторизуйтесь"))
    guard.onError((err) => showSnackbar(err))

    return () => {
      // @ts-ignore
      api.onUnauthorized(() => {});
      guard.onUnauthorized(() => {})
      guard.onError(() => {})
    }
  }, [])
  
  const showSnackbar = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main>{children}</main>
        <Footer />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: '100%' }}>
            {snackbarMsg}
          </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
