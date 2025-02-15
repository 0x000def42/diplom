import { AppBar, Toolbar, Typography, TextField } from '@mui/material';
import { useLocation } from 'preact-iso';

export function Header({ searchTerm, onSearchChange }) {
	const { url } = useLocation();

	return (
		<AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 4 }}>
			<Toolbar>
			<Typography variant="h6" sx={{ flexGrow: 1 }}>
				Каталог шаблонов
			</Typography>
			<TextField
				variant="outlined"
				size="small"
				value={searchTerm}
				onChange={onSearchChange}
				placeholder="Поиск шаблонов..."
				sx={{ backgroundColor: 'white', borderRadius: 1, width: '250px' }}
			/>
			</Toolbar>
      </AppBar>

	);
}
