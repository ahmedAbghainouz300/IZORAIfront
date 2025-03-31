import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import MoraleDialog from "../../components/dialog/partenaire/morale/MoraleDialog";
import moraleService from "../../service/partenaire/moraleService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewMoraleDialog from "../../components/dialog/partenaire/morale/ViewMoraleDialog";
import EditMoraleDialog from "../../components/dialog/partenaire/morale/EditMoraleDialog";
import {
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import "../../styles/DataGrid.css";

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

export default function Morale() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });
  // New state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partenaireToDelete, setPartenaireToDelete] = useState(null);

  useEffect(() => {
    fetchAllMorales();
  }, []);

  const fetchAllMorales = () => {
    setLoading(true);
    moraleService
      .getAll()
      .then((response) => {
        setRows(response.data);
        setLoading(false);
      })
      .catch(() => {
        setAlert({
          message: "Erreur lors du chargement des partenaires",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const handleCloseAlert = () =>
    setAlert({ message: null, severity: "success" });

  const handleView = (partenaire) => {
    setSelectedPartenaire(partenaire);
    setViewDialogOpen(true);
  };

  const handleEdit = (partenaire) => {
    setSelectedPartenaire(partenaire);
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    fetchAllMorales();
    setEditDialogOpen(false);
    setAlert({
      message: "Partenaire mis à jour avec succès",
      severity: "success",
    });
  };

  const handleAddSuccess = () => {
    fetchAllMorales();
    setDialogOpen(false);
    setAlert({ message: "Partenaire ajouté avec succès", severity: "success" });
  };

  // New delete confirmation handlers
  const handleDeleteClick = (idPartenaire) => {
    setPartenaireToDelete(idPartenaire);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setLoading(true);
    moraleService
      .delete(partenaireToDelete)
      .then(() => {
        fetchAllMorales();
        setAlert({
          message: "Partenaire supprimé avec succès",
          severity: "success",
        });
      })
      .catch(() => {
        setAlert({
          message: "Erreur lors de la suppression du partenaire",
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
    setPartenaireToDelete(null);
  };

  const columns = [
    { field: "idPartenaire", headerName: "ID", width: 90 },
    { field: "nom", headerName: "Nom", flex: 1, editable: true },
    { field: "ice", headerName: "ICE", flex: 1, editable: true },
    { field: "numeroRC", headerName: "Numéro RC", flex: 1, editable: true },
    {
      field: "abreviation",
      headerName: "Abreviation",
      flex: 1,
      editable: true,
    },
    {
      field: "formeJuridique",
      headerName: "Forme Juridique",
      flex: 1,
      editable: true,
    },
    {
      field: "typePartenaire",
      headerName: "Type",
      flex: 1,
      valueGetter: (params) => params?.libelle || "N/A",
      editable: false,
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
            onClick={() => handleDeleteClick(params.row.idPartenaire)}
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
      <h1>Gestion des Partenaires Moraux :</h1>

      <Box>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Ajouter un Partenaire Moral
        </Button>

        {dialogOpen && (
          <MoraleDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleAddSuccess}
          />
        )}

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.idPartenaire}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
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

      {/* Dialogues */}
      {viewDialogOpen && (
        <ViewMoraleDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          partenaire={selectedPartenaire}
        />
      )}

      {editDialogOpen && (
        <EditMoraleDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          partenaire={selectedPartenaire}
          onSave={handleSave}
        />
      )}

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
            Êtes-vous sûr de vouloir supprimer ce partenaire? Cette action est
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
