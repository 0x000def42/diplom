import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid2, Card, CardContent, CardMedia, Button } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const CardImage = styled(CardMedia)({
  height: 300,
  objectFit: 'cover',
  cursor: 'pointer',
});

const MyCard = styled(Card)({
  cursor: 'pointer',
  padding: 15,
  '&:hover': {
    background: "#eee",
  },
})

const MainContainer = styled(Container)({
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
        <Grid2 container spacing={3}>
          {templates.map((item, index) => (
            <Grid2 size={4}>
              <MyCard>
                <CardImage component="img" image={item.preview_url} alt={item.name} />
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </MyCard>
            </Grid2>
          ))}
        </Grid2>
      </MainContainer>
  );
}

export default Home;
