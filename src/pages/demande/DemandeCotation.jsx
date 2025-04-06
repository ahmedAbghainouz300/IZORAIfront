import React, { useState, useEffect } from "react";
import { 
  Box, Button, IconButton, Avatar,
  FormControl, InputLabel, MenuItem, Select,
  Typography, Grid, Paper, Stack, LinearProgress
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DemandeCotationDialog from "../../components/dialog/demande/DemandeCotationDialog";
import EditDemandeCotationDialog from "../../components/dialog/demande/EditDemandeCotationDialog";
import ViewDemandeCotationDialog from "../../components/dialog/demande/ViewDemandeCotationDialog";
import demandeCotationService from "../../service/demande/demandeCotationService";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';



const DemandStatistics = ({ stats }) => {
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);

  const statuses = [
    {
      status: 'EN_ATTENTE',
      label: 'En attente',
      icon: <HourglassTopIcon color="warning" />,
      color: '#FFE0B2'
    },
    {
      status: 'VALIDEE',
      label: 'Validées',
      icon: <CheckCircleIcon color="success" />,
      color: '#C8E6C9'
    },
    {
      status: 'REJETEE',
      label: 'Rejetées',
      icon: <CancelIcon color="error" />,
      color: '#FFCDD2'
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        📊 Statistiques des demandes
      </Typography>

      <Grid container spacing={2}>
        {statuses.map(({ status, label, icon, color }) => {
          const count = stats[status] || 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <Grid item xs={12} sm={4} key={status}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2, backgroundColor: color }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'white' }}>{icon}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
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
        <Stack direction="row" spacing={0.5} sx={{ height: 12, borderRadius: 5, overflow: 'hidden' }}>
          {statuses.map(({ status, color }) => (
            <Box
              key={status}
              sx={{
                width: `${total > 0 ? (stats[status] || 0) / total * 100 : 0}%`,
                backgroundColor: color,
                transition: "width 0.3s ease"
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};


// Rest of your component remains the same...
function CustomToolbar({ statusFilter, setStatusFilter }) {
  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <FormControl size="small" sx={{ minWidth: 180, ml: 2 }}>
        <InputLabel>Filtrer par statut</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Filtrer par statut"
        >
          <MenuItem value="TOUS">Tous les statuts</MenuItem>
          <MenuItem value="EN_ATTENTE">En attente</MenuItem>
          <MenuItem value="VALIDEE">Validée</MenuItem>
          <MenuItem value="REJETEE">Rejetée</MenuItem>
        </Select>
      </FormControl>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}


export default function DemandeCotation() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const { enqueueSnackbar } = useSnackbar();
  
  const [stats, setStats] = useState({});

  const fetchDemandes = async () => {
    try {
      let response;
      if (statusFilter === "TOUS") {
        response = await demandeCotationService.getAll();
      } else {
        response = await demandeCotationService.getByStatus(statusFilter);
      }
      setRows(response.data);
    } catch (error) {
      enqueueSnackbar("Erreur lors du chargement des demandes", { variant: "error" });
      console.error("Erreur:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await demandeCotationService.getStatistics();
      setStats(response.data);
    } catch (error) {
      enqueueSnackbar("Erreur lors du chargement des statistiques", { variant: "error" });
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchDemandes();
    fetchStatistics()
  }, [statusFilter]);

  const handleOpenDialog = () => {
    setSelectedDemande(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDemande(null);
  };

  const handleView = (demande) => {
    setSelectedDemande(demande);
    setViewDialogOpen(true);
  };

  const handleEdit = (demande) => {
    setSelectedDemande(demande);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      try {
        await demandeCotationService.delete(id);
        enqueueSnackbar("Demande supprimée avec succès", { variant: "success" });
        fetchDemandes();
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
    fetchDemandes();
    setDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedDemande(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "typeMarchandise", headerName: "Type Marchandise", flex: 1 },
    { field: "typeRemorque", headerName: "Type Remorque", flex: 1 },
    { 
      field: "statut", 
      headerName: "Statut", 
      flex: 1,
      renderCell: (params) => (
        <span style={{
          color: params.value === "VALIDEE" ? "green" : 
                params.value === "REJETEE" ? "red" : 
                params.value === "EN_ATTENTE" ? "orange" : "inherit",
          fontWeight: "bold"
        }}>
          {params.value}
        </span>
      )
    },
    { 
      field: "dateDemande", 
      headerName: "Date Demande", 
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString()
    },
    { field: "periodeTransport", headerName: "Période Transport", flex: 1 },
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
            disabled={params.row.statut !== "EN_ATTENTE"}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDelete(params.row.id)}
            disabled={params.row.statut === "VALIDEE"}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Gestion des Demandes de Cotation</h1>

      {/* <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Statistiques des demandes
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <StatusCard status="EN_ATTENTE" count={stats.EN_ATTENTE || 0} />
          </Grid>
          <Grid item>
            <StatusCard status="VALIDEE" count={stats.VALIDEE || 0} />
          </Grid>
          <Grid item>
            <StatusCard status="REJETEE" count={stats.REJETEE || 0} />
          </Grid>
      
        </Grid>
      </Box> */}

      <DemandStatistics stats={stats} />



      <Box>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Créer une Demande
        </Button>

        <DemandeCotationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveSuccess}
        />
        
        <EditDemandeCotationDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          demandeId={selectedDemande?.id}
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
            )
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
        <ViewDemandeCotationDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          demandeId={selectedDemande?.id}
        />
      )}
    </div>
  );
}