import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, Button, TextField, Box } from '@mui/material';
import { styled } from '@mui/system';

// Стили для изображения
const CardImage = styled(CardMedia)({
  width: '100%',
  height: 200,
  objectFit: 'cover',
});

// Стили для основного контейнера
const MainContainer = styled(Container)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

// Данные карточек
const data = [
  {
    title: 'Название шаблона 1',
    description: 'Описание шаблона',
    image: 'https://placehold.co/400x200',
  },
  {
    title: 'Название шаблона 2',
    description: 'Описание шаблона',
    image: 'https://placehold.co/400x200',
  },
];

export function Home() {
  return (
      <MainContainer>
        <Grid container spacing={3}>
          {data.map((item, index) => (
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
