import React from 'react';
import { Header } from './Header';
import Footer from './Footer';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, Button, TextField, Box } from '@mui/material';
import "../style.css"

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Header />
        <main>{children}</main>
        <Footer />
    </Box>
  );
};

export default Layout;
