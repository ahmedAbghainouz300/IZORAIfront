// import * as React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
// } from "@mui/material";
// import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { Box, Card, CardMedia, Grid, IconButton, Typography } from "@mui/material";
// import carteGriseService from "../../../../../service/camion/carteGriseService";
// export default function CarteGriseDialog({ open, onClose }) {
//   const [carteGriseData, setCarteGriseData] = React.useState({
//     dateMiseEnCirculation: null,
//     marque: "",
//     genre: "",
//     numeroSerie: "",
//     couleur: "",
//     nombrePlace: "",
//     puissanceFiscale: "",
//     energie: "",
//     proprietaire: "",
//     poidsVide: "",
//     poidsAutorise: "",
//     dateDelivrance: null,
//     photoCarteGrise: null,    
//   });
//   const [photoPreview, setPhotoPreview] = React.useState(null); // For displaying the uploaded photo
  
    
      
      
//   // Remove uploaded photo
//   const handleRemovePhoto = () => {
//     setCarteGriseData({ ...carteGriseData, photoCarteGrise: null });
//     setPhotoPreview(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCarteGriseData({ ...carteGriseData, [name]: value });
//   };

//   const handleDateChange = (name) => (newValue) => {
//     setCarteGriseData({ ...carteGriseData, [name]: newValue });
//   };


  
// // // Handle photo upload
// // const handlePhotoUpload = (e) => {
// //   const file = e.target.files[0];
// //   if (file) {
// //     // Create preview for UI display
// //     const previewReader = new FileReader();
// //     previewReader.onload = (event) => {
// //       setPhotoPreview(event.target.result);
// //     };
// //     previewReader.readAsDataURL(file);
    
// //     // Read as ArrayBuffer for backend storage
// //     const bufferReader = new FileReader();
// //     bufferReader.onload = (event) => {
// //       setCarteGriseData({ ...carteGriseData, photoCarteGrise: event.target.result });
// //     };
// //     bufferReader.readAsArrayBuffer(file);
// //   }
// // };

// // const handleSubmit = () => {  
// //   // Convert ArrayBuffer to byte array for backend
// //   const dataToSend = {
// //     ...carteGriseData,
// //     photoCarteGrise: carteGriseData.photoCarteGrise 
// //       ? Array.from(new Uint8Array(carteGriseData.photoCarteGrise))
// //       : null,
// //   };
  
// //   onSave(dataToSend); 
// //   onClose();
// // };

// const handlePhotoUpload = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   // Create preview
//   const previewReader = new FileReader();
//   previewReader.onload = (event) => {
//     setPhotoPreview(event.target.result);
//   };
//   previewReader.readAsDataURL(file);

//   // Read as binary string (simpler approach)
//   const binaryReader = new FileReader();
//   binaryReader.onload = (event) => {
//     // Convert to Uint8Array which is essentially a byte array
//     const arrayBuffer = event.target.result;
//     const bytes = new Uint8Array(arrayBuffer);
//     setCarteGriseData({ 
//       ...carteGriseData, 
//       photoCarteGrise: Array.from(bytes) // Convert to normal array
//     });
//   };
//   binaryReader.readAsArrayBuffer(file);
// };

// const handleSubmit = async () => {
//   try {
//     console.log("Photo data before sending:", carteGriseData.photoCarteGrise);
    
//     const response = await carteGriseService.create(carteGriseData);
//     console.log("Server response:", response.data);
    
//     onClose();
//   } catch (error) {
//     console.error("Error:", error);
//     alert("Erreur lors de l'enregistrement");
//   }
// };
  


//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Dialog open={open} onClose={onClose}>
//         <DialogTitle>Ajouter Carte Grise</DialogTitle>
//         <DialogContent>
//           <TextField fullWidth label="Marque" name="marque" value={carteGriseData.marque} onChange={handleInputChange} margin="normal"/>
//           <TextField fullWidth label="Genre" name="genre" value={carteGriseData.genre} onChange={handleInputChange} margin="normal"/>
//           <TextField fullWidth label="Numéro de Série" name="numeroSerie" value={carteGriseData.numeroSerie} onChange={handleInputChange} margin="normal"/>
//           <TextField fullWidth label="Couleur" name="couleur" value={carteGriseData.couleur} onChange={handleInputChange} margin="normal"/>
//           <TextField fullWidth label="Nombre de Places" name="nombrePlace" value={carteGriseData.nombrePlace} onChange={handleInputChange} margin="normal" type="number"/>
//           <TextField fullWidth label="Puissance Fiscale" name="puissanceFiscale" value={carteGriseData.puissanceFiscale} onChange={handleInputChange} margin="normal"/>
//           <TextField fullWidth label="Énergie" name="energie" value={carteGriseData.energie} onChange={handleInputChange} margin="normal"/>
//           <TextField fullWidth label="Propriétaire" name="proprietaire" value={carteGriseData.proprietaire} onChange={handleInputChange} margin="normal"/>
//           <TextField fullWidth label="Poids à Vide (kg)" name="poidsVide" value={carteGriseData.poidsVide} onChange={handleInputChange} margin="normal" type="number"/>
//           <TextField fullWidth label="Poids Autorisé (kg)" name="poidsAutorise" value={carteGriseData.poidsAutorise} onChange={handleInputChange} margin="normal" type="number"/>
//           <MobileDatePicker label="Date de Mise en Circulation" value={carteGriseData.dateMiseEnCirculation} onChange={handleDateChange("dateMiseEnCirculation")} renderInput={(params) => (   <TextField {...params} fullWidth margin="normal" /> )}/>
//           <MobileDatePicker label="Date de Délivrance" value={carteGriseData.dateDelivrance} onChange={handleDateChange("dateDelivrance")} renderInput={(params) => (   <TextField {...params} fullWidth margin="normal" /> )}/>

