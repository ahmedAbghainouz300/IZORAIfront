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
import carteGriseService from "../../../service/camion/carteGriseService";
import "../../../styles/DataGrid.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ViewCarteGriseDialog from "../../../components/dialog/Camion/Document/carteGrise/viewCarteGriseDialog";
import EditCarteGriseDialog from "../../../components/dialog/Camion/Document/carteGrise/EditCarteGriseDialog";
import CarteGriseDialog from "../../../components/dialog/Camion/Document/carteGrise/CarteGriseDialog";

// Custom Toolbar with only the CSV/Excel Export Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function CarteGrise() {
  const [carteGriseDialogOpen, setCarteGriseDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedCarteGrisesFetch, setIsFailedCarteGrisesFetch] =
    useState(false);
  const [isFailedCarteGriseDelete, setIsFailedCarteGriseDelete] =
    useState(false);
  const [isFailedCarteGriseUpdate, setIsFailedCarteGriseUpdate] =
    useState(false);
  const [isFailedCarteGriseCreate, setIsFailedCarteGriseCreate] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carteGriseToDelete, setCarteGriseToDelete] = useState(null);

  // Load data when the component mounts
  useEffect(() => {
    fetchCarteGrises();
  }, []);

  // Fetch carteGrises from the backend
  const fetchCarteGrises = async () => {
    try {
      const response = await carteGriseService.getAll();
      setRows(response.data);
      console.log("Carte Grises récupérées avec succès");
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes grises:", error);
      setIsFailedCarteGrisesFetch(true);
    }
  };

  // Open the dialog to add a new carteGrise
  const handleOpenCarteGriseDialog = () => setCarteGriseDialogOpen(true);

  // Close the dialog to add a new carteGrise
  const handleCloseCarteGriseDialog = () => {
    setCarteGriseDialogOpen(false);
  fetchCarteGrises(); }

  // Handle view action
  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

  // Handle edit action
  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (id) => {
    setCarteGriseToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle the actual deletion
  const handleDelete = async () => {
    try {
      await carteGriseService.delete(carteGriseToDelete);
      setRows(rows.filter((row) => row.id !== carteGriseToDelete));
      console.log("Carte Grise supprimée avec succès");
      setIsSuccess(true);
      setDeleteDialogOpen(false);
      fetchCarteGrises(); // Refresh the data
    } catch (error) {
      console.error("Erreur lors de la suppression de la carte grise:", error);
      setIsFailedCarteGriseDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  // Close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCarteGriseToDelete(null);
  };

  // Handle save action for updated carteGrise
  const handleSave = async (updatedCarteGrise) => {
    try {
      await carteGriseService.update(updatedCarteGrise.id, updatedCarteGrise);
      setRows(
        rows.map((row) =>
          row.id === updatedCarteGrise.id ? updatedCarteGrise : row
        )
      );
      setEditDialogOpen(false);
      setIsSuccess(true);
      fetchCarteGrises();
      console.log("Carte Grise mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la carte grise:", error);
      setIsFailedCarteGriseUpdate(true);
    }
  };
  const handleCreate = async (formData) => {
    try {
      const response = await carteGriseService.create(formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setRows([...rows, response.data]);
      setCarteGriseDialogOpen(false);
      setIsSuccess(true);
      console.log("Carte Grise created successfully", response.data);
    } catch (error) {
      console.error("Error creating carte grise:", error);
      setIsFailedCarteGriseCreate(true);
    }
  };

  // Close Success message
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
  };

  // Close the error messages
  const handleCloseFailedCarteGrisesFetch = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarteGrisesFetch(false);
  };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

  const handleCloseFailedCarteGriseDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarteGriseDelete(false);
  };

  const handleCloseFailedCarteGriseUpdate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarteGriseUpdate(false);
  };

  const handleCloseFailedCarteGriseCreate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarteGriseCreate(false);
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "marque", headerName: "Marque", flex: 1 },
    { field: "genre", headerName: "Genre", flex: 1 },
    { field: "numeroSerie", headerName: "Numéro de Série", flex: 1 },
    { field: "couleur", headerName: "Couleur", flex: 1 },
    {
      field: "nombrePlace",
      headerName: "Nombre de Places",
      flex: 1,
      type: "number",
    },
    { field: "puissanceFiscale", headerName: "Puissance Fiscale", flex: 1 },
    { field: "energie", headerName: "Énergie", flex: 1 },
    { field: "proprietaire", headerName: "Propriétaire", flex: 1 },
    {
      field: "poidsVide",
      headerName: "Poids à Vide (kg)",
      flex: 1,
      type: "number",
    },
    {
      field: "poidsAutorise",
      headerName: "Poids Autorisé (kg)",
      flex: 1,
      type: "number",
    },
    {
      field: "dateMiseEnCirculation",
      headerName: "Date de Mise en Circulation",
      flex: 1,
    },
    { field: "dateDelivrance", headerName: "Date de Délivrance", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
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
            onClick={() => handleDeleteClick(params.row.id)}
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
        <button className="blue-button" onClick={handleOpenCarteGriseDialog}>
          <p>Nouvelle Carte Grise</p>
        </button>
      </div>

      {/* Dialog to add a new carteGrise */}
      {carteGriseDialogOpen && (
        <CarteGriseDialog
          open={carteGriseDialogOpen}
          onClose={handleCloseCarteGriseDialog}
        />
      )}

      {/* Dialog to view carteGrise details */}
      {viewDialogOpen && (
        <ViewCarteGriseDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          carteGrise={selectedRow}
        />
      )}

      {/* Dialog to edit a carteGrise */}
      {editDialogOpen && (
        <EditCarteGriseDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          carteGrise={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* DataGrid to display carteGrises */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        autoHideDuration={3000}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this carte grise? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Operation successful!
        </MuiAlert>
      </Snackbar>

      {/* Error Snackbars */}
      <Snackbar
        open={isFailedCarteGrisesFetch}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarteGrisesFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarteGrisesFetch}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to fetch carte grises!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCarteGriseDelete}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarteGriseDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarteGriseDelete}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to delete carte grise!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCarteGriseUpdate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarteGriseUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarteGriseUpdate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to update carte grise! Verify the entered data.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCarteGriseCreate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarteGriseCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarteGriseCreate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to create carte grise! Verify the entered data.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
