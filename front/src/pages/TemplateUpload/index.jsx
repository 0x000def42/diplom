import { Box, Button, Card, CardContent, CardMedia, Container, Dialog, DialogContent, Grid2, IconButton, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material"
import { useState } from "preact/hooks";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from "@/utils/api";
import { Save as SaveIcon } from '@mui/icons-material';
import { useLocation } from "preact-iso";

const steps = [
    'Загрузка шаблона ',
    'Проверка шаблона ',
    'Публикация ',
  ];

  const StepError = ({error, handleRetry}) => {
    return (
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
              Произошла ошибка
          </Typography>

          <Typography color="error"  sx={{ mb: 2 }}>
              {error}
          </Typography>
    
          <Box sx={{ mt: 3 }}>
            <Button
            variant="contained"
            onClick={() => handleRetry()}
            >
              Загрузить заново
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const StepThree = ({version, handleSave, error}) => {
    const [open, setOpen] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    
    return (
      <Grid2 sx={{pt: 2}} container spacing={3}>
        <Grid2 size={12}>
          <Typography variant="h5" gutterBottom>Публикация шаблона</Typography>
        </Grid2>
        <Grid2 size={4}>
          <CardMedia 
            component="img" 
            image={version.preview_url} 
            onClick={() => setOpen(true)}
            sx={{
                cursor: 'pointer',
                boxShadow: 1
            }}
          />
        </Grid2>
        <Grid2 size={8}>
          <Box sx={{ display: 'flex', flexDirection: "column" , gap: 2 }}>
          <Typography color="error">
            {error}
          </Typography>
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
              onClick={() => { handleSave({name: editedName,  description: editedDescription, versionId: version.id} ) }}
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Сохранить
            </Button>
          </Box>
        </Grid2>


        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xl" fullWidth>
          <DialogContent sx={{ position: 'relative', p: 0,  }}>
            <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 8, right: 8,}}>
            x
            </IconButton>
            <img src={version.preview_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
          </DialogContent>
        </Dialog>
      </Grid2>
    )
  }

  const StepOne = ({ handleNext }) => {
    const [file, setFile] = useState(null);
  
    const onFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    return (
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
              Загрузите шаблон
          </Typography>
    
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            >
              Выберите файл
              <input
                type="file"
                hidden
                onChange={onFileChange}
              />
            </Button>
            
            <Typography variant="body1">
              {file ? file.name : "Файл не выбран"}
            </Typography>
          </Box>
    
          <Box sx={{ mt: 3 }}>
            <Button
            variant="contained"
            onClick={() => handleNext(file)}
            disabled={!file}
            >
              Далее
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };


const TemplateUpload = () => {
  const [step, setStep] = useState(0)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(null)

  const {route} = useLocation()

  const uploadFile = async (file) => {
    setStep(1)
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await api.post('/template_versions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const buildResponse = await api.post(`/template_versions/${uploadResponse.data.id}/build`)
      setVersion({id: buildResponse.data.id, preview_url: buildResponse.data.preview_url})
      setStep(2)
    } catch (err) {
      setError(err.message )
    }
  }

  const saveTemplate = async (template) => {
    setError(null)
    try {
      const saveResponse = await api.post('/templates', template)
      route(`/templates/${saveResponse.data.id}/`)
    } catch(err) {
      setError(err.message)
    }
  }

  const handleRetry = () => {
    setStep(0)
    setError(null)
  }

  return (
    <Container>
      <Stepper activeStep={step}>
        {steps.map((label, index) => (
          error != null && step == index
            ? <Step key={label}>
                <StepLabel error={true}>{label}
                </StepLabel>
              </Step>
            :  <Step key={label}>
                <StepLabel>{label}
                </StepLabel>
              </Step>
        ))}
      </Stepper>

      {step === 2 ? (<StepThree version={version} error={error} handleSave={saveTemplate} />) : null }
      {error != null && step != 2 ? (<StepError error={error} handleRetry={handleRetry}/>) : null}
      {error == null && step === 0 ? (<StepOne handleNext={uploadFile} />) : null }

    </Container>
  )
}

export default TemplateUpload