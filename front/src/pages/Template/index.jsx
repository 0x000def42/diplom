import api from '@/utils/api';
import { Container, CircularProgress, Grid2, Typography, DialogContent, Dialog, IconButton, CardMedia, Box, Card, Chip, Divider, Stack, Tooltip } from '@mui/material';
import { useRoute } from 'preact-iso/router';
import { useEffect, useState } from 'preact/hooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';

const Template = () => {
    const { params: {id} } = useRoute();
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState(null)
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await api.get(`/templates/${id}`)
                setTemplate(response.data)
                setLiked(response.data.liked);
                setLoading(false)
            } catch (err) {
                console.error("Ошибка при получении шаблона", err)
            } finally {
                setLoading(false)
            }
        }
        fetchTemplate()
    }, [])

    const toggleLike = async () => {
        try {
            setLiked(!liked)
            const response = await api.post(`/templates/${id}/like`)
            setLiked(response.data.liked)
        } catch (err) {
            setLiked(liked)
            console.error("Не удалось переключить лайк", err);
        }
    }

    if (loading) {
        return (
            <Container sx={{ mt: 4 }}>
                <CircularProgress />
            </Container>
        )
    }
    if (!template) return null

    return (
        <Container>
            <Grid2 container spacing={3}>
                <Grid2 size={4}>
                <CardMedia 
                    component="img" 
                    image={template.preview_url} 
                    alt={template.name} 
                    onClick={() => setOpen(true)}
                    sx={{
                        cursor: 'pointer',
                        boxShadow: 1
                    }}
                />
                </Grid2>
                <Grid2 size={6}>
                    <Card variant="outlined">
                        <Box sx={{ p: 2 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {template.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {template.description}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="В избранное">
                            <IconButton size="small" color={liked ? "secondary" : "default"} onClick={toggleLike}>
                                <FavoriteIcon />
                            </IconButton>
                            </Tooltip>

                            <Tooltip title="Скачать">
                                <IconButton component="a" href={template.file_url} download target="_blank" rel="noopener noreferrer" size="small" color="primary">
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        </Box>
                    </Card>
                </Grid2>
            </Grid2>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xl" fullWidth>
                <DialogContent sx={{ position: 'relative', p: 0,  }}>
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 8, right: 8,}}>
                    x
                    </IconButton>
                    <img src={template.preview_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                </DialogContent>
            </Dialog>
        </Container>
    )
}

export default Template