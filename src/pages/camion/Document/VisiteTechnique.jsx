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
import VisiteTechniqueDialog from "../../../components/dialog/Camion/Document/visiteTechnique/VisiteTechniqueDialog.jsx";
import ViewVisiteTechniqueDialog from "../../../components/dialog/Camion/Document/visiteTechnique/ViewVisiteTechniqueDialog.jsx";
import EditVisiteTechniqueDialog from "../../../components/dialog/Camion/Document/visiteTechnique/EditVisiteTechniqueDialog.jsx";
import visiteTechniqueService from "../../../service/camion/visiteTechniqueService";
import "../../../styles/DataGrid.css";
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

export default function VisiteTechnique() {
  const [visiteTechniqueDialogOpen, setVisiteTechniqueDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedVisitesFetch, setIsFailedVisitesFetch] = useState(false);
  const [isFailedVisiteDelete, setIsFailedVisiteDelete] = useState(false);
  const [isFailedVisiteUpdate, setIsFailedVisiteUpdate] = useState(false);
  const [isFailedVisiteCreate, setIsFailedVisiteCreate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visiteToDelete, setVisiteToDelete] = useState(null);

  // Load data when the component mounts
  useEffect(() => {
    fetchVisitesTechniques();
  }, []);

  // Fetch visites techniques from the backend
  const fetchVisitesTechniques = async () => {
    try {
      const response = await visiteTechniqueService.getAll();
      setRows(response.data);
      console.log("Visites techniques récupérées avec succès");
    } catch (error) {
      console.error("Erreur lors de la récupération des visites techniques:", error);
      setIsFailedVisitesFetch(true);
    }
  };

  // Open the dialog to add a new visite technique
  const handleOpenVisiteTechniqueDialog = () => setVisiteTechniqueDialogOpen(true);

  // Close the dialog to add a new visite technique
  const handleCloseVisiteTechniqueDialog = () => setVisiteTechniqueDialogOpen(false);

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
    setVisiteToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle the actual deletion
  const handleDelete = async () => {
    try {
      await visiteTechniqueService.delete(visiteToDelete);
      console.log("Visite technique supprimée avec succès");
      setIsSuccess(true);
      setDeleteDialogOpen(false);
      fetchVisitesTechniques(); // Refresh the data
    } catch (error) {
      console.error("Erreur lors de la suppression de la visite technique:", error);
      setIsFailedVisiteDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  // Close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setVisiteToDelete(null);
  };

  // Handle save action for updated visite technique
  const handleSave = async (updatedVisite) => {
    fetchVisitesTechniques();
    setEditDialogOpen(false);
  };

  // Handle create action for new visite technique
  const handleCreate =  () => {
    fetchVisitesTechniques();
    setVisiteTechniqueDialogOpen(false);
    setIsSuccess(true);
  };


  // Close the error messages
  const handleCloseFailedVisitesFetch = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedVisitesFetch(false);
  };

  const handleCloseFailedVisiteDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedVisiteDelete(false);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
  };



  // Define columns for the DataGrid
  const columns = [
    { field: "centreVisite", headerName: "Centre de Visite", flex: 1 },
    { field: "dateVisite", headerName: "Date de Visite", flex: 1 },
    { field: "dateExpiration", headerName: "dateExpiration", flex: 1 },
    { field: "resultatVisite", headerName: "resultatVisite", flex: 1 },
    { field: "observations", headerName: "observations", flex: 1 },
    { field: "camion", headerName: "Immatriculation", flex: 1 },

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
        <button className="blue-button" onClick={handleOpenVisiteTechniqueDialog}>
          <p>Nouvelle visite technique</p>
        </button>
      </div>

      {/* Dialog to add a new visite technique */}
      {visiteTechniqueDialogOpen && (
        <VisiteTechniqueDialog
          open={visiteTechniqueDialogOpen}
          onClose={handleCloseVisiteTechniqueDialog}
          onCreate={handleCreate}
        />
      )}

      {/* Dialog to view visite technique details */}
      {viewDialogOpen && (
        <ViewVisiteTechniqueDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          visiteId={selectedRow.id}
        />
      )}

      {/* Dialog to edit a visite technique */}
      {editDialogOpen && (
        <EditVisiteTechniqueDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          visiteId={selectedRow.id}
          onUpdate={handleSave}
        />
      )}

      {/* DataGrid to display visites techniques */}
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
            Are you sure you want to delete this visite technique? This action cannot
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
        open={isFailedVisitesFetch}
        autoHideDuration={3000}
        onClose={handleCloseFailedVisitesFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedVisitesFetch}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to fetch visites techniques!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedVisiteDelete}
        autoHideDuration={3000}
        onClose={handleCloseFailedVisiteDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedVisiteDelete}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to delete visite technique!
        </MuiAlert>
      </Snackbar>

      
    </Box>
  );
}