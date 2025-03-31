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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

export default function Entretien() {
  const [entretienDialogOpen, setEntretienDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entretienToDelete, setEntretienToDelete] = useState(null);

  useEffect(() => {
    fetchEntretiens();
  }, []);

  const fetchEntretiens = async () => {
    setLoading(true);
    try {
      const response = await entretienService.getAll();
      setRows(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des entretiens:", error);
      setAlert({
        message: "Erreur lors du chargement des entretiens",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
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

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await entretienService.delete(entretienToDelete);
      fetchEntretiens();
      setAlert({
        message: "Entretien supprimé avec succès",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entretien:", error);
      setAlert({
        message: "Erreur lors de la suppression de l'entretien",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEntretienToDelete(null);
  };

  const handleSave = async (updatedEntretien) => {
    setLoading(true);
    try {
      await entretienService.update(updatedEntretien.id, updatedEntretien);
      fetchEntretiens();
      setEditDialogOpen(false);
      setAlert({
        message: "Entretien mis à jour avec succès",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entretien:", error);
      setAlert({
        message: "Erreur lors de la mise à jour de l'entretien",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newEntretien) => {
    setLoading(true);
    try {
      await entretienService.create(newEntretien);
      fetchEntretiens();
      setEntretienDialogOpen(false);
      setAlert({
        message: "Entretien ajouté avec succès",
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'entretien:", error);
      setAlert({
        message: "Erreur lors de la création de l'entretien",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
      valueGetter: (params) => params?.immatriculation || "N/A",
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
      <h1>Gestion des Entretiens :</h1>

      <Box>
        <Button
          variant="contained"
          onClick={handleOpenEntretienDialog}
          sx={{ mb: 2 }}
        >
          Ajouter un Entretien
        </Button>

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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression
          <IconButton
            aria-label="close"
            onClick={handleCloseDeleteDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet entretien? Cette action est
            irréversible.
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
