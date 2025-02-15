import { useEffect, useState } from 'react';
import {  Typography, Dialog, DialogContent, IconButton, Container, Grid2, Card, CardContent, CardMedia, Button } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const CardImage = styled(CardMedia)({
  cursor: 'pointer',
});

const ImageContaner = styled(Container)({
  objectFit: 'cover',
  cursor: 'pointer',
  padding: 15,
  '&:hover': {
    background: "#eee",
  },
})

const MyCard = styled(Card)({
  //
})

const MainContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
});


const Home = ({searchTerm}) => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const url = `http://localhost:8000/api/templates/?query=${encodeURIComponent(searchTerm)}`;
        const response = await axios.get(url);
        console.log('Fetched templates:', response.data);
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleOpen = (img) => {
    setSelectedImage(img)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  
  return (
      <MainContainer>
        <Grid2 container spacing={3}>
          {templates.map((item, index) => (
            <Grid2 size={4}>
              <MyCard sx={{  boxShadow: 3 }}>
                <ImageContaner onClick={() => handleOpen(item.preview_url) }>
                  <CardImage component="img" image={item.preview_url} alt={item.name} onClick={() => handleOpen(item.preview_url)} />
                </ImageContaner>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Button download href={item.file_url} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Скачать
                  </Button>
                </CardContent>
              </MyCard>
            </Grid2>
          ))}
        </Grid2>

        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
          <DialogContent sx={{ position: 'relative', p: 0, backgroundColor: '#000' }}>
            <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}>
              x
            </IconButton>
            <img src={selectedImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
          </DialogContent>
        </Dialog>

      </MainContainer>
  );
}

export default Home;
