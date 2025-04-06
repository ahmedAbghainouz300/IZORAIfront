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
import assuranceService from './../../../../../service/camion/assuranceService';

export default function ViewAssuranceDialog({ open, onClose, assuranceId })  {
  const [assuranceData, setAssuranceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssuranceDetails = async () => {
      if (!assuranceId || !open) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await assuranceService.getById(assuranceId);
        setAssuranceData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'assurance:", err);
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchAssuranceDetails();
  }, [assuranceId, open]);

  // Default values to prevent runtime errors
  const {
    numeroContrat = "",
    company = "",
    typeCouverture = "",
    montant = "",
    dateDebut = "",
    dateExpiration = "",
    primeAnnuelle = "",
    numCarteVerte = "",
    photoAssurance = null,
  } = assuranceData || {};

  // Format dates if they exist
  const formattedDateDebut = dateDebut
    ? format(new Date(dateDebut), "dd/MM/yyyy")
    : "N/A";
  
  const formattedDateExpiration = dateExpiration
    ? format(new Date(dateExpiration), "dd/MM/yyyy")
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
        Détails de l'Assurance
        <Typography
          variant="subtitle2"
          color="text.secondary"
          textAlign="center"
        >
          Informations complètes sur l'assurance
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
            {/* Left Column - Assurance Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Informations de l'assurance
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Numéro de contrat:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{numeroContrat || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Compagnie:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{company || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Type de couverture:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{typeCouverture || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Montant:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{montant ? `${montant} €` : "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Date de début:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{formattedDateDebut}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Date d'expiration:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{formattedDateExpiration}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Prime annuelle:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{primeAnnuelle ? `${primeAnnuelle} €` : "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Numéro carte verte:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{numCarteVerte || "N/A"}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column - Photo */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Document d'assurance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: 300
                }}>
                  {photoAssurance ? (
                    <Card sx={{ width: '100%', maxHeight: 400, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={`data:image/jpeg;base64,${photoAssurance}`}
                        alt="Document d'assurance"
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
                
                {photoAssurance && (
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => window.open(`data:image/jpeg;base64,${photoAssurance}`, '_blank')}
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