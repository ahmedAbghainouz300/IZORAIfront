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
import RemorqueDialog from "../../components/dialog/Camion/remorque/RemorqueDialog";
import ViewRemorqueDialog from "../../components/dialog/Camion/remorque/ViewRemorqueDialog";
import EditRemorqueDialog from "../../components/dialog/Camion/remorque/EditRemorqueDialog";
import remorqueService from "../../service/camion/remorqueService"; // Import du service

// Custom Toolbar with only the CSV/Excel Export Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Remorque() {
  const [remorqueDialogOpen, setRemorqueDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  // Charger les données au montage du composant
  React.useEffect(() => {
    fetchRemorques();
  }, []);

  // Récupérer toutes les remorques depuis le backend
  const fetchRemorques = async () => {
    try {
      const response = await remorqueService.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des remorques :", error);
    }
  };

  // Ouvrir le dialogue pour ajouter une remorque
  const handleOpenRemorqueDialog = () => setRemorqueDialogOpen(true);

  // Fermer le dialogue pour ajouter une remorque
  const handleCloseRemorqueDialog = () => setRemorqueDialogOpen(false);

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
      await remorqueService.delete(id);
      setRows(rows.filter((row) => row.id !== id));
      console.log("Remorque supprimée :", id);
    } catch (error) {
      console.error("Erreur lors de la suppression de la remorque :", error);
    }
  };

  const handleSave = async (updatedRemorque) => {
    try {
      await remorqueService.update(updatedRemorque.immatriculation, updatedRemorque);
      setRows(rows.map((row) => (row.id === updatedRemorque.id ? updatedRemorque : row)));
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la remorque :", error);
    }
  };

  // Ajouter une nouvelle remorque
  const handleCreate = async (newRemorque) => {
    try {
      const response = await remorqueService.create(newRemorque);
      setRows([...rows, response.data]);
      setRemorqueDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la remorque :", error);
    }
  };

  // Définir les colonnes à l'intérieur du composant pour accéder aux fonctions
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "immatriculation", headerName: "Immatriculation", flex: 1 },
    { field: "typeRemorque", headerName: "Type de Remorque", flex: 1 },
    { field: "volumesStockage", headerName: "Volume de Stockage (m³)", flex: 1, type: "number" },
    { field: "poidsVide", headerName: "Poids à Vide (kg)", flex: 1, type: "number" },
    { field: "poidsChargeMax", headerName: "Poids Charge Max (kg)", flex: 1, type: "number" },
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
        <button className="blue-button" onClick={handleOpenRemorqueDialog}>
          <p>Nouvelle Remorque</p>
        </button>
      </div>

      {/* Dialogue pour ajouter une remorque */}
      {remorqueDialogOpen && (
        <RemorqueDialog
          open={remorqueDialogOpen}
          onClose={handleCloseRemorqueDialog}
          onCreate={handleCreate}
        />
      )}

      {/* Dialogue pour voir les détails d'une remorque */}
      {viewDialogOpen && (
        <ViewRemorqueDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          remorque={selectedRow}
        />
      )}

      {/* Dialogue pour modifier une remorque */}
      {editDialogOpen && (
        <EditRemorqueDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          remorque={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* Tableau */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.idRemorque} // Utiliser idRemorque comme id
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