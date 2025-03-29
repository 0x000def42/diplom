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
import guard from '@/utils/guard';
import { useLocation } from 'preact-iso';

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

  const showOnlyMy = useGlobalStore((s) => s.showOnlyMy);
  const toggleMyFilter = useGlobalStore((s) => s.toggleMyFilter);

  const {route} = useLocation()

  const clickUpload = () => {
    if(user){
      route("/templates/upload")
    } else {
      guard.unauthorized()
    }
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      const params = new URLSearchParams();
      params.set("query", searchTerm);
      if (showOnlyFavorites) {
        params.set("favoritesOnly", "true");
      }
      if (showOnlyMy) {
        params.set("myOnly", "true");
      }

      const url = `/templates?${params.toString()}`;
      const response = await api.get(url);
      setTemplates(response.data);
    };
    fetchTemplates();
  }, [searchTerm, showOnlyFavorites, showOnlyMy]);

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
      <Grid2 size={12} sx={{pb: 3, display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <FormControlLabel
            control={<Checkbox checked={showOnlyFavorites} onChange={toggleFavoritesFilter} />}
            label={`Только избранное (${meta.favorites})`}
          />
          <FormControlLabel
            control={<Checkbox checked={showOnlyMy} onChange={toggleMyFilter} />}
            label={`Только мои (${meta.my})`}
          />
        </div>
        <Button onClick={clickUpload} variant="outlined">Загрузить +</Button>
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
