import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Avatar,
  Paper,
  Grid,
  Tooltip,
  Badge,
  TextField,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  DirectionsBoat,
  Edit,
  Delete,
  Visibility,
  CalendarToday,
  Timeline,
  FilterList,
  Add,
  MoreVert,
  CheckCircle,
  Warning as WarningIcon,
  Cancel,
  Pending,
  Directions,
  DateRange,
  LocalShipping,
  SyncAlt,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { styled } from "@mui/material/styles";
import voyageService from "../../service/voyage/voyageService";
import ViewVoyageDialog from "../../components/dialog/voyage/ViewVoyageDialog";
import EditVoyageDialog from "../../components/dialog/voyage/EditVoyageDialog";
import VoyageDialog from "../../components/dialog/voyage/VoyageDialog";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EtatVoyageComponent from "../../components/dialog/voyage/EtatVoyageDialog";
import VoyageWarningsDialog from "../../components/dialog/voyage/VoyageWarningsDialog";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

// Styled components
const StatusBadge = styled(Badge)(({ theme, status }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: getStatusColor(status).bgcolor,
    color: getStatusColor(status).color,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

const WarningCard = styled(Card)(({ theme, status }) => {
  const statusColor = getStatusColor(status).bgcolor;
  return {
    position: "relative",
    borderLeft: `4px solid ${statusColor}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
    '&[data-haswarnings="true"]': {
      borderLeftColor: "#ff3d00",
      backgroundColor: "rgba(255, 61, 0, 0.1)",
      borderTop: "1px solid rgba(255, 61, 0, 0.2)",
      borderBottom: "1px solid rgba(255, 61, 0, 0.2)",
      animation: "pulse 2s infinite",
      "&:hover": {
        backgroundColor: "rgba(255, 61, 0, 0.15)",
        boxShadow: `0 0 0 2px ${theme.palette.error.main}`,
      },
    },
    "@keyframes pulse": {
      "0%": { boxShadow: "0 0 0 0 rgba(255, 61, 0, 0.4)" },
      "70%": { boxShadow: "0 0 0 7px rgba(255, 61, 0, 0)" },
      "100%": { boxShadow: "0 0 0 0 rgba(255, 61, 0, 0)" },
    },
  };
});

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
}));

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case "PLANIFIE":
      return { bgcolor: "#4a6baf", color: "#ffffff", icon: <Pending /> };
    case "EN_COURS":
      return { bgcolor: "#2e7d32", color: "#ffffff", icon: <Directions /> };
    case "TERMINE":
      return { bgcolor: "#1565c0", color: "#ffffff", icon: <CheckCircle /> };
    case "ANNULE":
      return { bgcolor: "#000", color: "#ffffff", icon: <Cancel /> };
    case "EN_INCIDENT":
      return { bgcolor: "#ff8f00", color: "#ffffff", icon: <WarningIcon /> };
    default:
      return { bgcolor: "#9e9e9e", color: "#ffffff", icon: <MoreVert /> };
  }
};

const formatDate = (dateString) => {
  return format(parseISO(dateString), "dd MMM yyyy", { locale: fr });
};

function Voyage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [etatDialogOpen, setEtatDialogOpen] = useState(false);
  const [selectedVoyageForEtat, setSelectedVoyageForEtat] = useState(null);
  const [warningsDialogOpen, setWarningsDialogOpen] = useState(false);
  const [selectedVoyageWarnings, setSelectedVoyageWarnings] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voyageToDelete, setVoyageToDelete] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedVoyagesFetch, setIsFailedVoyagesFetch] = useState(false);
  const [isFailedVoyageDelete, setIsFailedVoyageDelete] = useState(false);
  const [isFailedVoyageUpdate, setIsFailedVoyageUpdate] = useState(false);
  const [isFailedVoyageCreate, setIsFailedVoyageCreate] = useState(false);
  const [isFailedEtatChange, setIsFailedEtatChange] = useState(false);

  const fetchVoyages = async () => {
    try {
      let response;
      if (statusFilter === "TOUS") {
        response = await voyageService.getAll();
      } else {
        response = await voyageService.getByStatus(statusFilter);
      }

      const voyagesWithWarnings = await Promise.all(
        response.data.map(async (voyage) => {
          try {
            const warningResponse = await voyageService.checkWarnings(
              voyage.id
            );
            return { ...voyage, warnings: warningResponse.data };
          } catch (error) {
            return { ...voyage, warnings: [] };
          }
        })
      );

      setRows(voyagesWithWarnings);
      setFilteredRows(voyagesWithWarnings);
    } catch (error) {
      console.error("Erreur lors de la récupération des voyages:", error);
      setIsFailedVoyagesFetch(true);
    }
  };

  useEffect(() => {
    fetchVoyages();
  }, [statusFilter]);

  useEffect(() => {
    applyFilters();
  }, [rows, dateFilter]);

  const applyFilters = () => {
    let result = [...rows];

    if (dateFilter.startDate && dateFilter.endDate) {
      result = result.filter((voyage) => {
        const voyageDate = parseISO(voyage.dateDepart);
        return isWithinInterval(voyageDate, {
          start: dateFilter.startDate,
          end: dateFilter.endDate,
        });
      });
    }

    setFilteredRows(result);
  };

  const handleDateFilterChange = (type, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const resetDateFilter = () => {
    setDateFilter({
      startDate: null,
      endDate: null,
    });
  };

  const handleOpenDialog = () => {
    setSelectedVoyage(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedVoyage(null);
  };

  const handleView = (voyage) => {
    setSelectedVoyage(voyage);
    setViewDialogOpen(true);
  };

  const handleEdit = (voyage) => {
    setSelectedVoyage(voyage);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setVoyageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await voyageService.delete(voyageToDelete);
      setIsSuccess(true);
      setDeleteDialogOpen(false);
      fetchVoyages();
    } catch (error) {
      console.error("Erreur lors de la suppression du voyage:", error);
      setIsFailedVoyageDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setVoyageToDelete(null);
  };

  const handleOpenEtatDialog = (voyage) => {
    setSelectedVoyageForEtat(voyage);
    setEtatDialogOpen(true);
  };

  const handleCloseEtatDialog = () => {
    setEtatDialogOpen(false);
    setSelectedVoyageForEtat(null);
  };

  const handleEtatChange = async (voyageId, newEtat) => {
    try {
      await voyageService.changeEtat({
        id: voyageId,
        etat: newEtat,
      });
      setIsSuccess(true);
      fetchVoyages();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setIsFailedEtatChange(true);
    }
  };

  const handleShowWarnings = (voyage) => {
    setSelectedVoyageWarnings(voyage.warnings || []);
    setWarningsDialogOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsSuccess(true);
    fetchVoyages();
    setDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedVoyage(null);
  };

  // Close handlers for snackbars
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setIsSuccess(false);
  };

  const handleCloseFailedVoyagesFetch = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedVoyagesFetch(false);
  };

  const handleCloseFailedVoyageDelete = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedVoyageDelete(false);
  };

  const handleCloseFailedVoyageUpdate = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedVoyageUpdate(false);
  };

  const handleCloseFailedVoyageCreate = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedVoyageCreate(false);
  };

  const handleCloseFailedEtatChange = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedEtatChange(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalShipping fontSize="large" />
              Gestion des Voyages
            </Typography>

            <Button
              variant="contained"
              onClick={handleOpenDialog}
              startIcon={<Add />}
              sx={{
                px: 3,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Nouveau Voyage
            </Button>
          </Box>

          <FilterContainer elevation={1}>
            <DateRange color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Filtres
            </Typography>

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={fr}
            >
              <DatePicker
                label="Date de début"
                value={dateFilter.startDate}
                onChange={(date) => handleDateFilterChange("startDate", date)}
                renderInput={(params) => (
                  <TextField {...params} size="small" sx={{ width: 180 }} />
                )}
              />
              <DatePicker
                label="Date de fin"
                value={dateFilter.endDate}
                onChange={(date) => handleDateFilterChange("endDate", date)}
                renderInput={(params) => (
                  <TextField {...params} size="small" sx={{ width: 180 }} />
                )}
                minDate={dateFilter.startDate}
              />
            </LocalizationProvider>

            <Button
              variant="outlined"
              onClick={resetDateFilter}
              disabled={!dateFilter.startDate && !dateFilter.endDate}
              size="small"
              sx={{ ml: 1 }}
            >
              Réinitialiser
            </Button>

            <FormControl size="small" sx={{ minWidth: 180, ml: "auto" }}>
              <InputLabel>
                <FilterList fontSize="small" sx={{ mr: 1 }} />
                Statut
              </InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Statut"
              >
                <MenuItem value="TOUS">Tous les statuts</MenuItem>
                <MenuItem value="PLANIFIE">Planifié</MenuItem>
                <MenuItem value="EN_COURS">En cours</MenuItem>
                <MenuItem value="TERMINE">Terminé</MenuItem>
                <MenuItem value="ANNULE">Annulé</MenuItem>
                <MenuItem value="EN_INCIDENT">Incident</MenuItem>
              </Select>
            </FormControl>
          </FilterContainer>

          <VoyageDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            onSave={handleSaveSuccess}
            onError={() => setIsFailedVoyageCreate(true)}
          />

          <EditVoyageDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            voyageId={selectedVoyage?.id}
            onSave={handleSaveSuccess}
            onError={() => setIsFailedVoyageUpdate(true)}
          />

          <EtatVoyageComponent
            open={etatDialogOpen}
            onClose={handleCloseEtatDialog}
            voyage={selectedVoyageForEtat}
            onEtatChange={handleEtatChange}
            currentEtat={selectedVoyageForEtat?.etat}
          />

          {filteredRows.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 10,
                textAlign: "center",
              }}
            >
              <DirectionsBoat
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Aucun voyage trouvé
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {dateFilter.startDate || dateFilter.endDate
                  ? "Aucun voyage ne correspond à vos critères de filtrage"
                  : "Créez votre premier voyage ou modifiez les filtres"}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setStatusFilter("TOUS");
                  resetDateFilter();
                }}
              >
                Réinitialiser les filtres
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredRows.map((voyage) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={voyage.id}>
                  <Box sx={{ position: "relative" }}>
                    <WarningCard
                      elevation={3}
                      data-haswarnings={
                        voyage.warnings?.length > 0 &&
                        voyage.etat !== "ANNULE" &&
                        voyage.etat !== "TERMINE"
                          ? "true"
                          : "false"
                      }
                      status={voyage.etat}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <StatusBadge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            variant="dot"
                            status={voyage.etat}
                          >
                            <Avatar
                              sx={{
                                bgcolor: getStatusColor(voyage.etat).bgcolor,
                                color: getStatusColor(voyage.etat).color,
                                width: 40,
                                height: 40,
                              }}
                            >
                              {getStatusColor(voyage.etat).icon}
                            </Avatar>
                          </StatusBadge>

                          <Chip
                            label={voyage.etat}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(voyage.etat)
                                .bgcolor,
                              color: getStatusColor(voyage.etat).color,
                              fontWeight: 600,
                              px: 1,
                            }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          {voyage.lieuDepart.ville} → {voyage.lieuArrive.ville}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip
                            icon={<Timeline fontSize="small" />}
                            label={`${voyage.distance} km`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<CalendarToday fontSize="small" />}
                            label={formatDate(voyage.dateDepart)}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            ID: {voyage.id}
                          </Typography>

                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Voir détails">
                              <IconButton
                                size="small"
                                onClick={() => handleView(voyage)}
                                color="primary"
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Afficher les avertissements">
                              <IconButton
                                size="small"
                                onClick={() => handleShowWarnings(voyage)}
                                color={
                                  voyage.warnings?.length
                                    ? "warning"
                                    : "default"
                                }
                                disabled={
                                  voyage.etat === "TERMINE" ||
                                  voyage.etat === "ANNULE" ||
                                  !voyage.warnings ||
                                  voyage.warnings.length === 0
                                }
                              >
                                <WarningIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Changer statut">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEtatDialog(voyage)}
                                color="primary"
                                disabled={["TERMINE", "ANNULE"].includes(
                                  voyage.etat
                                )}
                                sx={{
                                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                                  "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.15)",
                                  },
                                }}
                              >
                                <SyncAlt fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Modifier">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(voyage)}
                                color="secondary"
                                disabled={voyage.etat !== "PLANIFIE"}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Supprimer">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(voyage.id)}
                                color="error"
                                disabled={voyage.etat === "EN_COURS"}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </CardContent>
                    </WarningCard>

                    {voyage.warnings?.length > 0 &&
                      voyage.etat != "TERMINE" &&
                      voyage.etat != "ANNULE" && (
                        <Badge
                          badgeContent={voyage.warnings.length}
                          color="error"
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            zIndex: 1,
                            "& .MuiBadge-badge": {
                              height: 24,
                              minWidth: 24,
                              borderRadius: "50%",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              animation: "pulse 1.5s infinite",
                            },
                            "@keyframes pulse": {
                              "0%": { transform: "scale(1)" },
                              "50%": { transform: "scale(1.1)" },
                              "100%": { transform: "scale(1)" },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              backgroundColor: "transparent",
                            }}
                          />
                        </Badge>
                      )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {viewDialogOpen && (
          <ViewVoyageDialog
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            voyageId={selectedVoyage?.id}
          />
        )}

        <VoyageWarningsDialog
          open={warningsDialogOpen}
          onClose={() => setWarningsDialogOpen(false)}
          warnings={selectedVoyageWarnings}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Êtes-vous sûr de vouloir supprimer ce voyage? Cette action ne peut
              pas être annulée.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

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
            elevation={6}
            variant="filled"
          >
            Opération réussie!
          </MuiAlert>
        </Snackbar>

        {/* Error Snackbars */}
        <Snackbar
          open={isFailedVoyagesFetch}
          autoHideDuration={3000}
          onClose={handleCloseFailedVoyagesFetch}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseFailedVoyagesFetch}
            severity="error"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            Échec du chargement des voyages!
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={isFailedVoyageDelete}
          autoHideDuration={3000}
          onClose={handleCloseFailedVoyageDelete}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseFailedVoyageDelete}
            severity="error"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            Échec de la suppression du voyage!
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={isFailedVoyageUpdate}
          autoHideDuration={3000}
          onClose={handleCloseFailedVoyageUpdate}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseFailedVoyageUpdate}
            severity="error"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            Échec de la mise à jour du voyage! Vérifiez les données saisies.
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={isFailedVoyageCreate}
          autoHideDuration={3000}
          onClose={handleCloseFailedVoyageCreate}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseFailedVoyageCreate}
            severity="error"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            Échec de la création du voyage! Vérifiez les données saisies.
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={isFailedEtatChange}
          autoHideDuration={3000}
          onClose={handleCloseFailedEtatChange}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseFailedEtatChange}
            severity="error"
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            Échec du changement de statut!
          </MuiAlert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default Voyage;
