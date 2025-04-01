import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Card, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import carteGriseService from "../../../../../service/camion/carteGriseService";
export default function CarteGriseDialog({ open, onClose }) {
  const [carteGriseData, setCarteGriseData] = React.useState({
    dateMiseEnCirculation: null,
    marque: "",
    genre: "",
    numeroSerie: "",
    couleur: "",
    nombrePlace: "",
    puissanceFiscale: "",
    energie: "",
    proprietaire: "",
    poidsVide: "",
    poidsAutorise: "",
    dateDelivrance: null,
    photoCarteGrise: null,    
  });
  const [photoPreview, setPhotoPreview] = React.useState(null); // For displaying the uploaded photo
  
    
      
      
  // Remove uploaded photo
  const handleRemovePhoto = () => {
    setCarteGriseData({ ...carteGriseData, photoCarteGrise: null });
    setPhotoPreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarteGriseData({ ...carteGriseData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setCarteGriseData({ ...carteGriseData, [name]: newValue });
  };


  
// // Handle photo upload
// const handlePhotoUpload = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     // Create preview for UI display
//     const previewReader = new FileReader();
//     previewReader.onload = (event) => {
//       setPhotoPreview(event.target.result);
//     };
//     previewReader.readAsDataURL(file);
    
//     // Read as ArrayBuffer for backend storage
//     const bufferReader = new FileReader();
//     bufferReader.onload = (event) => {
//       setCarteGriseData({ ...carteGriseData, photoCarteGrise: event.target.result });
//     };
//     bufferReader.readAsArrayBuffer(file);
//   }
// };

// const handleSubmit = () => {  
//   // Convert ArrayBuffer to byte array for backend
//   const dataToSend = {
//     ...carteGriseData,
//     photoCarteGrise: carteGriseData.photoCarteGrise 
//       ? Array.from(new Uint8Array(carteGriseData.photoCarteGrise))
//       : null,
//   };
  
//   onSave(dataToSend); 
//   onClose();
// };

const handlePhotoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (JPEG, PNG)');
    return;
  }
  if (file){

  // Create preview
  const reader = new FileReader();
  reader.onload = (event) => {
    setPhotoPreview(event.target.result);
  };
  reader.readAsDataURL(file);

  // Store the file object
  const bufferReader = new FileReader();
  bufferReader.onload = (event) => {
    setCarteGriseData({ ...carteGriseData, photoCarteGrise: event.target.result });
  }
  bufferReader.readAsArrayBuffer(file);
}
};

const handleSubmit = async() => {
  try {
    // Debug the original photo data
    console.log("Original photo data:", carteGriseData.photoCarteGrise);
    
    const dataToSend = {
      ...carteGriseData,
      photoCarteGrise: carteGriseData.photoCarteGrise
        ? Array.from(new Uint8Array(carteGriseData.photoCarteGrise))  
        : null,
    };
    
    // Debug the converted data
    console.log("Data being sent:", {
      ...dataToSend,
      photoCarteGrise: dataToSend.photoCarteGrise 
        ? `Byte array (${dataToSend.photoCarteGrise.length} bytes)` 
        : null
    });

    const resp = await carteGriseService.create(dataToSend);
    console.log("Response from server:", resp.data);
    
    // Verify if photo was saved
    if (resp.data.photoCarteGrise) {
      console.log("Photo saved successfully on backend");
    } else {
      console.warn("Photo was not saved by backend");
    }
    
    onClose();
  }
  catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    alert("Erreur lors de l'ajout de la carte grise.");
  }
};
  


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter Carte Grise</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Marque" name="marque" value={carteGriseData.marque} onChange={handleInputChange} margin="normal"/>
          <TextField fullWidth label="Genre" name="genre" value={carteGriseData.genre} onChange={handleInputChange} margin="normal"/>
          <TextField fullWidth label="Numéro de Série" name="numeroSerie" value={carteGriseData.numeroSerie} onChange={handleInputChange} margin="normal"/>
          <TextField fullWidth label="Couleur" name="couleur" value={carteGriseData.couleur} onChange={handleInputChange} margin="normal"/>
          <TextField fullWidth label="Nombre de Places" name="nombrePlace" value={carteGriseData.nombrePlace} onChange={handleInputChange} margin="normal" type="number"/>
          <TextField fullWidth label="Puissance Fiscale" name="puissanceFiscale" value={carteGriseData.puissanceFiscale} onChange={handleInputChange} margin="normal"/>
          <TextField fullWidth label="Énergie" name="energie" value={carteGriseData.energie} onChange={handleInputChange} margin="normal"/>
          <TextField fullWidth label="Propriétaire" name="proprietaire" value={carteGriseData.proprietaire} onChange={handleInputChange} margin="normal"/>
          <TextField fullWidth label="Poids à Vide (kg)" name="poidsVide" value={carteGriseData.poidsVide} onChange={handleInputChange} margin="normal" type="number"/>
          <TextField fullWidth label="Poids Autorisé (kg)" name="poidsAutorise" value={carteGriseData.poidsAutorise} onChange={handleInputChange} margin="normal" type="number"/>
          <MobileDatePicker label="Date de Mise en Circulation" value={carteGriseData.dateMiseEnCirculation} onChange={handleDateChange("dateMiseEnCirculation")} renderInput={(params) => (   <TextField {...params} fullWidth margin="normal" /> )}/>
          <MobileDatePicker label="Date de Délivrance" value={carteGriseData.dateDelivrance} onChange={handleDateChange("dateDelivrance")} renderInput={(params) => (   <TextField {...params} fullWidth margin="normal" /> )}/>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Photo du Carburant
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <input
                  accept="image/*"
                  id="photo-carteGrise-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-carteGrise-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                    fullWidth
                  >
                    Télécharger une photo
                  </Button>
                </label>
              </Grid>


              {/* // Afficher l'aperçu de la photo si elle est téléchargée */}
              
              {photoPreview && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ position: 'relative' }}>
                    <Card>
                      <CardMedia
                        component="img"
                        image={photoPreview}
                        alt="Photo de carteGrise"
                        sx={{ 
                          height: 200, 
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                    </Card>
                    <IconButton
                      aria-label="delete"
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                      onClick={handleRemovePhoto}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
