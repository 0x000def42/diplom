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
                    <Card sx={{ boxShadow: 3 }}>
                        <ImageContaner onClick={() => route(`/templates/${item.id}`)}>
                        <CardMedia
                            component="img"
                            image={item.preview_url}
                            alt={item.name}
                            sx={{ height: 300, objectFit: 'contain' }}
                        />
                        </ImageContaner>
                        <CardContent>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.description}
                        </Typography>
                        <Button
                            component="a"
                            href={item.file_url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
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