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
import ViewAssuranceDialog from "../../../components/dialog/Camion/Document/assurance/ViewAssuranceDialog";
import EditAssuranceDialog from "../../../components/dialog/Camion/Document/assurance/EditAssuranceDialog";
import assuranceService from "../../../service/camion/assuranceService";
import "../../../styles/cabine.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedAssurancesFetch, setIsFailedAssurancesFetch] = useState(false);
  const [isFailedAssuranceDelete, setIsFailedAssuranceDelete] = useState(false);
  const [isFailedAssuranceUpdate, setIsFailedAssuranceUpdate] = useState(false);
  const [isFailedAssuranceCreate, setIsFailedAssuranceCreate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assuranceToDelete, setAssuranceToDelete] = useState(null);

  // Load data when the component mounts
  useEffect(() => {
    fetchAssurances();
  }, []);

  // Fetch assurances from the backend
  const fetchAssurances = async () => {
    try {
      const response = await assuranceService.getAll();
      setRows(response.data);
      console.log("Assurances récupérées avec succès");
    } catch (error) {
      console.error("Erreur lors de la récupération des assurances:", error);
      setIsFailedAssurancesFetch(true);
    }
  };

  // Open the dialog to add a new assurance
  const handleOpenAssuranceDialog = () => setAssuranceDialogOpen(true);

  // Close the dialog to add a new assurance
  const handleCloseAssuranceDialog = () => setAssuranceDialogOpen(false);

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
    setAssuranceToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle the actual deletion
  const handleDelete = async () => {
    try {
      await assuranceService.delete(assuranceToDelete);
      setRows(rows.filter((row) => row.id !== assuranceToDelete));
      console.log("Assurance supprimée avec succès");
      setIsSuccess(true);
      setDeleteDialogOpen(false);
      fetchAssurances(); // Refresh the data
    } catch (error) {
      console.error("Erreur lors de la suppression de l'assurance:", error);
      setIsFailedAssuranceDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  // Close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAssuranceToDelete(null);
  };

  // Handle save action for updated assurance
  const handleSave = async (updatedAssurance) => {
    try {
      await assuranceService.update(
        updatedAssurance.numeroContrat,
        updatedAssurance
      );
      setRows(
        rows.map((row) =>
          row.numeroContrat === updatedAssurance.numeroContrat
            ? updatedAssurance
            : row
        )
      );
      setEditDialogOpen(false);
      setIsSuccess(true);
      fetchAssurances();
      console.log("Assurance mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'assurance:", error);
      setIsFailedAssuranceUpdate(true);
    }
  };

  // Handle create action for new assurance
  const handleCreate = async (newAssurance) => {
    try {
      const response = await assuranceService.create(newAssurance);
      setRows([...rows, response.data]);
      setAssuranceDialogOpen(false);
      setIsSuccess(true);
      console.log("Assurance créée avec succès");
    } catch (error) {
      console.error("Erreur lors de la création de l'assurance:", error);
      setIsFailedAssuranceCreate(true);
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
  const handleCloseFailedAssurancesFetch = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedAssurancesFetch(false);
  };

  const handleCloseFailedAssuranceDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedAssuranceDelete(false);
  };

  const handleCloseFailedAssuranceUpdate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedAssuranceUpdate(false);
  };

  const handleCloseFailedAssuranceCreate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedAssuranceCreate(false);
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "company", headerName: "Compagnie", flex: 1 },
    { field: "typeCouverture", headerName: "Type de Couverture", flex: 1 },
    { field: "montant", headerName: "Montant", flex: 1, type: "number" },
    { field: "dateDebut", headerName: "Date de Début", flex: 1 },
    { field: "dateExpiration", headerName: "Date d'Expiration", flex: 1 },
    {
      field: "primeAnnuelle",
      headerName: "Prime Annuelle",
      flex: 1,
      type: "number",
    },
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
    <Box sx={{ height: 500, width: "100%" }}>
      <div className="buttons">
        <button className="blue-button" onClick={handleOpenAssuranceDialog}>
          <p>Nouvelle assurance</p>
        </button>
      </div>

      {/* Dialog to add a new assurance */}
      {assuranceDialogOpen && (
        <AssuranceDialog
          open={assuranceDialogOpen}
          onClose={handleCloseAssuranceDialog}
          onSave={handleCreate}
        />
      )}

      {/* Dialog to view assurance details */}
      {viewDialogOpen && (
        <ViewAssuranceDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          assurance={selectedRow}
        />
      )}

      {/* Dialog to edit an assurance */}
      {editDialogOpen && (
        <EditAssuranceDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          assurance={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* DataGrid to display assurances */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.numeroContrat}
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
            Are you sure you want to delete this assurance? This action cannot
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
        open={isFailedAssurancesFetch}
        autoHideDuration={3000}
        onClose={handleCloseFailedAssurancesFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssurancesFetch}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to fetch assurances!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedAssuranceDelete}
        autoHideDuration={3000}
        onClose={handleCloseFailedAssuranceDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssuranceDelete}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to delete assurance!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedAssuranceUpdate}
        autoHideDuration={3000}
        onClose={handleCloseFailedAssuranceUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssuranceUpdate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to update assurance! Verify the entered data.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedAssuranceCreate}
        autoHideDuration={3000}
        onClose={handleCloseFailedAssuranceCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssuranceCreate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to create assurance! Verify the entered data.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
