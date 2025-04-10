import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
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
import ViewVoyageDialog from "../../components/dialog/voyage/ViewVoyageDialog";
import EditVoyageDialog from "../../components/dialog/voyage/EditVoyageDialog";
import VoyageDialog from "../../components/dialog/voyage/VoyageDialog";

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

  useEffect(() => {
    fetchVoyages();
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
    setDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedVoyage(null);
  };

  const columns = [
    {
      field: "lieuDepart",
      headerName: "Départ",
      flex: 1,
      valueFormatter: (params) => `${params.ville} `,
    },
    {
      field: "lieuArrive",
      headerName: "Destination",
      flex: 1,
      valueFormatter: (params) => `${params.ville} `,
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
            disabled={params.row.etat === "EN_COURS"}
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
