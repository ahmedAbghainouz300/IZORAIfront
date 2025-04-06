import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DemandeCotationDialog from "../../components/dialog/demande/DemandeCotationDialog";
import EditDemandeCotationDialog from "../../components/dialog/demande/EditDemandeCotationDialog";
import ViewDemandeCotationDialog from "../../components/dialog/demande/ViewDemandeCotationDialog";
import demandeCotationService from "../../service/demande/demandeCotationService";

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
          <MenuItem value="BROUILLON">Brouillon</MenuItem>
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

  useEffect(() => {
    fetchDemandes();
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