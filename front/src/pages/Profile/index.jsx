import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Logout as LogoutIcon, Save as SaveIcon } from '@mui/icons-material';
import api from '@/utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        const response = await api.get('/users/me');

        setUser(response.data);
        setEditedName(response.data.name || '');
      } catch (err) {
        console.warn('Ошибка при получении пользователя', err);
        localStorage.removeItem('auth_token');
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/users/me', {
        name: editedName,
      });

      setUser(response.data);
      setEditing(false);
    } catch (err) {
      console.error('Ошибка при обновлении имени:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Профиль</Typography>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 2 }}>Email: {user.email}</Typography>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
        >
          Выйти
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {editing ? (
          <>
            <TextField
              label="Имя"
              value={editedName}
              onChange={(e) => setEditedName(e.currentTarget.value)}
              size="small"
            />
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Сохранить
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1">Имя: {user.name}</Typography>
            <IconButton onClick={() => setEditing(true)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
