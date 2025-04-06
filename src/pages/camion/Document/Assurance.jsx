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
import "../../../styles/DataGrid.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [isFailedAssurancesFetch, setIsFailedAssurancesFetch] = useState(false);
  const [isFailedAssuranceDelete, setIsFailedAssuranceDelete] = useState(false);
  const [isFailedAssuranceUpdate, setIsFailedAssuranceUpdate] = useState(false);
  const [isFailedAssuranceCreate, setIsFailedAssuranceCreate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assuranceToDelete, setAssuranceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data when the component mounts
  useEffect(() => {
    try {
      fetchAssurances();
      assuranceService.checkExpiration();
    } catch (e) {
      console.log("error fetching data " + e);
    }
  }, []);

  // Fetch assurances from the backend
  const fetchAssurances = async () => {
    try {
      const response = await assuranceService.getAll();
      setRows(response.data);
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
    setIsDeleting(true);
    console.log(assuranceToDelete);
    try {
      await assuranceService.delete(assuranceToDelete);
      console.log("Assurance supprimée avec succès");
      setIsSuccess(true);
      setDeleteDialogOpen(false);
      fetchAssurances();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'assurance:", error);
      setIsFailedAssuranceDelete(true);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setAssuranceToDelete(null);
    }
  };

  // Handle save action for updated assurance
  const handleSave = async (updatedAssurance) => {
    try {
      await assuranceService.update(
        updatedAssurance.numeroContrat,
        updatedAssurance
      );
      setSuccessMessage("Assurance mise à jour avec succès");
      setIsSuccess(true);
      setEditDialogOpen(false);
      fetchAssurances();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'assurance:", error);
      setIsFailedAssuranceUpdate(true);
    }
  };

  // Handle create action for new assurance
  const handleCreate = async (newAssurance) => {
    try {
      const response = await assuranceService.create(newAssurance);
      setSuccessMessage("Assurance créée avec succès");
      setIsSuccess(true);
      setAssuranceDialogOpen(false);
      fetchAssurances();
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
    setSuccessMessage("");
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
    {
      field: "montant",
      headerName: "Montant",
      flex: 1,
      type: "number",
      valueFormatter: (params) => `${params} MAD`,
    },
    {
      field: "dateDebut",
      headerName: "Date de Début",
      flex: 1,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
    {
      field: "dateExpiration",
      headerName: "Date d'Expiration",
      flex: 1,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
    {
      field: "primeAnnuelle",
      headerName: "Prime Annuelle",
      flex: 1,
      type: "number",
      valueFormatter: (params) => `${params} MAD`,
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
          <IconButton
            color="primary"
            onClick={() => handleView(params.row)}
            aria-label="view"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleEdit(params.row)}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.numeroContrat)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <div className="buttons">
        <Button
          variant="contained"
          onClick={handleOpenAssuranceDialog}
          sx={{ mb: 2 }}
        >
          Nouvelle assurance
        </Button>
      </div>

      {/* Dialog to add a new assurance */}
      <AssuranceDialog
        open={assuranceDialogOpen}
        onClose={handleCloseAssuranceDialog}
        onSave={handleCreate}
      />

      {/* Dialog to view assurance details */}
      {viewDialogOpen && (
        <ViewAssuranceDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          assuranceId={selectedRow.numeroContrat}
        />
      )}

      {/* Dialog to edit an assurance */}
      <EditAssuranceDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        assurance={selectedRow}
        onSave={handleSave}
      />

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
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette assurance ? Cette action
            est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Annuler
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>

      {/* Error Snackbars */}
      <Snackbar
        open={isFailedAssurancesFetch}
        autoHideDuration={6000}
        onClose={handleCloseFailedAssurancesFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssurancesFetch}
          severity="error"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Échec du chargement des assurances !
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedAssuranceDelete}
        autoHideDuration={6000}
        onClose={handleCloseFailedAssuranceDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssuranceDelete}
          severity="error"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Échec de la suppression de l'assurance !
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedAssuranceUpdate}
        autoHideDuration={6000}
        onClose={handleCloseFailedAssuranceUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssuranceUpdate}
          severity="error"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Échec de la mise à jour de l'assurance ! Veuillez vérifier les données
          saisies.
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedAssuranceCreate}
        autoHideDuration={6000}
        onClose={handleCloseFailedAssuranceCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedAssuranceCreate}
          severity="error"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Échec de la création de l'assurance ! Veuillez vérifier les données
          saisies.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
