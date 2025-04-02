import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
} from "@mui/material";
import { format } from "date-fns";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import carteGriseService from "../../../../../service/camion/carteGriseService";

export default function ViewCarteGriseDialog({ open, onClose, carteGriseId })  {
  const [carteGriseData, setCarteGriseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarteGriseDetails = async () => {
      if (!carteGriseId || !open) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await carteGriseService.getById(carteGriseId);
        setCarteGriseData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la carte grise:", err);
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchCarteGriseDetails();
  }, [carteGriseId, open]);

  // Default values to prevent runtime errors
  const {
    marque = "",
    genre = "",
    numeroSerie = "",
    couleur = "",
    nombrePlace = "",
    puissanceFiscale = "",
    energie = "",
    proprietaire = "",
    poidsVide = "",
    poidsAutorise = "",
    dateMiseEnCirculation = "",
    dateDelivrance = "",
    photoCarteGrise = null,
  } = carteGriseData || {};

  // Format dates if they exist
  const formattedDateMiseEnCirculation = dateMiseEnCirculation
    ? format(new Date(dateMiseEnCirculation), "dd/MM/yyyy")
    : "N/A";
  
  const formattedDateDelivrance = dateDelivrance
    ? format(new Date(dateDelivrance), "dd/MM/yyyy")
    : "N/A";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "primary.main",
          mb: 2,
        }}
      >
        Détails de la Carte Grise
        <Typography
          variant="subtitle2"
          color="text.secondary"
          textAlign="center"
        >
          Informations complètes sur la carte grise
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {/* Left Column - Carte Grise Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Informations du véhicule
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Marque:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{marque || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Genre:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{genre || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Numéro de série:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{numeroSerie || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Couleur:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{couleur || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Nombre de places:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{nombrePlace || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Puissance fiscale:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{puissanceFiscale || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Énergie:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{energie || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Propriétaire:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{proprietaire || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Poids à vide (kg):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{poidsVide || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Poids autorisé (kg):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{poidsAutorise || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Date mise en circulation:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{formattedDateMiseEnCirculation}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Date délivrance:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{formattedDateDelivrance}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column - Photo */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Document de la carte grise
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: 300
                }}>
                  {photoCarteGrise ? (
                    <Card sx={{ width: '100%', maxHeight: 400, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={`data:image/jpeg;base64,${photoCarteGrise}`}
                        alt="Document de la carte grise"
                        sx={{ 
                          width: '100%',
                          objectFit: 'contain',
                          maxHeight: 400
                        }}
                      />
                    </Card>
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      color: 'text.secondary',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 4,
                      width: '100%'
                    }}>
                      <ImageNotSupportedIcon sx={{ fontSize: 60, mb: 2, opacity: 0.6 }} />
                      <Typography variant="body1">
                        Aucun document disponible
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {photoCarteGrise && (
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => window.open(`data:image/jpeg;base64,${photoCarteGrise}`, '_blank')}
                    sx={{ mt: 2 }}
                  >
                    Voir en plein écran
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ minWidth: 120 }}
          disabled={loading}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};