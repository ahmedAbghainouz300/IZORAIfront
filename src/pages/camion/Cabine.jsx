import * as React from "react";
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
import CabineDialog from "../../components/dialog/Camion/cabinet/CabineDialog";
import ViewCabineDialog from "../../components/dialog/Camion/cabinet/ViewCabineDialog"; // Dialogue pour voir les détails
import EditCabineDialog from "../../components/dialog/Camion/cabinet/EditCabineDialog"; // Dialogue pour modifier

import "../../styles/cabine.css";

// Données de test pour les cabines
const initialRows = [
  {
    id: 1,
    immatriculation: "AB-123-CD",
    typeCabine: "Standard",
    poidsMax: 5000,
    consommation: 10,
  },
  {
    id: 2,
    immatriculation: "EF-456-GH",
    typeCabine: "Premium",
    poidsMax: 7000,
    consommation: 12,
  },
];

// Custom Toolbar with only the CSV/Excel Export Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Cabine() {
  const [cabineDialogOpen, setCabineDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState(initialRows);

  // Ouvrir le dialogue pour ajouter une cabine
  const handleOpenCabineDialog = () => setCabineDialogOpen(true);

  // Fermer le dialogue pour ajouter une cabine
  const handleCloseCabineDialog = () => setCabineDialogOpen(false);

  // Gérer les actions
  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
    console.log("Supprimer :", id);
  };

  const handleSave = (updatedCabine) => {
    setRows(rows.map((row) => (row.id === updatedCabine.id ? updatedCabine : row)));
    setEditDialogOpen(false);
  };

  // Définir les colonnes à l'intérieur du composant pour accéder aux fonctions
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "immatriculation", headerName: "Immatriculation", flex: 1 },
    { field: "typeCabine", headerName: "Type de Cabine", flex: 1 },
    { field: "poidsMax", headerName: "Poids Max (kg)", flex: 1, type: "number" },
    { field: "consommation", headerName: "Consommation (L/100km)", flex: 1, type: "number" },
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
        <button className="blue-button" onClick={handleOpenCabineDialog}>
          <p>Nouvelle Cabine</p>
        </button>
      </div>

      {/* Dialogue pour ajouter une cabine */}
      {cabineDialogOpen && (
        <CabineDialog
          open={cabineDialogOpen}
          onClose={handleCloseCabineDialog}
        />
      )}

      {/* Dialogue pour voir les détails d'une cabine */}
      {viewDialogOpen && (
        <ViewCabineDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          cabine={selectedRow}
        />
      )}

      {/* Dialogue pour modifier une cabine */}
      {editDialogOpen && (
        <EditCabineDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          cabine={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* Tableau */}
      <DataGrid
        rows={rows}
        columns={columns}
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