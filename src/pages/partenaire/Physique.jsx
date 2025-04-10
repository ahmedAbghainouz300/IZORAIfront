import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import physiqueService from "../../service/partenaire/physiqueService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewPhysiqueDialog from "../../components/dialog/partenaire/physique/ViewPhysiqueDialog";
import EditPhysiqueDialog from "../../components/dialog/partenaire/physique/EditPhysiqueDialog";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import "../../styles/DataGrid.css";
import PhysiqueDialog from "../../components/dialog/partenaire/physique/PhysiqueDialogue";

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

export default function Physique() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState(null);
  const [partenaireToDelete, setPartenaireToDelete] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });

  useEffect(() => {
    fetchAllPhysiques();
  }, []);

  const fetchAllPhysiques = () => {
    setLoading(true);
    physiqueService
      .getAll()
      .then((response) => {
        console.log(response.data);
        setRows(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des partenaires physiques:",
          error
        );
        setAlert({
          message: "Erreur lors du chargement des partenaires physiques",
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
    fetchAllPhysiques();
    setEditDialogOpen(false);
    setAlert({
      message: "Partenaire mis à jour avec succès",
      severity: "success",
    });
  };

  const handleAddSuccess = () => {
    fetchAllPhysiques();
    setDialogOpen(false);
    setAlert({ message: "Partenaire ajouté avec succès", severity: "success" });
  };

  const handleDeleteClick = (partenaire) => {
    setPartenaireToDelete(partenaire);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    physiqueService
      .delete(partenaireToDelete.idPartenaire)
      .then(() => {
        fetchAllPhysiques();
        setAlert({
          message: "Partenaire supprimé avec succès",
          severity: "success",
        });
        setDeleteConfirmOpen(false);
        setPartenaireToDelete(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du partenaire:", error);
        setAlert({
          message: "Erreur lors de la suppression du partenaire",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const columns = [
    { field: "idPartenaire", headerName: "ID", width: 90 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "prenom", headerName: "Prénom", flex: 1 },
    { field: "telephone", headerName: "Téléphone", flex: 1 },
    { field: "cni", headerName: "CNI", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "typePartenaire",
      headerName: "Type de partenaire",
      flex: 1,
      valueGetter: (params) => params?.libelle || "N/A",
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
            onClick={() => handleDeleteClick(params.row)}
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
      <h1>Gestion des partenaires physiques</h1>

      <Box>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Ajouter un partenaire physique
        </Button>

        {dialogOpen && (
          <PhysiqueDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onAdd={handleAddSuccess}
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
        <ViewPhysiqueDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          partenaireId={selectedPartenaire.idPartenaire}
        />
      )}

      {editDialogOpen && (
        <EditPhysiqueDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          partenaire={selectedPartenaire}
          onSave={handleSave}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce partenaire ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification globale */}
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