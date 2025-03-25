import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import Footer from './Footer';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, Button, TextField, Box, Alert, Snackbar } from '@mui/material';
import "../style.css"
import api from '@/utils/api';

const Layout = ({ children, searchTerm, user, onLogin, onSearchChange }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    // @ts-ignore
    api.onUnauthorized(() => showSnackbar("Сначала авторизуйтесь"))

    return () => {
      // @ts-ignore
      api.onUnauthorized(() => {});
    }
  }, [])
  
  const showSnackbar = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header searchTerm={searchTerm} user={user} onLogin={onLogin} onSearchChange={onSearchChange} />
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
