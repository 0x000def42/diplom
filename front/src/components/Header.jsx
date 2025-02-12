import { AppBar, Toolbar, Typography, TextField } from '@mui/material';
import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 4 }}>
			<Toolbar>
			<Typography variant="h6" sx={{ flexGrow: 1 }}>
				Список шаблонов
			</Typography>
			<TextField
				variant="outlined"
				size="small"
				placeholder="Поиск шаблонов..."
				sx={{ backgroundColor: 'white', borderRadius: 1, width: '250px' }}
			/>
			</Toolbar>
      </AppBar>

	);
}
