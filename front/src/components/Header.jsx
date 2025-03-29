import { AppBar, Toolbar, Typography, TextField, Tooltip, IconButton } from '@mui/material';
import { useLocation } from 'preact-iso';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginButton from './LoginButton';
import { useGlobalStore } from '@/store';

export function Header() {
  const { route } = useLocation();
  const user = useGlobalStore((s) => s.user);
  const setUser = useGlobalStore((s) => s.setUser);
  const searchTerm = useGlobalStore((s) => s.searchTerm);
  const setSearchTerm = useGlobalStore((s) => s.setSearchTerm);

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography
          sx={{ flexGrow: 1 }}
          variant="h6"
        >
          <span style="cursor: pointer" onClick={() => route('/')}>
            Каталог шаблонов
          </span>
        </Typography>

        {user ? (
          <Tooltip title="Профиль">
            <IconButton href="/profile">
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <LoginButton onLogin={setUser} />
        )}

        <TextField
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          placeholder="Поиск шаблонов..."
          sx={{ borderRadius: 1, width: '250px', ml: 3 }}
        />
      </Toolbar>
    </AppBar>
  );
}