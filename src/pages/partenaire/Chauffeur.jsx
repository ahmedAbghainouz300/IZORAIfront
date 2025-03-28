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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent, // Add Badge import here
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material"; // Installer react-countup
import CountUp from "react-countup";
import AvailableDriversDialog from "../../components/dialog/partenaire/chauffeur/AvailableDriversDialog"; // Nouveau dialogue pour les chauffeurs disponibles
import {
  Warning as WarningIcon,
  ErrorOutline as ErrorOutlineIcon,
  Close as CloseIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import ExpiredPermisDialog from "../../components/dialog/partenaire/chauffeur/ExpiredPermisDialog"; // Nouveau dialogue pour les chauffeurs avec permis expiré
// Nouveau composant pour les statistiques
const StatsCard = ({ title, value, color }) => (
  <Card
    sx={{
      minWidth: 200,
      backgroundColor: color,
      color: "white",
      width: "400px",
    }}
  >
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

const columns = (handleDelete, handleVoir, handleModifier) => [
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
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleVoir(params.row)}
          style={{ marginRight: 8 }}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="warning"
          size="small"
          onClick={() => handleModifier(params.row)}
          style={{ marginRight: 8 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.row.idPartenaire)}
          style={{ marginRight: 8 }}
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
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [expiredInsuranceDrivers, setExpiredInsuranceDrivers] = useState([]);
  const [insuranceDialogOpen, setInsuranceDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    onMission: 0,
    loading: true,
  });
  const [rows, setRows] = useState([]);

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

  const handleDelete = (id) => {
    chauffeurService
      .delete(id)
      .then(() => {
        setRows(rows.filter((row) => row.idPartenaire !== id));
        fetchChauffeurs();
      })
      .catch((error) => console.error("Erreur suppression:", error));
  };

  const handleVoir = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setVoirDialogOpen(true);
  };
  const handleModifier = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    fetchChauffeurs();
    setModifierDialogOpen(true);
  };

  return (
    <div>
      <h1>Gestion des Chauffeurs :</h1>
      <Box sx={{ mb: 2 }}>
        {/* <Typography variant="h6" sx={{ mb: 1 }}>
          Statistiques
        </Typography> */}
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
      {/* Boutons d'action principaux */}
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
          sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
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
        {dialogOpen && (
          <ChauffeurDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          />
        )}
        {voirDialogOpen && (
          <VoirChauffeurDialog
            open={voirDialogOpen}
            onClose={() => setVoirDialogOpen(false)}
            chauffeurId={selectedChauffeur.idPartenaire}
            onEdit={handleModifier}
          />
        )}
        {modifierDialogOpen && (
          <ModifierChauffeurDialog
            open={modifierDialogOpen}
            onClose={() => setModifierDialogOpen(false)}
            chauffeur={selectedChauffeur}
            onUpdate={handleModifier}
          />
        )}

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
