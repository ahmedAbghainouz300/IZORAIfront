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
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import carburantService from "../../../../../service/camion/carburantService";

const ViewCarburantDialog = ({ open, onClose, carburantId }) => {
  const [carburantData, setCarburantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarburantDetails = async () => {
      if (!carburantId || !open) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await carburantService.getById(carburantId);
        setCarburantData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du carburant:", err);
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchCarburantDetails();
  }, [carburantId, open]);

  // Default values to prevent runtime errors
  const {
    dateRemplissage = "",
    quantiteLitres = "",
    prixParLitre = "",
    kilometrageActuel = "",
    typeCarburant = null,
    camion = null,
    station = null,
    photoCarburant = null,
  } = carburantData || {};

  // Format date if it exists
  const formattedDate = dateRemplissage
    ? format(new Date(dateRemplissage), "dd/MM/yyyy HH:mm")
    : "N/A";

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
          Détails du Carburant
          <Typography
            variant="subtitle2"
            color="text.secondary"
            textAlign="center"
          >
            Informations complètes sur le carburant
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
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Informations de base
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Date de remplissage:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{formattedDate}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Quantité (L):</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{quantiteLitres || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Prix par litre (€):</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{prixParLitre || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Kilométrage actuel:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>{kilometrageActuel || "N/A"}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Vehicle and Fuel Type */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Véhicule et Type
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Type de carburant:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {typeCarburant ? (
                        <Chip
                          label={typeCarburant.type}
                          color="primary"
                          size="small"
                        />
                      ) : (
                        "N/A"
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Camion:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {camion ? (
                        <>
                          <Typography>
                            {camion.immatriculation || "N/A"}
                          </Typography>
                          <Typography variant="caption">
                            {camion.typeCabine || ""}
                          </Typography>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Station:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {station ? (
                        <Chip label={station.name} color="secondary" size="small" />
                      ) : (
                        "N/A"
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Photo Section */}
              {photoCarburant && (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      Photo
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Avatar
                        src={`data:image/jpeg;base64,${photoCarburant}`}
                        variant="rounded"
                        sx={{
                          width: "100%",
                          maxWidth: 400,
                          height: "auto",
                          maxHeight: 300,
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              )}
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
    </LocalizationProvider>
  );
};

export default ViewCarburantDialog;