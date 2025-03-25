import { AppBar, Toolbar, Typography, TextField, Tooltip, IconButton } from '@mui/material';
import { useLocation } from 'preact-iso';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginButton from './LoginButton';

export function Header({ searchTerm, user, onLogin, onSearchChange }) {
	const { route } = useLocation();

	return (
		<AppBar position="static" sx={{  mb: 4 }}>
			<Toolbar>
				<Typography
					variant="h6" 
					sx={{ flexGrow: 1, cursor: 'pointer' }}
					onClick={() => route('/')}
				>
					Каталог шаблонов
				</Typography>
				{user ? (
					<Tooltip title="Профиль">
						<IconButton
							href="/profile"
							sx={{
								ml: 1,
							}}
						>
							<AccountCircleIcon />
						</IconButton>
				</Tooltip>
				) : (
					<LoginButton onLogin={onLogin} />
				)}
				<TextField
					variant="outlined"
					size="small"
					value={searchTerm}
					onChange={onSearchChange}
					placeholder="Поиск шаблонов..."
					sx={{borderRadius: 1, width: '250px', ml: 3 }}
				/>
			</Toolbar>
      </AppBar>

	);
}
