import './style.css';
import { Header } from '../../components/Header';
import Footer from '../../components/Footer';
import { Typography, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';

const data = [
  {
    title: 'Card 1',
    description: 'This is the first card.',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'Card 2',
    description: 'This is the second card.',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'Card 3',
    description: 'This is the third card.',
    image: 'https://via.placeholder.com/150',
  },
];

export function Home() {
  return (
    <div>
      <Header />
      <main>
        <Container>
          <Grid container spacing={4}>
            {data.map((item) => (
              <Grid item key={item.title} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
