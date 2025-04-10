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
import EntretienDialog from "../../../components/dialog/Camion/Document/entretien/EntretienDialog";
import ViewEntretienDialog from "../../../components/dialog/Camion/Document/entretien/ViewEntretienDialog";
import EditEntretienDialog from "../../../components/dialog/Camion/Document/entretien/EditEntretienDialog";
import entretienService from "../../../service/camion/entretienService"; // Importez le service
import "../../../styles/DataGrid.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Entretien() {
  const [entretienDialogOpen, setEntretienDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entretienToDelete, setEntretienToDelete] = useState(null);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchEntretiens();
  }, []);

  // Fonction pour récupérer les données du backend
  const fetchEntretiens = async () => {
    try {
      const response = await entretienService.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des entretiens:", error);
    }
  };

  // Ouvrir le dialogue pour ajouter un entretien
  const handleOpenEntretienDialog = () => setEntretienDialogOpen(true);

  // Fermer le dialogue pour ajouter un entretien
  const handleCloseEntretienDialog = () => setEntretienDialogOpen(false);

  // Gérer les actions
  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
    fetchEntretiens(); // Recharger les données pour s'assurer que l'ID est valide

  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
    fetchEntretiens(); // Recharger les données pour s'assurer que l'ID est valide

  };
  const handleDeleteClick = (id) => {
    setEntretienToDelete(id); // Store the ID of the item to delete
    setDeleteDialogOpen(true); // Open the confirmation dialog
  };
  const handleDeleteConfirm = async () => {
    try {
      await entretienService.delete(entretienToDelete); // Delete the item
      fetchEntretiens(); // Refresh the table
      console.log("Entretien supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entretien:", error);
    } finally {
      setDeleteDialogOpen(false); // Close the dialog
      setEntretienToDelete(null); // Clear the ID
    }
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false); // Close the dialog
    setEntretienToDelete(null); // Clear the ID
  };




  const handleSave = async (updatedEntretien) => {
    try {
      console.log("Mise à jour de l'entretien:", updatedEntretien);
      await entretienService.update(updatedEntretien.id, updatedEntretien);
      fetchEntretiens
      setEditDialogOpen(false);
      console.log("Entretien mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entretien:", error);
    }
  };

  const handleCreate = async (newEntretien) => {
    try {
      console.log("Création d'un nouvel entretien:", newEntretien);
      const response = await entretienService.create(newEntretien);
      setRows([...rows, response.data]);
      fetchEntretiens
      console.log("Entretien créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création de l'entretien:", error);
    }
  };
  // Définir les colonnes
  const columns = [
    { field: "dateEntretien", headerName: "Date d'Entretien", flex: 1 },
    { field: "typeEntretien", headerName: "Type d'Entretien", flex: 1 },
    { field: "statusEntretien", headerName: "status d'Entretien", flex: 1 },  
    { field: "description", headerName: "Description", flex: 1 },
    { field: "cout", headerName: "Coût (€)", flex: 1, type: "number" },
    {
      field: "dateProchainEntretien",
      headerName: "Date Prochain Entretien",
      flex: 1,
    },
    {
      field: "camion",
      headerName: "Immatriculation Camion",
      valueGetter: (params) => {
        return params ? params.immatriculation : "N/A";
      },
      flex: 1,
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
          <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)} // Open confirmation dialog
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <div className="buttons">
        <button className="blue-button" onClick={handleOpenEntretienDialog}>
          <p>Nouvel Entretien</p>
        </button>
      </div>

      {/* Dialogue pour ajouter un entretien */}
      {entretienDialogOpen && (
        <EntretienDialog
          open={entretienDialogOpen}
          onClose={handleCloseEntretienDialog}
          onCreate={handleCreate}
        />
      )}

      {/* Dialogue pour voir les détails d'un entretien */}
      {viewDialogOpen && (
        <ViewEntretienDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          entretienId={selectedRow.id}
        />
      )}

      {/* Dialogue pour modifier un entretien */}
      {editDialogOpen && (
        <EditEntretienDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          entretien={selectedRow}
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
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet entretien ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 