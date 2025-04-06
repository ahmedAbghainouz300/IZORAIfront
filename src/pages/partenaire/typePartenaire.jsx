import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import TypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/TypePartenaireDialog.jsx";
import typePartenaireService from "../../service/partenaire/typePartenaireService";
import VoirTypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/VoirTypePartenaireDialog.jsx";
import ModifierTypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/ModifierTypePartenaireDialog.jsx";
import "../../styles/DataGrid.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  IconButton,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const columns = (handleVoir, handleModifier, handleDeleteClick, loading) => [
  { field: "libelle", headerName: "Libellé", flex: 1 },
  { field: "definition", headerName: "Définition", flex: 1 },
  { field: "genre", headerName: "Genre", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    width: 350,
    renderCell: (params) => (
      <strong>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleVoir(params.row)}
          style={{ marginRight: 8 }}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="warning"
          size="small"
          onClick={() => handleModifier(params.row)}
          style={{ marginRight: 8 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDeleteClick(params.row.idTypePartenaire)}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </strong>
    ),
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function TypePartenaire() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voirDialogOpen, setVoirDialogOpen] = useState(false);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });
  // New state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typePartenaireToDelete, setTypePartenaireToDelete] = useState(null);

  useEffect(() => {
    fetchTypePartenaires();
  }, []);

  const fetchTypePartenaires = () => {
    setLoading(true);
    typePartenaireService
      .getAll()
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setAlert({
          message: "Erreur lors du chargement des types de partenaires",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
  };

  // New delete confirmation handlers
  const handleDeleteClick = (idTypePartenaire) => {
    setTypePartenaireToDelete(idTypePartenaire);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setLoading(true);
    typePartenaireService
      .delete(typePartenaireToDelete)
      .then(() => {
        setRows(
          rows.filter((row) => row.idTypePartenaire !== typePartenaireToDelete)
        );
        setAlert({
          message: "Type de partenaire supprimé avec succès",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error("Erreur suppression:", error);
        setAlert({
          message: "Erreur lors de la suppression du type de partenaire",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        setDeleteDialogOpen(false);
      });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTypePartenaireToDelete(null);
  };

  const handleVoir = (typePartenaire) => {
    setSelectedTypePartenaire(typePartenaire);
    setVoirDialogOpen(true);
  };

  const handleModifier = (typePartenaire) => {
    setSelectedTypePartenaire(typePartenaire);
    setModifierDialogOpen(true);
  };

  const handleAddSuccess = () => {
    fetchTypePartenaires();
    setDialogOpen(false);
    setAlert({
      message: "Type de partenaire ajouté avec succès",
      severity: "success",
    });
  };

  const handleUpdateSuccess = () => {
    fetchTypePartenaires();
    setModifierDialogOpen(false);
    setAlert({
      message: "Type de partenaire modifié avec succès",
      severity: "success",
    });
  };

  return (
    <div>
      <h1>Gestion des Types de Partenaires</h1>

      <Box>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Ajouter un Type de Partenaire
        </Button>

        {dialogOpen && (
          <TypePartenaireDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onAdd={handleAddSuccess}
          />
        )}

        {voirDialogOpen && (
          <VoirTypePartenaireDialog
            open={voirDialogOpen}
            onClose={() => setVoirDialogOpen(false)}
            typePartenaire={selectedTypePartenaire}
          />
        )}

        {modifierDialogOpen && (
          <ModifierTypePartenaireDialog
            open={modifierDialogOpen}
            onClose={() => setModifierDialogOpen(false)}
            typePartenaire={selectedTypePartenaire}
            onUpdate={handleUpdateSuccess}
          />
        )}

        <DataGrid
          rows={rows}
          columns={columns(
            handleVoir,
            handleModifier,
            handleDeleteClick,
            loading
          )}
          loading={loading}
          getRowId={(row) => row.idTypePartenaire}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
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
            Êtes-vous sûr de vouloir supprimer ce type de partenaire? Cette
            action est irréversible.
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
