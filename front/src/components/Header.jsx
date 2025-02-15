import { AppBar, Toolbar, Typography, TextField } from '@mui/material';
import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 4 }}>
			<Toolbar>
				<Typography variant="h6" sx={{ flexGrow: 1 }}>
					Каталог шаблонов
				</Typography>
			</Toolbar>
      </AppBar>

	);
}
