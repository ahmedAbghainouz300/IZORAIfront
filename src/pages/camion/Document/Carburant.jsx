import * as React from "react";
import { useEffect, useState } from "react"; // Importez useEffect et useState
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CarburantDialog from "../../../components/dialog/Camion/Document/carburant/CarburantDialog";
import ViewCarburantDialog from "../../../components/dialog/Camion/Document/carburant/ViewCarburantDialog";
import EditCarburantDialog from "../../../components/dialog/Camion/Document/carburant/EditCarburantDialog";
import carburantService from "../../../service/camion/carburantService"; // Importez le service
import "../../../styles/cabine.css";

// Enum pour TypeCarburant
const TypeCarburant = {
  DIESEL: "DIESEL",
  ESSENCE: "ESSENCE",
  ELECTRIQUE: "ELECTRIQUE",
  HYBRIDE: "HYBRIDE",
};



// Custom Toolbar with only the CSV/Excel Export Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Carburant() {
  const [carburantDialogOpen, setCarburantDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchCarburants();
  }, []);

  // Fonction pour récupérer les données du backend
  const fetchCarburants = async () => {
    try {
      const response = await carburantService.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données de carburant:", error);
    }
  };

  // Ouvrir le dialogue pour ajouter un carburant
  const handleOpenCarburantDialog = () => setCarburantDialogOpen(true);

  // Fermer le dialogue pour ajouter un carburant
  const handleCloseCarburantDialog = () => setCarburantDialogOpen(false);

  // Gérer les actions
  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await carburantService.delete(id);
      setRows(rows.filter((row) => row.id !== id));
      console.log("Entrée de carburant supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entrée de carburant:", error);
    }
  };

  const handleSave = async (updatedCarburant) => {
    try {
      await carburantService.update(updatedCarburant.id, updatedCarburant);
      setRows(rows.map((row) => (row.id === updatedCarburant.id ? updatedCarburant : row)));
      setEditDialogOpen(false);
      console.log("Entrée de carburant mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entrée de carburant:", error);
    }
  };

  const handleCreate = async (newCarburant) => {
    try {
      const response = await carburantService.create(newCarburant);
      setRows([...rows, response.data]);
      setCarburantDialogOpen(false);
      console.log("Entrée de carburant créée avec succès");
    } catch (error) {
      console.error("Erreur lors de la création de l'entrée de carburant:", error);
    }
  };

  // Définir les colonnes
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "dateRemplissage", headerName: "Date de Remplissage", flex: 1 },
    { field: "quantity", headerName: "Quantité (L)", flex: 1, type: "number" },
    { field: "prixParLitre", headerName: "Prix par Litre (€)", flex: 1, type: "number" },
    { field: "kilometrageActuel", headerName: "Kilométrage Actuel", flex: 1, type: "number" },
    { field: "typeCarburant", headerName: "Type de Carburant", flex: 1 },
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
          <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <div className="buttons">
        <button className="blue-button" onClick={handleOpenCarburantDialog}>
          <p>Nouveau Carburant</p>
        </button>
      </div>

      {/* Dialogue pour ajouter un carburant */}
      {carburantDialogOpen && (
        <CarburantDialog
          open={carburantDialogOpen}
          onClose={handleCloseCarburantDialog}
          onCreate={handleCreate}
        />
      )}

      {/* Dialogue pour voir les détails d'un carburant */}
      {viewDialogOpen && (
        <ViewCarburantDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          carburant={selectedRow}
        />
      )}

      {/* Dialogue pour modifier un carburant */}
      {editDialogOpen && (
        <EditCarburantDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          carburant={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* Tableau */}
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
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        style={{ border: "none", marginLeft: 30 }}
        sx={{
          "@media print": {
            ".MuiDataGrid-toolbarContainer": {
              display: "none",
            },
          },
        }}
      />
    </Box>
  );
}