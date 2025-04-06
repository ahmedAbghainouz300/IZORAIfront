import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ChauffeurDialog from "../../components/dialog/partenaire/chauffeur/ChauffeurDialog";
import chauffeurService from "../../service/partenaire/chaufeurService";
import VoirChauffeurDialog from "../../components/dialog/partenaire/chauffeur/VoirChauffeurDialog"; // Nouveau dialogue pour voir les détails
import ModifierChauffeurDialog from "../../components/dialog/partenaire/chauffeur/ModifierChauffeurDialog.jsx"; // Nouveau dialogue pour modifier les détails
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../../styles/DataGrid.css";
import {
  IconButton,
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent, // Add Badge import here
} from "@mui/material"; // Installer react-countup
import CountUp from "react-countup";
import AvailableDriversDialog from "../../components/dialog/partenaire/chauffeur/AvailableDriversDialog"; // Nouveau dialogue pour les chauffeurs disponibles

import ExpiredPermisDialog from "../../components/dialog/partenaire/chauffeur/ExpiredPermisDialog"; // Nouveau dialogue pour les chauffeurs avec permis expiré
// Nouveau composant pour les statistiques
const StatsCard = ({ title, value, color }) => (
  <Card sx={{ minWidth: 200, backgroundColor: color, color: "white" }}>
    <CardContent>
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
        <CountUp end={value} duration={1} />
      </Typography>
    </CardContent>
  </Card>
);

const columns = (handleDeleteClick, handleVoir, handleModifier, loading) => [
  { field: "idPartenaire", headerName: "ID", width: 90 },
  { field: "nom", headerName: "Nom", flex: 1 },
  { field: "prenom", headerName: "Prénom", flex: 1 },
  { field: "cni", headerName: "CNI", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "telephone", headerName: "Téléphone", flex: 1 },
  { field: "cnss", headerName: "CNSS", flex: 1 },
  { field: "dateRecrutement", headerName: "Date de Recrutement", flex: 1 },
  { field: "disponibilite", headerName: "Disponibilité", flex: 1 },
  {
    field: "dateExpirationPermis",
    headerName: "dateExpirationPermis",
    flex: 1,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 250,
    renderCell: (params) => (
      <strong>
        <IconButton
          color="primary"
          onClick={() => handleVoir(params.row)}
          style={{ marginRight: 8 }}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => handleModifier(params.row)}
          style={{ marginRight: 8 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(params.row.idPartenaire)}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </strong>
    ),
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Chauffeur() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voirDialogOpen, setVoirDialogOpen] = useState(false);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [expiredInsuranceDrivers, setExpiredInsuranceDrivers] = useState([]);
  const [insuranceDialogOpen, setInsuranceDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    onMission: 0,
    loading: true,
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chauffeurToDelete, setChauffeurToDelete] = useState(null);

  useEffect(() => {
    fetchChauffeurs();
    fetchStats();
    fetchExpiredPermisDrivers();
  }, []);

  // Fetch Available Drivers

  // Fetch Drivers with Expired Insurance
  const fetchExpiredPermisDrivers = () => {
    chauffeurService
      .getWithExpiredPermis()
      .then((response) => {
        setExpiredInsuranceDrivers(response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur récupération des chauffeurs avec assurance expirée:",
          error
        );
      });
  };

  const fetchChauffeurs = () => {
    chauffeurService
      .getAll()
      .then((response) => setRows(response.data))
      .catch((error) => console.error("Erreur:", error));
  };
  const fetchStats = () => {
    setStats((prev) => ({ ...prev, loading: true }));

    Promise.all([
      chauffeurService.getActiveDriversCount(),
      chauffeurService.getDriversOnMissionCount(),
    ])
      .then(([activeRes, onMissionRes]) => {
        setStats({
          active: activeRes.data,
          onMission: onMissionRes.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Erreur stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      });
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
  };

  const handleDeleteClick = (id) => {
    setChauffeurToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setLoading(true);
    chauffeurService
      .delete(chauffeurToDelete)
      .then(() => {
        fetchChauffeurs();
        setAlert({
          message: "Chauffeur supprimé avec succès",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error("Erreur suppression:", error);
        setAlert({
          message: "Erreur lors de la suppression du chauffeur",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        setDeleteDialogOpen(false);
      });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setChauffeurToDelete(null);
  };

  const handleVoir = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setVoirDialogOpen(true);
  };

  const handleModifier = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setModifierDialogOpen(true);
  };

  const handleAddSuccess = () => {
    fetchChauffeurs();
    setDialogOpen(false);
    setAlert({
      message: "Chauffeur ajouté avec succès",
      severity: "success",
    });
  };

  const handleUpdateSuccess = () => {
    fetchChauffeurs();
    setModifierDialogOpen(false);
    setAlert({
      message: "Chauffeur modifié avec succès",
      severity: "success",
    });
  };

  return (
    <div>
      <h1>Gestion des Chauffeurs :</h1>
      <Box sx={{ mb: 2 }}>
        <Grid
          container
          spacing={3}
          sx={{ display: "flex", justifyContent: "space-evenly", padding: 2 }}
        >
          <Grid item>
            {stats.loading ? (
              <CircularProgress />
            ) : (
              <StatsCard
                title="Chauffeurs Actifs"
                value={stats.active}
                total={rows.length}
                color="#4caf50"
              />
            )}
          </Grid>
          <Grid item>
            {stats.loading ? (
              <CircularProgress />
            ) : (
              <StatsCard
                title="En Mission"
                value={stats.onMission}
                total={rows.length}
                color="#ff9800"
              />
            )}
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Ajouter un Chauffeur
        </Button>

        <Button
          variant="outlined"
          onClick={() => setAvailabilityDialogOpen(true)}
        >
          Chauffeurs Disponibles
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => setInsuranceDialogOpen(true)}
        >
          Assurances Expirées
        </Button>
      </Box>

      <Box>
        <DataGrid
          rows={rows}
          columns={columns(handleDelete, handleVoir, handleModifier)}
          getRowId={(row) => row.idPartenaire}
          initialState={{
            pagination: { paginationModel: { pageSize: 4 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar }}
          sx={{
            "@media print": {
              ".MuiDataGrid-toolbarContainer": { display: "none" },
            },
          }}
        />
      </Box>

      {/* Dialog for adding a new driver */}
      {dialogOpen && (
        <ChauffeurDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}

      {/* Dialog for viewing driver details */}
      {voirDialogOpen && (
        <VoirChauffeurDialog
          open={voirDialogOpen}
          onClose={() => setVoirDialogOpen(false)}
          chauffeurId={selectedChauffeur.idPartenaire}
          onEdit={handleModifier}
        />
      )}

      {/* Dialog for modifying driver details */}
      {modifierDialogOpen && (
        <ModifierChauffeurDialog
          open={modifierDialogOpen}
          onClose={() => setModifierDialogOpen(false)}
          chauffeur={selectedChauffeur}
          onUpdate={handleModifier}
        />
      )}

      {/* Dialogs for Available Drivers and Expired Insurance */}
      {insuranceDialogOpen && (
        <ExpiredPermisDialog
          open={insuranceDialogOpen}
          onClose={() => setInsuranceDialogOpen(false)}
          drivers={expiredInsuranceDrivers}
          onViewDriver={(driver) => {
            setSelectedChauffeur(driver);
            setVoirDialogOpen(true);
            setInsuranceDialogOpen(false);
          }}
        />
      )}

      <AvailableDriversDialog
        open={availabilityDialogOpen}
        onClose={() => setAvailabilityDialogOpen(false)}
      />
    </div>
  );
}
