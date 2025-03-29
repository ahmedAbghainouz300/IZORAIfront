import * as React from "react";
import { useEffect, useState } from "react";
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
import entretienService from "../../../service/camion/entretienService";
import "../../../styles/DataGrid.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Entretien() {
  const [entretienDialogOpen, setEntretienDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isFailedFetch, setIsFailedFetch] = useState(false);
  const [isFailedDelete, setIsFailedDelete] = useState(false);
  const [isFailedUpdate, setIsFailedUpdate] = useState(false);
  const [isFailedCreate, setIsFailedCreate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entretienToDelete, setEntretienToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data on component mount
  useEffect(() => {
    fetchEntretiens();
  }, []);

  const fetchEntretiens = async () => {
    setIsLoading(true);
    try {
      const response = await entretienService.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des entretiens:", error);
      setIsFailedFetch(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEntretienDialog = () => setEntretienDialogOpen(true);
  const handleCloseEntretienDialog = () => setEntretienDialogOpen(false);

  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEntretienToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await entretienService.delete(entretienToDelete);
      setSuccessMessage("Entretien supprimé avec succès");
      setIsSuccess(true);
      fetchEntretiens();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entretien:", error);
      setIsFailedDelete(true);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setEntretienToDelete(null);
    }
  };

  const handleSave = async (updatedEntretien) => {
    try {
      await entretienService.update(updatedEntretien.id, updatedEntretien);
      setSuccessMessage("Entretien mis à jour avec succès");
      setIsSuccess(true);
      setEditDialogOpen(false);
      fetchEntretiens();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entretien:", error);
      setIsFailedUpdate(true);
    }
  };

  const handleCreate = async (newEntretien) => {
    try {
      const response = await entretienService.create(newEntretien);
      setSuccessMessage("Entretien créé avec succès");
      setIsSuccess(true);
      setEntretienDialogOpen(false);
      fetchEntretiens();
    } catch (error) {
      console.error("Erreur lors de la création de l'entretien:", error);
      setIsFailedCreate(true);
    }
  };

  // Close handlers for notifications
  const handleCloseSuccess = () => setIsSuccess(false);
  const handleCloseFailedFetch = () => setIsFailedFetch(false);
  const handleCloseFailedDelete = () => setIsFailedDelete(false);
  const handleCloseFailedUpdate = () => setIsFailedUpdate(false);
  const handleCloseFailedCreate = () => setIsFailedCreate(false);

  const columns = [
    { field: "dateEntretien", headerName: "Date d'Entretien", flex: 1 },
    { field: "typeEntretien", headerName: "Type d'Entretien", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "cout", headerName: "Coût (€)", flex: 1, type: "number" },
    {
      field: "dateProchainEntretien",
      headerName: "Prochain Entretien",
      flex: 1,
    },
    {
      field: "camion",
      headerName: "Camion",
      flex: 1,
      valueGetter: (params) => params.immatriculation || "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
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
    <Box sx={{ p: 3 }}>
      <div className="buttons">
        <Button
          variant="contained"
          onClick={handleOpenEntretienDialog}
          sx={{ mb: 2 }}
        >
          Nouvel Entretien
        </Button>
      </div>

      <EntretienDialog
        open={entretienDialogOpen}
        onClose={handleCloseEntretienDialog}
        onCreate={handleCreate}
      />

      <ViewEntretienDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        entretien={selectedRow}
      />

      <EditEntretienDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        entretien={selectedRow}
        onSave={handleSave}
      />

      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        sx={{ border: "none" }}
      />

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet entretien ?
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

      {/* Success Notification */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="success" onClose={handleCloseSuccess}>
          {successMessage}
        </MuiAlert>
      </Snackbar>

      {/* Error Notifications */}
      <Snackbar
        open={isFailedFetch}
        autoHideDuration={6000}
        onClose={handleCloseFailedFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error" onClose={handleCloseFailedFetch}>
          Échec du chargement des entretiens
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedDelete}
        autoHideDuration={6000}
        onClose={handleCloseFailedDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error" onClose={handleCloseFailedDelete}>
          Échec de la suppression de l'entretien
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedUpdate}
        autoHideDuration={6000}
        onClose={handleCloseFailedUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error" onClose={handleCloseFailedUpdate}>
          Échec de la mise à jour de l'entretien
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedCreate}
        autoHideDuration={6000}
        onClose={handleCloseFailedCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error" onClose={handleCloseFailedCreate}>
          Échec de la création de l'entretien
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
