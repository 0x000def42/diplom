import { Grid2, CardMedia, CardContent, Typography, Button, styled, Container, Card } from "@mui/material";
import { useLocation } from "preact-iso";

const ImageContaner = styled(Container)({
    objectFit: 'cover',
    cursor: 'pointer',
    padding: 15,
    '&:hover': {
      background: "#eee",
    },
  })

const TemplateGrid = ({templates}) => {
    const {route} = useLocation()

    return (
        <Grid2 size={12}>
            <Grid2 container spacing={3}>
            {templates.map((item) => (
                <Grid2 size={4} key={item.id}>
                   <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3 }}>
                        <ImageContaner onClick={() => route(`/templates/${item.id}`)}>
                            <CardMedia
                            component="img"
                            image={item.preview_url}
                            alt={item.name}
                            sx={{ height: 300, objectFit: 'contain' }}
                            />
                        </ImageContaner>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            >
                            {item.description}
                            </Typography>
                        </CardContent>
                        <CardContent sx={{ pt: 0 }}>
                            <Button
                            component="a"
                            href={item.file_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 'auto' }}
                            >
                            Скачать
                            </Button>
                        </CardContent>
                        </Card>
                </Grid2>
            ))}
        </Grid2>
      </Grid2>
    )
}

export default TemplateGrid;