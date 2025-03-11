import { useEffect, useState } from 'react';
import {  Typography, Dialog, DialogContent, IconButton, Container, Grid2, Card, CardContent, CardMedia, Button, DialogTitle, TextField, DialogActions, Snackbar, Alert } from '@mui/material';
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

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // GET /templates {query}
        const url = `/api/templates/?query=${encodeURIComponent(searchTerm)}`;
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

  const openReviewDialog = () => {
    setReviewDialogOpen(true);
  };

  const closeReviewDialog = () => {
    setReviewDialogOpen(false);
  };

  const handleSendReview = async () => {
    try {
      // POST /reviews { email, title, body }
      const response = await axios.post('/api/reviews/', {
        email: reviewEmail,
        title: reviewTitle,
        body: reviewBody
      });

      setShowSuccessSnackbar(true);

      closeReviewDialog();
      setReviewEmail('');
      setReviewTitle('');
      setReviewBody('');
    } catch (error) {
      console.error('Error sending review:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccessSnackbar(false);
  };
  
  return (
      <MainContainer>
        {templates.length === 0 ? (
          <Container sx={{ textAlign: 'center', mt: 4, color: 'black' }}>
            <Typography variant="h6" gutterBottom>
              Ничего не найдено
            </Typography>
            <Typography variant="body1" sx={{ color: 'black' }}>
              Вы можете оставить обращение c просьбой добавить нужный шаблон
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={openReviewDialog}>
              Оставить обращение
            </Button>
          </Container>
        ) : (
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
                  <a href={item.file_url} download>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                      Скачать1
                    </Button>
                    <Button component="a" href={item.file_url} download rel="noopener noreferrer" variant="contained" color="primary" sx={{ mt: 2 }}>
                      Скачать2
                    </Button>
                    <Button component="a" href={item.file_url} download target="_blank" rel="noopener noreferrer" variant="contained" color="primary" sx={{ mt: 2 }}>
                      Скачать3
                    </Button>
                  </a>
                </CardContent>
              </MyCard>
            </Grid2>
          ))}
        </Grid2>
        )}
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
          <DialogContent sx={{ position: 'relative', p: 0, backgroundColor: '#000' }}>
            <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}>
              x
            </IconButton>
            <img src={selectedImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
          </DialogContent>
        </Dialog>

        {/* Диалог для отправки отзыва */}
      <Dialog open={reviewDialogOpen} onClose={closeReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Оставить обращение</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required
            label="Ваш email"
            value={reviewEmail}
            onChange={(e) => setReviewEmail(e.target.value)}
            type="email"
          />
          <TextField
            required
            label="Заголовок"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
          <TextField
            required
            label="Описание (текст обращения)"
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewDialog}>Отмена</Button>
          <Button variant="contained" onClick={handleSendReview}>
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Снекбар "Спасибо, ваш отзыв успешно отправлен" */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Спасибо, ваш отзыв успешно отправлен!
        </Alert>
      </Snackbar>

      {/* Диалог для просмотра картинки (у вас уже был) */}
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogContent
          sx={{ position: 'relative', p: 0, backgroundColor: '#000' }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
          >
            x
          </IconButton>
          <img
            src={selectedImage}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>

      </MainContainer>
  );
}

export default Home;
