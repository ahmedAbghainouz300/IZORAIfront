import React, { useState, useEffect } from "react";
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
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { format } from "date-fns";
import entretienService from './../../../../../service/camion/entretienService';

export default function ViewEntretienDialog({ open, onClose, entretienId })  {
  const [entretienData, setEntretienData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntretienDetails = async () => {
      if (!entretienId || !open) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await entretienService.getById(entretienId);
        setEntretienData(response.data);
        console.log("Données de l'entretien:", response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'entretien:", err);
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchEntretienDetails();
  }, [entretienId, open]);

  // Default values to prevent runtime errors
  const {
    dateEntretien = "",
    typeEntretien = "",
    description = "",
    cout = "",
    statusEntretien = "", 
    dateProchainEntretien = "",
    camion = null,
  } = entretienData || {};

  // Format dates if they exist
  const formattedDateEntretien = dateEntretien
    ? format(new Date(dateEntretien), "dd/MM/yyyy")
    : "N/A";
  
  const formattedDateProchainEntretien = dateProchainEntretien
    ? format(new Date(dateProchainEntretien), "dd/MM/yyyy")
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
        Détails de l'Entretien
        <Typography
          variant="subtitle2"
          color="text.secondary"
          textAlign="center"
        >
          Informations complètes sur l'entretien
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
            {/* Left Column - Entretien Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Informations de l'entretien
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Date d'entretien:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{formattedDateEntretien}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Type d'entretien:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Chip label={typeEntretien || "N/A"} color="primary" />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Status d'entretien:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Chip label={statusEntretien   || "N/A"} color="primary" />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Description:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{description || "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Coût (€):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{cout ? `${cout} €` : "N/A"}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Prochain entretien:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{formattedDateProchainEntretien}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column - Camion Info */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Informations du camion
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {camion ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Immatriculation:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{camion.immatriculation || "N/A"}</Typography>
                    </Grid>

                   

                    <Grid item xs={6}>
                      <Typography variant="subtitle2">status:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{camion.status || "N/A"}</Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Aucune information sur le camion</Typography>
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