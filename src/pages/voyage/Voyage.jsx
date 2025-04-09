import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Paper,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import voyageService from "../../service/voyage/voyageService";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ViewVoyageDialog from "../../components/dialog/voyage/ViewVoyageDialog";
import EditVoyageDialog from "../../components/dialog/voyage/EditVoyageDialog";
import VoyageDialog from "../../components/dialog/voyage/VoyageDialog";
import { ConstructionOutlined } from "@mui/icons-material";

const VoyageStatistics = ({ stats }) => {
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);

  const statuses = [
    {
      status: "PLANIFIE",
      label: "Planifiés",
      icon: <HourglassTopIcon color="info" />,
      color: "#BBDEFB",
    },
    {
      status: "EN_COURS",
      label: "En cours",
      icon: <DirectionsCarIcon color="primary" />,
      color: "#B3E5FC",
    },
    {
      status: "TERMINE",
      label: "Terminés",
      icon: <CheckCircleIcon color="success" />,
      color: "#C8E6C9",
    },
    {
      status: "ANNULE",
      label: "Annulés",
      icon: <CancelIcon color="error" />,
      color: "#FFCDD2",
    },
    {
      status: "EN_INCIDENT",
      label: "Incidents",
      icon: <ConstructionOutlined color="warning" />,
      color: "#FFECB3",
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        📊 Statistiques des voyages
      </Typography>

      <Grid container spacing={2}>
        {statuses.map(({ status, label, icon, color }) => {
          const count = stats[status] || 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <Grid item xs={12} sm={4} md={2.4} key={status}>
              <Paper
                elevation={1}
                sx={{ p: 2, borderRadius: 2, backgroundColor: color }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "white" }}>{icon}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {percent}%
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Progress Bar */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Répartition visuelle
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ height: 12, borderRadius: 5, overflow: "hidden" }}
        >
          {statuses.map(({ status, color }) => (
            <Box
              key={status}
              sx={{
                width: `${total > 0 ? ((stats[status] || 0) / total) * 100 : 0}%`,
                backgroundColor: color,
                transition: "width 0.3s ease",
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

function CustomToolbar({ statusFilter, setStatusFilter }) {
  return (
    <GridToolbarContainer
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <FormControl size="small" sx={{ minWidth: 180, ml: 2 }}>
        <InputLabel>Filtrer par statut</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Filtrer par statut"
        >
          <MenuItem value="TOUS">Tous les statuts</MenuItem>
          <MenuItem value="PLANIFIE">Planifié</MenuItem>
          <MenuItem value="EN_COURS">En cours</MenuItem>
          <MenuItem value="TERMINE">Terminé</MenuItem>
          <MenuItem value="ANNULE">Annulé</MenuItem>
          <MenuItem value="EN_INCIDENT">Incident</MenuItem>
        </Select>
      </FormControl>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Voyage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const { enqueueSnackbar } = useSnackbar();
  const [stats, setStats] = useState({});

  const fetchVoyages = async () => {
    try {
      let response;
      if (statusFilter === "TOUS") {
        response = await voyageService.getAll();
      } else {
        response = await voyageService.getByStatus(statusFilter);
      }
      setRows(response.data);
    } catch (error) {
      enqueueSnackbar("Erreur lors du chargement des voyages", {
        variant: "error",
      });
      console.error("Erreur:", error);
    }
  };

  // const fetchStatistics = async () => {
  //   try {
  //     const response = await voyageService.getStatistics();
  //     setStats(response.data);
  //   } catch (error) {
  //     enqueueSnackbar("Erreur lors du chargement des statistiques", {
  //       variant: "error",
  //     });
  //     console.error("Erreur:", error);
  //   }
  // };

  useEffect(() => {
    fetchVoyages();
    // fetchStatistics();
  }, [statusFilter]);

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

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce voyage ?")) {
      try {
        await voyageService.delete(id);
        enqueueSnackbar("Voyage supprimé avec succès", { variant: "success" });
        fetchVoyages();
        // fetchStatistics();
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || "Erreur lors de la suppression",
          { variant: "error" }
        );
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleSaveSuccess = () => {
    fetchVoyages();
    // fetchStatistics();
    setDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedVoyage(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "lieuDepart",
      headerName: "Départ",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <h6>{params.ville}</h6>
        </Box>
      ),
    },
    {
      field: "lieuArrive",
      headerName: "Destination",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <h6>{params.ville}</h6>
        </Box>
      ),
    },
    {
      field: "distance",
      headerName: "Distance (km)",
      width: 120,
      align: "right",
    },
    {
      field: "etat",
      headerName: "Statut",
      flex: 1,
      renderCell: (params) => {
        const getStatusColor = () => {
          switch (params.value) {
            case "PLANIFIE":
              return { bgcolor: "#BBDEFB", color: "#0D47A1" };
            case "EN_COURS":
              return { bgcolor: "#B3E5FC", color: "#01579B" };
            case "TERMINE":
              return { bgcolor: "#C8E6C9", color: "#1B5E20" };
            case "ANNULE":
              return { bgcolor: "#FFCDD2", color: "#C62828" };
            case "EN_INCIDENT":
              return { bgcolor: "#FFECB3", color: "#FF8F00" };
            default:
              return { bgcolor: "#E0E0E0", color: "#424242" };
          }
        };
        const colors = getStatusColor();
        return (
          <Box
            sx={{
              backgroundColor: colors.bgcolor,
              color: colors.color,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div>
          <IconButton color="primary" onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleEdit(params.row)}
            disabled={params.row.etat !== "PLANIFIE"}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            disabled={
              params.row.etat === "EN_COURS" || params.row.etat === "TERMINE"
            }
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Gestion des Voyages</h1>

      <VoyageStatistics stats={stats} />

      <Box>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Créer un Voyage
        </Button>

        <VoyageDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveSuccess}
        />

        <EditVoyageDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          voyageId={selectedVoyage?.id}
          onSave={handleSaveSuccess}
        />

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => (
              <CustomToolbar
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            ),
          }}
          sx={{
            "@media print": {
              ".MuiDataGrid-toolbarContainer": {
                display: "none",
              },
            },
          }}
        />
      </Box>

      {viewDialogOpen && (
        <ViewVoyageDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          voyageId={selectedVoyage?.id}
        />
      )}
    </div>
  );
}
