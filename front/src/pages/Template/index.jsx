import api from '@/utils/api';
import { Container, CircularProgress, Grid2, Typography, DialogContent, Dialog, IconButton, CardMedia, Box, Card, Divider, Stack, Tooltip, TextField, Button, Table, TableCell, TableContainer, TableHead, TableRow, TableBody } from '@mui/material';
import { useRoute } from 'preact-iso/router';
import { Edit as EditIcon, Logout as LogoutIcon, Save as SaveIcon } from '@mui/icons-material';
import { useEffect, useState } from 'preact/hooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';
import { useRef } from 'preact/hooks';
import guard from '@/utils/guard';

const Template = () => {
    const { params: {id} } = useRoute();
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState(null)
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(false);

    const [editedName, setEditedName] = useState(null)
    const [editedDescription, setEditedDescription] = useState(null)
    const [editing, setEditing] = useState(false)

    const fileInputRef = useRef(null)

    const fetchTemplate = async () => {
        try {
            const response = await api.get(`/templates/${id}`)
            setTemplate(response.data)
            setEditedDescription(response.data.description)
            setEditedName(response.data.name)
            setLiked(response.data.liked)
            setLoading(false)
        } catch (err) {
            console.error("Ошибка при получении шаблона", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
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

    const handleSave = async () => {
        try {
            const response = await api.put(`/templates/${id}`, {
                name: editedName,
                description: editedDescription
            })
            setLoading(true)
            setEditing(false)
            fetchTemplate()
        } catch(err) {
            console.error("Не удалось сохранить шаблон", err)
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
    
        const formData = new FormData()
        formData.append("file", file)
    
        try {
            setLoading(true)
            await api.post(`/templates/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            fetchTemplate()
        } catch (err) {
            setLoading(false)
            guard.error(err.message)
            console.error("Ошибка при загрузке файла", err)
        }
    }

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
                <Grid2 size={8}>
                    <Card variant="outlined" sx={{mb: 2}}>
                        <Box sx={{ p: 2 }}>
                            { !editing ? (
                                <>
                                    <Typography gutterBottom variant="h5" component="div">
                                    { template.owns && (
                                        <IconButton sx={{mr: 1}} onClick={() => setEditing(true)} size="medium">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}

                                        {template.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {template.description}
                                    </Typography>
                                </>) : (
                                    <>
                                        <Box sx={{ display: 'flex', flexDirection: "column" , gap: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Название"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.currentTarget.value)}
                                            />

                                            <TextField
                                                fullWidth
                                                multiline
                                                minRows={4}
                                                label="Описание"
                                                value={editedDescription}
                                                onChange={(e) => setEditedDescription(e.currentTarget.value)}
                                            />
                                            <Button
                                                onClick={() => { handleSave() }}
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                            >
                                                Сохранить
                                            </Button>
                                            <Button
                                                onClick={() => { setEditing(false) }}
                                            >
                                                Отмена
                                            </Button>
                                        </Box>
                                    </>
                                )
                            }
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
                    <Card variant="outlined">
                        <Box sx={{ px: 2, pt: 2 }} display={'flex'} justifyContent={'space-between'}>
                            <Typography component={'div'} variant='h5'>Версии</Typography>
                            {template.owns && (
                                <>
                                    <input
                                        type="file"
                                        accept="*/*"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleUpload}
                                    />
                                    <Button onClick={() => fileInputRef.current.click()}>
                                        Загрузить
                                    </Button>
                                </>
                            )}
                        </Box>

                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Файл</TableCell>
                                        <TableCell align="right">#</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {template.versions.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell scope="row">
                                            {row.createdAt}
                                        </TableCell>
                                        <TableCell>{row.fileName}</TableCell>
                                        <TableCell align="right">
                                        <IconButton component="a" href={row.file_url} download target="_blank" rel="noopener noreferrer" size="small" color="primary">
                                            <DownloadIcon />
                                        </IconButton>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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