//           <Box sx={{ mt: 2, mb: 2 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Photo du Carburant
//             </Typography>
            
//             <Grid container spacing={2} alignItems="center">
//             {!photoPreview && (
//               <Grid item xs={12} md={6}>
//                 <input
//                   accept="image/*"
//                   id="photo-carteGrise-upload"
//                   type="file"
//                   style={{ display: 'none' }}
//                   onChange={handlePhotoUpload}
//                 />
//                 <label htmlFor="photo-carteGrise-upload">
//                   <Button
//                     variant="contained"
//                     component="span"
//                     startIcon={<PhotoCameraIcon />}
//                     fullWidth
//                   >
//                     Télécharger une photo
//                   </Button>
//                 </label>
//               </Grid>
//             )}


//               {/* // Afficher l'aperçu de la photo si elle est téléchargée */}
              
//               {photoPreview && (
//                 <Grid item xs={12} md={10}>
//                   <Box sx={{ position: 'relative' }}>
//                     <Card>
//                       <CardMedia
//                         component="img"
//                         image={photoPreview}
//                         alt="Photo de carteGrise"
//                         sx={{ 
//                           height: 200, 
//                           objectFit: 'cover',
//                           borderRadius: 1
//                         }}
//                       />
//                     </Card>
//                     <IconButton
//                       aria-label="delete"
//                       sx={{
//                         position: 'absolute',
//                         top: 5,
//                         right: 5,
//                         bgcolor: 'rgba(255, 255, 255, 0.7)',
//                         '&:hover': {
//                           bgcolor: 'rgba(255, 255, 255, 0.9)',
//                         },
//                       }}
//                       onClick={handleRemovePhoto}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </Box>
//                 </Grid>
//               )}
//             </Grid>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Annuler</Button>
//           <Button onClick={handleSubmit}>Enregistrer</Button>
//         </DialogActions>
//       </Dialog>
//     </LocalizationProvider>
//   );
// }

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Avatar
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CloudUpload, Delete, AddAPhoto } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import carteGriseService from "../../../../../service/camion/carteGriseService";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CarteGriseDialog({ open, onClose, onSuccess }) {
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
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleRemovePhoto = () => {
    setCarteGriseData(prev => ({ ...prev, photoCarteGrise: null }));
    setPhotoPreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarteGriseData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (newValue) => {
    setCarteGriseData(prev => ({ ...prev, [name]: newValue }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.match('image.*')) {
      setError("Veuillez sélectionner un fichier image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      setError("La taille de l'image ne doit pas dépasser 5MB");
      return;
    }

    try {
      // Créer l'aperçu
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);

      // Convertir en base64 pour le backend
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setCarteGriseData(prev => ({
        ...prev,
        photoCarteGrise: base64String
      }));
      setError(null);
    } catch (err) {
      setError("Erreur lors du traitement de l'image");
      console.error(err);
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation des champs requis
      if (!carteGriseData.marque || !carteGriseData.numeroSerie) {
        throw new Error("Les champs marque et numéro de série sont obligatoires");
      }

      const payload = {
        ...carteGriseData,
        dateMiseEnCirculation: carteGriseData.dateMiseEnCirculation?.toISOString(),
        dateDelivrance: carteGriseData.dateDelivrance?.toISOString()
      };

      const response = await carteGriseService.create(payload);
      
      // Appel conditionnel de onSuccess
      if (typeof onSuccess === 'function') {
        onSuccess(response.data);
      }
      
      onClose();
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'primary.main'
          }}
        >
          Ajouter une Carte Grise
        </DialogTitle>
        
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Marque"
                name="marque"
                value={carteGriseData.marque}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                required
              />
              
              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={carteGriseData.genre}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Numéro de Série"
                name="numeroSerie"
                value={carteGriseData.numeroSerie}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                required
              />
              
              <TextField
                fullWidth
                label="Couleur"
                name="couleur"
                value={carteGriseData.couleur}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Nombre de Places"
                name="nombrePlace"
                value={carteGriseData.nombrePlace}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Puissance Fiscale"
                name="puissanceFiscale"
                value={carteGriseData.puissanceFiscale}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Énergie"
                name="energie"
                value={carteGriseData.energie}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Propriétaire"
                name="proprietaire"
                value={carteGriseData.proprietaire}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Poids à Vide (kg)"
                name="poidsVide"
                value={carteGriseData.poidsVide}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Poids Autorisé (kg)"
                name="poidsAutorise"
                value={carteGriseData.poidsAutorise}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date de Mise en Circulation"
                value={carteGriseData.dateMiseEnCirculation}
                onChange={handleDateChange("dateMiseEnCirculation")}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" variant="outlined" />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date de Délivrance"
                value={carteGriseData.dateDelivrance}
                onChange={handleDateChange("dateDelivrance")}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" variant="outlined" />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  }
                }}
              >
                {photoPreview ? (
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={photoPreview}
                      variant="rounded"
                      sx={{
                        width: '100%',
                        height: 200,
                        mb: 2
                      }}
                    />
                    <IconButton
                      onClick={handleRemovePhoto}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'error.dark',
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <CloudUpload fontSize="large" color="action" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Glissez-déposez la photo de la carte grise ou
                    </Typography>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<AddAPhoto />}
                      sx={{ mt: 1 }}
                    >
                      Sélectionner une image
                      <VisuallyHiddenInput 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                      />
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Formats supportés: JPEG, PNG (Max. 5MB)
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}