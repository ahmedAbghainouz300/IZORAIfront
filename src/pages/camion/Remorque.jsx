import * as React from "react";
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
import RemorqueDialog from "../../components/dialog/Camion/remorque/RemorqueDialog";
import ViewRemorqueDialog from "../../components/dialog/Camion/remorque/ViewRemorqueDialog";
import EditRemorqueDialog from "../../components/dialog/Camion/remorque/EditRemorqueDialog";
import remorqueService from "../../service/camion/remorqueService";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "../../styles/DataGrid.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Remorque() {
  const [remorqueDialogOpen, setRemorqueDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isFailed, setIsFailed] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [remorqueToDelete, setRemorqueToDelete] = React.useState(null);

  React.useEffect(() => {
    fetchRemorques();
  }, []);

  const fetchRemorques = async () => {
    try {
      const response = await remorqueService.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching remorques:", error);
      showError("Échec de la récupération des remorques");
    }
  };

  const handleOpenRemorqueDialog = () => setRemorqueDialogOpen(true);
  const handleCloseRemorqueDialog = () => setRemorqueDialogOpen(false);

  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (idRemorque) => {
    setRemorqueToDelete(idRemorque);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await remorqueService.delete(remorqueToDelete);
      showSuccess("Remorque supprimée avec succès");
      setDeleteDialogOpen(false);
      fetchRemorques();
    } catch (error) {
      console.error("Error deleting remorque:", error);
      showError("Échec de la suppression de la remorque");
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRemorqueToDelete(null);
  };

  const handleSave = async (updatedRemorque) => {
    try {
      await remorqueService.update(updatedRemorque.idRemorque, updatedRemorque);
      showSuccess("Remorque mise à jour avec succès");
      console.log("Updated Remorque:", updatedRemorque);
      fetchRemorques();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating remorque:", error);
      showError("Échec de la mise à jour de la remorque");
    }
  };

  const handleCreate = async (newRemorque) => {
    try {
      const response = await remorqueService.create(newRemorque);
      showSuccess("Remorque créée avec succès");
      console.log("New Remorque:", response.data);
      setRemorqueDialogOpen(false);
      fetchRemorques();
    } catch (error) {
      console.error("Error adding remorque:", error);
      showError("Échec de la création de la remorque");
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setIsSuccess(true);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setIsFailed(true);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setIsSuccess(false);
  };

  const handleCloseFailed = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailed(false);
  };

  const columns = [
    {
      field: "typeRemorque",
      headerName: "Type de Remorque",
      flex: 1,
      valueGetter: (params) => params?.type || "N/A",
    },
    {
      field: "volumeStockage",
      headerName: "Volume de Stockage (m³)",
      flex: 1,
      type: "number",
    },
    {
      field: "poidsVide",
      headerName: "Poids à Vide (kg)",
      flex: 1,
      type: "number",
    },
    {
      field: "poidsChargeMax",
      headerName: "Poids Charge Max (kg)",
      flex: 1,
      type: "number",
    },
    {
      field: "disponible",
      headerName: "Disponible",
      flex: 1,
      type: "boolean",
      renderCell: (params) => (params.value ? "Oui" : "Non"),
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
            onClick={() => handleDeleteClick(params.row.idRemorque)}
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
        <button className="blue-button" onClick={handleOpenRemorqueDialog}>
          <p>Nouvelle Remorque</p>
        </button>
      </div>

      {remorqueDialogOpen && (
        <RemorqueDialog
          open={remorqueDialogOpen}
          onClose={handleCloseRemorqueDialog}
          onCreate={handleCreate}
        />
      )}

      {viewDialogOpen && (
        <ViewRemorqueDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          remorque={selectedRow}
        />
      )}

      {editDialogOpen && (
        <EditRemorqueDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          remorque={selectedRow}
          onSave={handleSave}
        />
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.idRemorque}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        style={{ border: "none", marginLeft: 30 }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette remorque ? Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Supprimer
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
        <Alert onClose={handleCloseSuccess} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={isFailed}
        autoHideDuration={6000}
        onClose={handleCloseFailed}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseFailed} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
