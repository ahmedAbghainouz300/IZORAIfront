import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssuranceDialog from "../../../components/dialog/Camion/Document/assurance/AssuranceDialog";
import ViewAssuranceDialog from "../../../components/dialog/Camion/Document/assurance/ViewAssuranceDialog"; // Dialogue pour voir les détails
import EditAssuranceDialog from "../../../components/dialog/Camion/Document/assurance/EditAssuranceDialog"; // Dialogue pour modifier
import assuranceService from "../../../service/camion/assuranceService"; // Importez le service
import "../../../styles/cabine.css";


// Custom Toolbar with only the CSV/Excel Export Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Assurance() {
  const [assuranceDialogOpen, setAssuranceDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchAssurances();
  }, []);

  const fetchAssurances = async () => {
    try {
      const response = await assuranceService.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des assurances:", error);
    }
  };

  const handleOpenAssuranceDialog = () => setAssuranceDialogOpen(true);
  const handleCloseAssuranceDialog = () => setAssuranceDialogOpen(false);

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
      await assuranceService.delete(id);
      setRows(rows.filter((row) => row.id !== id));
      console.log("Assurance supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'assurance:", error);
    }
  };

  const handleSave = async (updatedAssurance) => {
    try {
      await assuranceService.update(updatedAssurance.id, updatedAssurance);
      setRows(rows.map((row) => (row.id === updatedAssurance.id ? updatedAssurance : row)));
      setEditDialogOpen(false);
      console.log("Assurance mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'assurance:", error);
    }
  };

  const handleCreate = async (newAssurance) => {
    try {
      const response = await assuranceService.create(newAssurance);
      setRows([...rows, response.data]);
      setAssuranceDialogOpen(false);
      console.log("Assurance créée avec succès");
    } catch (error) {
      console.error("Erreur lors de la création de l'assurance:", error);
    }
  };

  const columns = [
    { field: "numeroContrat", headerName: "ID", width: 90 },
    { field: "company", headerName: "Compagnie", flex: 1 },
    { field: "typeCouverture", headerName: "Type de Couverture", flex: 1 },
    { field: "montant", headerName: "Montant", flex: 1, type: "number" },
    { field: "dateDebut", headerName: "Date de Début", flex: 1 },
    { field: "dateExpiration", headerName: "Date d'Expiration", flex: 1 },
    { field: "primeAnnuelle", headerName: "Prime Annuelle", flex: 1, type: "number" },
    { field: "numCarteVerte", headerName: "Numéro Carte Verte", flex: 1 },
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
        <button className="blue-button" onClick={handleOpenAssuranceDialog}>
          <p>Nouvelle assurance</p>
        </button>
      </div>

      {assuranceDialogOpen && (
        <AssuranceDialog
          open={assuranceDialogOpen}
          onClose={handleCloseAssuranceDialog}
          onCreate={handleCreate}
        />
      )}

      {viewDialogOpen && (
        <ViewAssuranceDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          assurance={selectedRow}
        />
      )}

      {editDialogOpen && (
        <EditAssuranceDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          assurance={selectedRow}
          onSave={handleSave}
        />
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.numeroContrat} // Utiliser idRemorque comme id
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
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