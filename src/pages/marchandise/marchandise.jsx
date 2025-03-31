import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import marchandiseService from "../../service/marchandise/marchandiseService";
import "../../styles/DataGrid.css";
import {
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import ViewMarchandiseDialog from "../../components/dialog/marchandise/ViewMarchandiseDialog";
import MarchandiseDialog from "../../components/dialog/marchandise/MarchandiseDialog";
import EditMarchandiseDialog from "../../components/dialog/marchandise/EditMarchandiseDialog";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Marchandise() {
  const [marchandiseDialogOpen, setMarchandiseDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marchandiseToDelete, setMarchandiseToDelete] = useState(null);

  useEffect(() => {
    fetchMarchandises();
  }, []);

  const fetchMarchandises = async () => {
    setLoading(true);
    try {
      const response = await marchandiseService.getAll();
      setRows(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching marchandises:", error);
      setAlert({
        message: "Erreur lors du chargement des marchandises",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
  };

  const handleOpenMarchandiseDialog = () => setMarchandiseDialogOpen(true);
  const handleCloseMarchandiseDialog = () => setMarchandiseDialogOpen(false);

  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setMarchandiseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await marchandiseService.delete(marchandiseToDelete);
      fetchMarchandises();
      setAlert({
        message: "Marchandise supprimée avec succès",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting marchandise:", error);
      setAlert({
        message: "Erreur lors de la suppression de la marchandise",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMarchandiseToDelete(null);
  };

  const handleSave = async (updatedMarchandise) => {
    setLoading(true);
    try {
      await marchandiseService.update(
        updatedMarchandise.id,
        updatedMarchandise
      );
      fetchMarchandises();
      setEditDialogOpen(false);
      setAlert({
        message: "Marchandise mise à jour avec succès",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating marchandise:", error);
      setAlert({
        message: "Erreur lors de la mise à jour de la marchandise",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newMarchandise) => {
    setLoading(true);
    try {
      await marchandiseService.create(newMarchandise);
      fetchMarchandises();
      setMarchandiseDialogOpen(false);
      setAlert({
        message: "Marchandise ajoutée avec succès",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating marchandise:", error);
      setAlert({
        message: "Erreur lors de la création de la marchandise",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "codeMarchandise", headerName: "Code", flex: 1 },
    { field: "libelle", headerName: "Libellé", flex: 1 },
    {
      field: "categorie",
      headerName: "Catégorie",
      flex: 1,
      valueGetter: (params) => (params.categorie ? params.categorie : "N/A"),
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
            onClick={() => handleDeleteClick(params.row.id)}
            disabled={loading}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Gestion des Marchandises :</h1>

      <Box>
        <Button
          variant="contained"
          onClick={handleOpenMarchandiseDialog}
          sx={{ mb: 2 }}
        >
          Ajouter une Marchandise
        </Button>

        {marchandiseDialogOpen && (
          <MarchandiseDialog
            open={marchandiseDialogOpen}
            onClose={handleCloseMarchandiseDialog}
            onCreate={handleCreate}
          />
        )}

        {viewDialogOpen && (
          <ViewMarchandiseDialog
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            marchandise={selectedRow}
          />
        )}

        {editDialogOpen && (
          <EditMarchandiseDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            marchandise={selectedRow}
            onSave={handleSave}
          />
        )}

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
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
          sx={{
            "@media print": {
              ".MuiDataGrid-toolbarContainer": { display: "none" },
            },
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette marchandise? Cette action
            est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            autoFocus
            disabled={loading}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Notification Snackbar */}
      <Snackbar
        open={!!alert.message}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} onClose={handleCloseAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
