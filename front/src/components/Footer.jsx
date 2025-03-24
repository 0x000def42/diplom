import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 'auto', py: 3, textAlign: 'center' }}>
      <Container>
        <Typography variant="body2">
          &copy; 2025 Все права защищены | <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Политика конфиденциальности</a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
