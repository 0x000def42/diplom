import { useEffect, useState } from 'react';
import {
  Typography, Dialog, DialogContent, Container, Grid2, Button,
  DialogTitle, TextField, DialogActions, Snackbar, Alert,
  Checkbox, FormControlLabel
} from '@mui/material';
import { styled } from '@mui/system';
import api from '@/utils/api.js';
import TemplateGrid from './TemplateGrid';
import { useGlobalStore } from '@/store';

const MainContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
});

const TemplateList = () => {
  const [templates, setTemplates] = useState(null);
  const [meta, setMeta] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const searchTerm = useGlobalStore((s) => s.searchTerm);
  const user = useGlobalStore((s) => s.user)
  const showOnlyFavorites = useGlobalStore((s) => s.showOnlyFavorites);
  const toggleFavoritesFilter = useGlobalStore((s) => s.toggleFavoritesFilter);

  useEffect(() => {
    const fetchTemplates = async () => {
      const params = new URLSearchParams();
      params.set("query", searchTerm);
      if (showOnlyFavorites) {
        params.set("favoritesOnly", "true");
      }

      const url = `/templates/?${params.toString()}`;
      const response = await api.get(url);
      setTemplates(response.data);
    };
    fetchTemplates();
  }, [searchTerm, showOnlyFavorites]);

  useEffect(() => {
    const fetchTemplatesMeta = async () => {
      const url = `/templates/meta`
      const response = await api.get(url)

      setMeta(response.data)
    }
    fetchTemplatesMeta()
  }, [user])

  if(templates == null || meta == null) return

  return (
    <MainContainer>
      <Grid2 size={4}>
        <FormControlLabel
          control={<Checkbox checked={showOnlyFavorites} onChange={toggleFavoritesFilter} />}
          label={`Только избранное (${meta.favorites})`}
        />
      </Grid2>

      {templates.length === 0 ? (
        <Container sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>Ничего не найдено</Typography>
          <Typography variant="body1">Вы можете оставить обращение c просьбой добавить нужный шаблон</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setReviewDialogOpen(true)}>
            Оставить обращение
          </Button>
        </Container>
      ) : (
        <Grid2 container spacing={3}>
          <TemplateGrid templates={templates} />
        </Grid2>
      )}

      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Оставить обращение</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField required label="Ваш email" value={reviewEmail} onChange={(e) => setReviewEmail(e.currentTarget.value)} type="email" />
          <TextField required label="Заголовок" value={reviewTitle} onChange={(e) => setReviewTitle(e.currentTarget.value)} />
          <TextField required label="Описание (текст обращения)" value={reviewBody} onChange={(e) => setReviewBody(e.currentTarget.value)} multiline minRows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={async () => {
            try {
              await api.post('/reviews/', { email: reviewEmail, title: reviewTitle, body: reviewBody });
              setShowSuccessSnackbar(true);
              setReviewDialogOpen(false);
              setReviewEmail('');
              setReviewTitle('');
              setReviewBody('');
            } catch (err) {
              console.error('Error sending review:', err);
            }
          }}>
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Спасибо, ваш отзыв успешно отправлен!
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

export default TemplateList;
