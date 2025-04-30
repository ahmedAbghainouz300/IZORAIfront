import * as React from "react";
import { useState,useEffect } from "react";
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
  MenuItem,
  FormControl,
  Chip,
  
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CloudUpload, AddAPhoto, Delete } from "@mui/icons-material";
import CamionSelect from './../../../../select/CamionSelect';
import visiteTechniqueService from "../../../../../service/camion/visiteTechniqueService";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


export default function VisiteTechniqueDialog({ open, onClose, onCreate }) {
  const [visiteData, setVisiteData] = React.useState({
    centreVisite: "",
    dateVisite: null,
    dateExpiration: null,
    resultatVisite: "",
    observations: "",
    documentUrl: "",
    camion: null,
  });
  const [documentPreview, setDocumentPreview] = React.useState(null);
  const [error, setError] = React.useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
  
  const [isCamionModalOpen, setIsCamionModalOpen] = React.useState(false);
  const [fileSelected, setFileSelected] = React.useState(null);
  const [isFailedVisiteCreate, setIsFailedVisiteCreate] = React.useState(false);

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

  const resultatOptions = [
    { value: "VALIDE", label: "VALIDE" },
    { value: "REFUSE", label: "REFUSE" },
    { value: "A_REVOIR", label: "A_REVOIR" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisiteData({ ...visiteData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setVisiteData({ ...visiteData, [name]: newValue });
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
   setFileSelected(file);
    // Generate preview URL for images
  if (file) {
    if (file.type.startsWith('image/')) {
      setDocumentPreview(URL.createObjectURL(file)); // Image preview
    } else {
      setDocumentPreview(null); // No preview for non-images (PDF, etc.)
    }
    };
  }

  const handleRemoveDocument = () => {
    setFileSelected(null);
    setDocumentPreview(null);
  };
  

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!visiteData.centreVisite || !visiteData.dateVisite || !visiteData.dateExpiration || !visiteData.camion) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      console.log("Submitting:", { visiteData, fileSelected });
      
      const response = await visiteTechniqueService.create(visiteData, fileSelected);
      console.log("Response:", response);
      
      if (response.data) {
        setIsSuccess(true);
        onClose(); // Close dialog on success
        onCreate(); // Refresh parent component
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Erreur lors de la création");
      setIsFailedVisiteCreate(true);
    }
  };

  const handleCloseFailedVisiteCreate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedVisiteCreate(false);
  };

  
  // Close Success message
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
  };



  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Ajouter Visite Technique</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Centre de visite"
            name="centreVisite"
            value={visiteData.centreVisite}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <div style={{ display: "flex", justifyContent: "space-around", gap: "16px" }}>
            <MobileDatePicker
              label="Date de visite"
              value={visiteData.dateVisite}
              onChange={handleDateChange("dateVisite")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
            />
            <MobileDatePicker
              label="Date d'expiration"
              value={visiteData.dateExpiration}
              onChange={handleDateChange("dateExpiration")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" required />
              )}
            />
          </div>

          <TextField
            select
            fullWidth
            label="Résultat de la visite"
            name="resultatVisite"
            value={visiteData.resultatVisite}
            onChange={handleInputChange}
            margin="normal"
          >
            {resultatOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Observations"
            name="observations"
            value={visiteData.observations}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
          />

          <Grid item xs={12}>
              <TextField
                value={
                  visiteData.camion
                    ? `${visiteData.camion.immatriculation} - ${visiteData.camion.typeCabine}`
                    : ""
                }
                InputProps={{
                  readOnly: true,
                  endAdornment: visiteData.camion && (
                    <Chip 
                      label="Sélectionné" 
                      color="success" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  ),
                }}
                label="Camion *"
                onClick={() => setIsCamionModalOpen(true)}
                fullWidth
                variant="outlined"
                required
                error={!visiteData.camion}
                helperText={!visiteData.camion && "Ce champ est requis"}
              />
              <Button
                variant="outlined"
                onClick={() => setIsCamionModalOpen(true)}
                sx={{ mt: 1 }}
                startIcon={<AddAPhoto />}
              >
                Sélectionner un Camion
              </Button>
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
              {documentPreview ? (
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={documentPreview}
                    variant="rounded"
                    sx={{
                      width: '100%',
                      height: 200,
                      mb: 2
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveDocument}
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
              ) : visiteData.documentUrl ? (
                <Box sx={{ position: 'relative' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Document PDF téléchargé
                  </Typography>
                  <IconButton
                    onClick={handleRemoveDocument}
                    sx={{
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
                    Glissez-déposez le rapport de visite ou
                  </Typography>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<AddAPhoto />}
                    sx={{ mt: 1 }}
                  >
                    Sélectionner un document
                    <VisuallyHiddenInput 
                      type="file" 
                      accept="image/*,application/pdf" 
                      onChange={handleDocumentUpload} 
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Formats supportés: PDF, JPEG, PNG (Max. 5MB)
                  </Typography>
                </>
              )}
            </Box>
          </Grid>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <CamionSelect
            open={isCamionModalOpen}
            onClose={() => setIsCamionModalOpen(false)}
            onSelect={(camion) => {
              setVisiteData((prev) => ({ ...prev, camion }));
              setIsCamionModalOpen(false);
            }}
          />

            
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!visiteData.centreVisite || !visiteData.dateVisite || !visiteData.dateExpiration}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={isFailedVisiteCreate}
        autoHideDuration={3000}
        onClose={handleCloseFailedVisiteCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedVisiteCreate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to create visite technique! Verify the entered data.
        </MuiAlert>
      </Snackbar>
      {/* Success Snackbar */}
            <Snackbar
              open={isSuccess}
              autoHideDuration={3000}
              onClose={handleCloseSuccess}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <MuiAlert
                onClose={handleCloseSuccess}
                severity="success"
                sx={{ width: "100%" }}
              >
                Operation successful!
              </MuiAlert>
            </Snackbar>
    </LocalizationProvider>
  );
}