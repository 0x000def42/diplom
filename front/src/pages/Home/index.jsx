import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const CardImage = styled(CardMedia)({
  width: '100%',
  height: 200,
  objectFit: 'cover',
});

const MainContainer = styled(Container)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const Home = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/templates/');
        console.log('Fetched templates:', response.data);
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);
  
  return (
      <MainContainer>
        <Grid container spacing={3}>
          {templates.map((item, index) => (
            <Grid item key={index} xs={12} sm={6}>
              <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardImage component="img" image={item.image} alt={item.title} />
                <CardContent>
                  <Typography variant="h5">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Скачать
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainContainer>
  );
}

export default Home;
