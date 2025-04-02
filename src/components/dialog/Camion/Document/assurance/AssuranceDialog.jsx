import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Avatar,
  Typography,
  Box,
  Grid,
  styled,
  
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CloudUpload, AddAPhoto, Delete } from "@mui/icons-material";

export default function AssuranceDialog({ open, onClose, onSave }) {
  const [assuranceData, setAssuranceData] = React.useState({
    numeroContrat: "",
    company: "",
    typeCouverture: "",
    montant: "",
    dateDebut: null,
    dateExpiration: null,
    primeAnnuelle: "",
    numCarteVerte: "",
    statutCarteVerte: "",
    photoAssurance: null,
  });
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [error, setError] = React.useState(null);

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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssuranceData({ ...assuranceData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setAssuranceData({ ...assuranceData, [name]: newValue });
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

      setAssuranceData(prev => ({
        ...prev,
        photoAssurance: base64String
      }));
      setError(null);
    } catch (err) {
      setError("Erreur lors du traitement de l'image");
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...assuranceData,
    };
    console.log(payload);
    onSave(payload);
  };
  
  const handleRemovePhoto = () => {
    setAssuranceData(prev => ({ ...prev, photoAssurance: null }));
    setPhotoPreview(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter Assurance</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Numero de contrat"
            name="numeroContrat"
            value={assuranceData.numeroContrat}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={assuranceData.company}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Type de couverture"
            name="typeCouverture"
            value={assuranceData.typeCouverture}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Montant"
            name="montant"
            value={assuranceData.montant}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <MobileDatePicker
              label="Date debut"
              value={assuranceData.dateDebut}
              onChange={handleDateChange("dateDebut")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
            <MobileDatePicker
              label="Date expiration"
              value={assuranceData.dateExpiration}
              onChange={handleDateChange("dateExpiration")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </div>
          <TextField
            fullWidth
            label="Prime annuelle"
            name="primeAnnuelle"
            value={assuranceData.primeAnnuelle}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />

          <TextField
            fullWidth
            label="numero de la carte verte"
            name="numCarteVerte"
            value={assuranceData.numCarteVerte}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="statut de la carte verte"
            name="statutCarteVerte"
            value={assuranceData.statutCarteVerte}
            onChange={handleInputChange}
            margin="normal"
          />

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

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
