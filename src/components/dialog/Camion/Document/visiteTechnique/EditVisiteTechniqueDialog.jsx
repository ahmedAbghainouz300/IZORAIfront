import * as React from "react";
import { useState, useEffect } from "react";
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
  Chip,
  Alert
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CloudUpload, AddAPhoto, Delete } from "@mui/icons-material";
import CamionSelect from './../../../../select/CamionSelect';
import visiteTechniqueService from "../../../../../service/camion/visiteTechniqueService";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

export default function VisiteTechniqueEditDialog({ open, onClose, onUpdate, visiteId }) {
  const [visiteData, setVisiteData] = useState({
    id: "",
    centreVisite: "",
    dateVisite: null,
    dateExpiration: null,
    resultatVisite: "",
    observations: "",
    documentUrl: "",
    camion: null,
  });
  const [documentPreview, setDocumentPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isCamionModalOpen, setIsCamionModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedVisiteUpdate, setIsFailedVisiteUpdate] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resultatOptions = [
    { value: "VALIDE", label: "VALIDE" },
    { value: "REFUSE", label: "REFUSE" },
    { value: "A_REVOIR", label: "A_REVOIR" },
  ];

  useEffect(() => {
    if (open && visiteId) {
      fetchVisitData();
    }
  }, [open, visiteId]);

  const fetchVisitData = async () => {
    try {
      // Fetch visit data
      const response = await visiteTechniqueService.getById(visiteId);
      const data = response.data;
      
      // Set basic visit data
      setVisiteData({
        id: data.id,
        centreVisite: data.centreVisite,
        dateVisite: new Date(data.dateVisite),
        dateExpiration: new Date(data.dateExpiration),
        resultatVisite: data.resultatVisite,
        observations: data.observations,
        documentUrl: data.documentUrl,
        camion: data.camion,
      });
  
      // If there's a document URL, try to fetch it for preview
      if (data.documentUrl) {
        try {
          const docResponse = await visiteTechniqueService.getDocument(data.id);
          setDocumentPreview(docResponse.data);
          
          // Store the filename if needed
          setVisiteData(prev => ({
            ...prev,
            documentName: docResponse.filename
          }));
        } catch (docError) {
          console.warn("Could not load document preview:", docError);
          setDocumentPreview(null);
        }
      } else {
        setDocumentPreview(null);
      }
      
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des données de la visite.");
      console.error(err);
    }
  };

  const handleDownloadDocument = async () => {
    try {
      const { data: documentUrl, filename } = 
        await visiteTechniqueService.getDocument(visiteData.id);
      
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(documentUrl);
      }, 100);
    } catch (error) {
      setError("Erreur lors du téléchargement du document.");
      console.error(error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisiteData({ ...visiteData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setVisiteData({ ...visiteData, [name]: newValue });
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError('Seuls les fichiers PDF, JPEG et PNG sont acceptés');
      return;
    }

    if (file.size > maxSize) {
      setError('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    setError(null);
    setFileSelected(file);

    if (file.type.startsWith('image/')) {
      setDocumentPreview(URL.createObjectURL(file));
    } else {
      setDocumentPreview(null);
    }
  };

  const handleRemoveDocument = () => {
    if (visiteData.documentUrl) {
      setVisiteData(prev => ({ ...prev, documentUrl: "" }));
    }
    if (fileSelected) {
      setFileSelected(null);
    }
    setDocumentPreview(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
  
    try {
      if (!visiteData.centreVisite || !visiteData.dateVisite || 
          !visiteData.dateExpiration || !visiteData.camion) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
  
      // Prepare the data to send
      const dataToSend = {
        ...visiteData,
        // Only include documentUrl if we're not uploading a new file
        documentUrl: fileSelected ? undefined : visiteData.documentUrl
      };
  
      await visiteTechniqueService.update(
        visiteData.id,
        dataToSend,
        fileSelected // This will be undefined if no new file was selected
      );
  
      setIsSuccess(true);
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour");
      setIsFailedVisiteUpdate(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFailedVisiteUpdate = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedVisiteUpdate(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setIsSuccess(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Modifier Visite Technique</DialogTitle>
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

          <Box display="flex" justifyContent="space-around" gap="16px">
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
          </Box>

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

          <Grid item xs={12} sx={{ mt: 2 }}>
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
                  {visiteData.documentUrl.match(/\.(jpeg|jpg|png)$/i) ? (
                    <Avatar
                      src={documentPreview}
                      variant="rounded"
                      sx={{ width: '100%', height: 500, mb: 2 }}
                    />
                  ) : (
                    <Box sx={{ 
                      width: '100%', 
                      height: 200, 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Typography variant="h6">PDF Document</Typography>
                      <Button 
                        variant="contained" 
                        onClick={handleDownloadDocument}
                        sx={{ mt: 2 }}
                      >
                        Télécharger
                      </Button>
                    </Box>
                  )}
                  <IconButton
                    onClick={handleRemoveDocument}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'error.dark' }
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <Typography variant="caption" display="block">
                    {visiteData.documentName || visiteData.documentUrl.split('/').pop()}
                  </Typography>
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
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
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
            disabled={!visiteData.centreVisite || !visiteData.dateVisite || 
                     !visiteData.dateExpiration || isSubmitting}
            variant="contained"
          >
            {isSubmitting ? 'En cours...' : 'Mettre à jour'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isFailedVisiteUpdate}
        autoHideDuration={3000}
        onClose={handleCloseFailedVisiteUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedVisiteUpdate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Échec de la mise à jour! Veuillez vérifier les données saisies.
        </MuiAlert>
      </Snackbar>

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
          Visite technique mise à jour avec succès!
        </MuiAlert>
      </Snackbar>
    </LocalizationProvider>
  );
}