
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Box,
  Typography,
  IconButton,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import { CloudUpload, Delete, AddAPhoto } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { styled } from "@mui/material/styles";
import camionService from "../../../../../service/camion/camionService";
import TypeCarburantSelect from "../../../../select/TypeCarburantSelect";
import StationSelect from "../../../../select/StationSelect";
import carburantService from './../../../../../service/camion/carburantService';

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

export default function CarburantDialog({ open, onClose, onCreate }) {
  const [carburantData, setCarburantData] = React.useState({
    dateRemplissage: new Date(),
    quantiteLitres: "",
    prixParLitre: "",
    kilometrageActuel: "",
    typeCarburant: null,
    camion: null,
    station: null,
    photoCarburant: null,
  });

  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [camionFilter, setCamionFilter] = React.useState("");
  const [camionData, setCamionData] = React.useState([]);
  const [isCamionModalOpen, setIsCamionModalOpen] = React.useState(false);
  const [isTypeCarburantModalOpen, setIsTypeCarburantModalOpen] = React.useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [lastKilometrage, setLastKilometrage] = React.useState(null);

  React.useEffect(() => {
    fetchCamions();
  }, []);

  const fetchCamions = async () => {
    try {
      const response = await camionService.getAll();
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setCamionData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des camions:", error);
      setError("Erreur lors du chargement des camions");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Mettre à jour l'état pour tous les champs
    setCarburantData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (newValue) => {
    setCarburantData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSelectCamion =  async (camion) => {
    setCarburantData(prev => ({ ...prev, camion }));
    setIsCamionModalOpen(false);
    const response = await carburantService.getLastKilometrage(camion.immatriculation);
    const dernierKilometrage = response.data;
    setLastKilometrage(response.data);
    setCarburantData(prev => ({ ...prev, kilometrageActuel: dernierKilometrage }));

  };

  const handleSelectTypeCarburant = (typeCarburant) => {
    setCarburantData(prev => ({ ...prev, typeCarburant }));
    setIsTypeCarburantModalOpen(false);
  };

  const handleSelectStation = (station) => {
    setCarburantData(prev => ({ ...prev, station }));
    setIsStationModalOpen(false); 
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError("Veuillez sélectionner un fichier image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La taille de l'image ne doit pas dépasser 5MB");
      return;
    }

    try {
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);

      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setCarburantData(prev => ({
        ...prev,
        photoCarburant: base64String
      }));
      setError(null);
    } catch (err) {
      setError("Erreur lors du traitement de l'image");
      console.error(err);
    }
  };

  const handleRemovePhoto = () => {
    setCarburantData(prev => ({ ...prev, photoCarburant: null }));
    setPhotoPreview(null);
  };

  const filteredCamions = camionData.filter((camion) => {
    const searchString = camionFilter.toLowerCase();
    return (
      camion.immatriculation?.toLowerCase().includes(searchString) ||
      camion.typeCamion?.toLowerCase().includes(searchString) ||
      String(camion.kilometrageActuel)?.toLowerCase().includes(searchString)
    );
  });
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      const requiredFields = {
        dateRemplissage: "La date de remplissage est requise",
        quantiteLitres: "La quantité est requise",
        prixParLitre: "Le prix par litre est requis",
        kilometrageActuel: "Le kilométrage est requis",
        typeCarburant: "Le type de carburant est requis",
        camion: "Le camion est requis"
      };
  
      for (const [field, message] of Object.entries(requiredFields)) {
        if (!carburantData[field]) {
          throw new Error(message);
        }
      }
  
      // Convertir en nombre pour la comparaison
      const kilometrageSaisi = parseFloat(carburantData.kilometrageActuel);
      const dernierKm = parseFloat(lastKilometrage);
  
      if (lastKilometrage !== null && kilometrageSaisi <= dernierKm) {
        throw new Error(`Le kilométrage actuel (${kilometrageSaisi}) doit être supérieur au dernier enregistré (${dernierKm})`);
      }
  
      const dataCarburant = {
        ...carburantData,
        dateRemplissage: carburantData.dateRemplissage.toISOString(),
        kilometrageActuel: kilometrageSaisi // S'assurer que c'est un nombre
      };
  
      const response = await carburantService.create(dataCarburant);
      
      if (typeof onCreate === 'function') {
        onCreate(response.data);
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création du carburant:", error);
      setError(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCarburantData({
      dateRemplissage: null,
      quantiteLitres: "",
      prixParLitre: "",
      kilometrageActuel: "",
      typeCarburant: null,
      camion: null,
      station: null,
      photoCarburant: null,
    });
    setPhotoPreview(null);
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
            color: 'primary.main',
            mb: 2
          }}
        >
          Ajouter Carburant
          <Typography variant="subtitle2" color="text.secondary" textAlign="center">
            Remplissez les informations sur le carburant
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date de Remplissage *"
                value={carburantData.dateRemplissage}
                onChange={handleDateChange("dateRemplissage")}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    required
                  />
                )}
              />

            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantité (Litres) *"
                name="quantiteLitres"
                value={carburantData.quantiteLitres}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prix par Litre *"
                name="prixParLitre"
                value={carburantData.prixParLitre}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Kilométrage Actuel *"
                name="kilometrageActuel"
                value={carburantData.kilometrageActuel}
                onChange={handleInputChange}
                margin="normal"
                // type="number"
                variant="outlined"
                required
                disabled={!carburantData.camion}
                helperText={!carburantData.camion ? "Veuillez d'abord sélectionner un camion" : ""}


                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <TextField
                  value={carburantData.typeCarburant?.type || ""}
                  InputProps={{
                    readOnly: true,
                    endAdornment: carburantData.typeCarburant && (
                      <Chip 
                        label="Sélectionné" 
                        color="success" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    ),
                  }}
                  label="Type de Carburant *"
                  onClick={() => setIsTypeCarburantModalOpen(true)}
                  fullWidth
                  variant="outlined"
                  required
                  error={!carburantData.typeCarburant}
                  helperText={!carburantData.typeCarburant && "Ce champ est requis"}
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsTypeCarburantModalOpen(true)}
                  sx={{ mt: 1 }}
                  startIcon={<AddAPhoto />}
                >
                  Sélectionner un Type
                </Button>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <TextField
                  value={carburantData.station?.name || ""}
                  InputProps={{
                    readOnly: true,
                    endAdornment: carburantData.station && (
                      <Chip 
                        label="Sélectionné" 
                        color="success" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    ),
                  }}
                  label="Station"
                  onClick={() => setIsStationModalOpen(true)}
                  fullWidth
                  variant="outlined"
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsStationModalOpen(true)}
                  sx={{ mt: 1 }}
                  startIcon={<AddAPhoto />}
                >
                  Sélectionner une Station
                </Button>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <TextField
                  value={
                    carburantData.camion
                      ? `${carburantData.camion.immatriculation} - ${carburantData.camion.typeCabine}`
                      : ""
                  }
                  InputProps={{
                    readOnly: true,
                    endAdornment: carburantData.camion && (
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
                  error={!carburantData.camion}
                  helperText={!carburantData.camion && "Ce champ est requis"}
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsCamionModalOpen(true)}
                  sx={{ mt: 1 }}
                  startIcon={<AddAPhoto />}
                >
                  Sélectionner un Camion
                </Button>
              </FormControl>
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
                      Glissez-déposez la photo du carburant ou
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

            {/* Camion Selection Modal */}
            <Dialog
              open={isCamionModalOpen}
              onClose={() => setIsCamionModalOpen(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  p: 2
                }
              }}
            >
              <DialogTitle 
                sx={{ 
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Sélectionner un Camion
              </DialogTitle>
              <DialogContent dividers>
                <TextField
                  fullWidth
                  label="Rechercher un camion"
                  value={camionFilter}
                  onChange={(e) => setCamionFilter(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Grid container spacing={2}>
                    {filteredCamions.map((camion) => (
                      <Grid item xs={12} key={camion.immatriculation}>
                        <Box
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: carburantData.camion?.immatriculation === camion.immatriculation 
                              ? 'primary.main' 
                              : 'divider',
                            borderRadius: 1,
                            backgroundColor: carburantData.camion?.immatriculation === camion.immatriculation 
                              ? 'primary.light' 
                              : 'background.paper',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            }
                          }}
                          onClick={() => handleSelectCamion(camion)}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {camion.immatriculation}
                          </Typography>
                          <Typography variant="body2">
                            Marque: {camion.typeCabine}
                          </Typography>
                          <Typography variant="body2">
                            Poids Max: {camion.poidsMax}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button 
                  onClick={() => setIsCamionModalOpen(false)} 
                  variant="outlined"
                >
                  Fermer
                </Button>
              </DialogActions>
            </Dialog>

          {/* TypeCarburant Selection Modal */}
          <TypeCarburantSelect
            open={isTypeCarburantModalOpen}
            onClose={() => setIsTypeCarburantModalOpen(false)}
            onSelect={handleSelectTypeCarburant}
          />

          {/* Station Selection Modal */}
          <StationSelect
            open={isStationModalOpen}
            onClose={() => setIsStationModalOpen(false)}
            onSelect={handleSelectStation}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            disabled={isLoading}
            sx={{ mr: 2 }}
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