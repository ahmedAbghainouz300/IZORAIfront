import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  LocationOn,
  Edit,
  DirectionsCar,
  LocalShipping,
  Person,
} from "@mui/icons-material";
import voyageService from "../../../service/voyage/voyageService";
import { useSnackbar } from "notistack";
import EditVoyageDialog from "./EditVoyageDialog";

const statusColors = {
  PLANIFIE: { bgcolor: "#BBDEFB", color: "#0D47A1" },
  EN_COURS: { bgcolor: "#B3E5FC", color: "#01579B" },
  TERMINE: { bgcolor: "#C8E6C9", color: "#1B5E20" },
  ANNULE: { bgcolor: "#FFCDD2", color: "#C62828" },
  EN_INCIDENT: { bgcolor: "#FFECB3", color: "#FF8F00" },
};

export default function ViewVoyageDialog({ open, onClose, voyageId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (open && voyageId) {
      const fetchVoyage = async () => {
        try {
          setLoading(true);
          const response = await voyageService.getById(voyageId);
          setVoyage(response.data);
        } catch (error) {
          enqueueSnackbar("Erreur lors du chargement du voyage", {
            variant: "error",
          });
          console.error("Error fetching voyage:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVoyage();
    }
  }, [open, voyageId, enqueueSnackbar]);

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatAddress = (address) => {
    if (!address) return "Non spécifiée";
    return typeof address === "string"
      ? address
      : `${address.rue}, ${address.codePostal} ${address.ville}, ${address.pays}`;
  };

  const formatResource = (resource) => {
    if (!resource) return "Non spécifié";
    if (resource.nom && resource.prenom)
      return `${resource.nom} ${resource.prenom}`;
    if (resource.marque && resource.modele)
      return `${resource.marque} ${resource.modele} (${resource.immatriculation})`;
    if (resource.type) return `${resource.type} (${resource.immatriculation})`;
    return "Ressource inconnue";
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleSaveSuccess = (updatedVoyage) => {
    setVoyage(updatedVoyage);
    enqueueSnackbar("Voyage mis à jour avec succès", { variant: "success" });
    setEditDialogOpen(false);
  };

  const calculateProgress = () => {
    if (!voyage || !voyage.dateDepart || !voyage.dateArrivePrevue) return 0;

    const start = new Date(voyage.dateDepart).getTime();
    const end = new Date(voyage.dateArrivePrevue).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > end) return 100;

    return Math.round(((now - start) / (end - start)) * 100);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            Détails du Voyage
            {voyage && (
              <Chip
                label={voyage.etat}
                sx={{
                  ml: 2,
                  color: statusColors[voyage.etat]?.color || "white",
                  backgroundColor:
                    statusColors[voyage.etat]?.bgcolor || "#9E9E9E",
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>

          {voyage && voyage.etat === "PLANIFIE" && (
            <Tooltip title="Modifier ce voyage">
              <IconButton
                onClick={handleEditClick}
                sx={{ color: "white" }}
                size="large"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography>Chargement en cours...</Typography>
            </Box>
          ) : voyage ? (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Informations Générales
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              sx={{ fontWeight: "bold", width: "30%" }}
                            >
                              ID
                            </TableCell>
                            <TableCell>{voyage.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Date de départ
                            </TableCell>
                            <TableCell>
                              {formatDate(voyage.dateDepart)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Date d'arrivée prévue
                            </TableCell>
                            <TableCell>
                              {formatDate(voyage.dateArrivePrevue)}
                            </TableCell>
                          </TableRow>
                          {voyage.dateArriveReelle && (
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Date d'arrivée réelle
                              </TableCell>
                              <TableCell>
                                {formatDate(voyage.dateArriveReelle)}
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Distance
                            </TableCell>
                            <TableCell>{voyage.distance} km</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Statut
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={voyage.etat}
                                sx={{
                                  color:
                                    statusColors[voyage.etat]?.color || "white",
                                  backgroundColor:
                                    statusColors[voyage.etat]?.bgcolor ||
                                    "#9E9E9E",
                                  fontWeight: "bold",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Urgent
                            </TableCell>
                            <TableCell>
                              {voyage.estUrgent ? "Oui" : "Non"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Fragile
                            </TableCell>
                            <TableCell>
                              {voyage.estFragile ? "Oui" : "Non"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Progress Bar for ongoing voyages */}
              {voyage.etat === "EN_COURS" && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Progression du voyage
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          {calculateProgress()}% complété
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress()}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mt={1}
                        >
                          <Typography variant="caption">
                            Départ: {formatDate(voyage.dateDepart)}
                          </Typography>
                          <Typography variant="caption">
                            Arrivée prévue:{" "}
                            {formatDate(voyage.dateArrivePrevue)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Addresses Section */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lieu de départ
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" alignItems="center">
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography>
                        {formatAddress(voyage.lieuDepart)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lieu d'arrivée
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" alignItems="center">
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography>
                        {formatAddress(voyage.lieuArrive)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Resources Section */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                      Chauffeur
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>{formatResource(voyage.chaufeur)}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <DirectionsCar sx={{ verticalAlign: "middle", mr: 1 }} />
                      Camion
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>{formatResource(voyage.camion)}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <LocalShipping sx={{ verticalAlign: "middle", mr: 1 }} />
                      Remorque
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>{formatResource(voyage.remorque)}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Marchandises Section */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Marchandises transportées
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {voyage.listMarchandises.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableBody>
                            {voyage.listMarchandises.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  {item.marchandise?.nom ||
                                    "Marchandise inconnue"}
                                </TableCell>
                                <TableCell>
                                  {item.qte} {item.marchandise?.unite || ""}
                                </TableCell>
                                <TableCell>
                                  {item.marchandise?.description ||
                                    "Aucune description"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucune marchandise enregistrée pour ce voyage
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography>Aucune donnée disponible</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      {voyage && (
        <EditVoyageDialog
          open={editDialogOpen}
          onClose={handleEditClose}
          voyageId={voyage.id}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  );
}
