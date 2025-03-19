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
import CabineDialog from "../../components/dialog/Camion/cabinet/CabineDialog";
import ViewCabineDialog from "../../components/dialog/Camion/cabinet/ViewCabineDialog";
import EditCabineDialog from "../../components/dialog/Camion/cabinet/EditCabineDialog";
import camionService from "../../service/camion/camionService";
import "../../styles/cabine.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog"; // Import Dialog
import DialogActions from "@mui/material/DialogActions"; // Import DialogActions
import DialogContent from "@mui/material/DialogContent"; // Import DialogContent
import DialogContentText from "@mui/material/DialogContentText"; // Import DialogContentText
import DialogTitle from "@mui/material/DialogTitle"; // Import DialogTitle
import Button from "@mui/material/Button"; // Import Button

  // Custom Toolbar with only the CSV/Excel Export Button
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

export default function Cabine() {
  const [cabineDialogOpen, setCabineDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedCamionsFetch, setIsFailedCamionsFetch] = useState(false);
  const [isFailedCamionDelete, setIsFailedCamionDelete] = useState(false);
  const [isFailedCamionUpdate, setIsFailedCamionUpdate] = useState(false);
  const [isFailedCamionCreate, setIsFailedCamionCreate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [camionToDelete, setCamionToDelete] = useState(null); // State to store the camion to delete

  // Load data when the component mounts or when refreshFlag changes
  useEffect(() => {
    fetchCamions();
  });

  // Function to fetch data from the backend
  const fetchCamions = async () => {
    try {
      const response = await camionService.getAll();
      setRows(response.data);
      console.log("Camions récupérés avec succès");
    } catch (error) {
      console.error("Erreur lors de la récupération des camions:", error);
      setIsFailedCamionsFetch(true);
    }
  };

  // Open the dialog to add a cabine
  const handleOpenCabineDialog = () => setCabineDialogOpen(true);

  // Close the dialog to add a cabine
  const handleCloseCabineDialog = () => setCabineDialogOpen(false);

  // Handle actions
  const handleView = (row) => {
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

    const handleEdit = (row) => {
      setSelectedRow(row);
      setEditDialogOpen(true);
    };

  // Open the delete confirmation dialog
  const handleDeleteClick = (immatriculation) => {
    setCamionToDelete(immatriculation);
    setDeleteDialogOpen(true);
  };

  // Handle the actual deletion
  const handleDelete = async () => {
    try {
      await camionService.delete(camionToDelete);
      console.log("Camion supprimé avec succès");
      setIsSuccess(true);
      setDeleteDialogOpen(false);
      fetchCamions(); // Refresh the data
    } catch (error) {
      console.error("Erreur lors de la suppression du camion:", error);
      setIsFailedCamionDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  // Close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCamionToDelete(null);
  };

  const handleSave = async (updatedCabine) => {
    try {
      await camionService.update(updatedCabine.immatriculation, updatedCabine);
      setRows(
        rows.map((row) =>
          row.immatriculation === updatedCabine.immatriculation
            ? updatedCabine
            : row
        )
      );
      setEditDialogOpen(false);
      setIsSuccess(true);
      fetchCamions();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du camion:", error);
      setIsFailedCamionUpdate(true);
    }
  };

  const handleCreate = async (newCabine) => {
    try {
      const response = await camionService.create(newCabine);
      setRows([...rows, response.data]);
      setCabineDialogOpen(false);
      setIsSuccess(true);
      fetchCamions();
    } catch (error) {
      console.error("Erreur lors de l'ajout du camion:", error);
      setIsFailedCamionCreate(true);
    }
  };

  ////////////////////////////////
  //// Close Success message ////
  ////////////////////////////////
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
  };

  ////////////////////////////////
  //// Close the error messages ////
  ////////////////////////////////

  const handleCloseFailedCamionsFetch = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCamionsFetch(false);
  };

  const handleCloseFailedCamionDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCamionDelete(false);
  };

  const handleCloseFailedCamionUpdate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCamionUpdate(false);
  };

  const handleCloseFailedCamionCreate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCamionCreate(false);
  };

  // Define columns
  const columns = [
    { field: "immatriculation", headerName: "ID", width: 90 },
    { field: "typeCabine", headerName: "Type de Cabine", flex: 1 },
    {
      field: "poidsMax",
      headerName: "Poids Max (kg)",
      flex: 1,
      type: "number",
    },
    {
      field: "consommation",
      headerName: "Consommation (L/100km)",
      flex: 1,
      type: "number",
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
            onClick={() => handleDeleteClick(params.row.immatriculation)}
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
          <button className="blue-button" onClick={handleOpenCabineDialog}>
            <p>Nouvelle Cabine</p>
          </button>
        </div>

      {/* Dialog to add a cabine */}
      {cabineDialogOpen && (
        <CabineDialog
          open={cabineDialogOpen}
          onClose={handleCloseCabineDialog}
          onCreate={handleCreate}
          onSave={handleCreate}
        />
      )}

      {/* Dialog to view cabine details */}
      {viewDialogOpen && (
        <ViewCabineDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          cabine={selectedRow}
        />
      )}

      {/* Dialog to edit a cabine */}
      {editDialogOpen && (
        <EditCabineDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          cabine={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* DataGrid */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.immatriculation}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
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

      {/* ////////////////// Delete Confirmation Dialog //////////////////////*/}
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
            Are you sure you want to delete this camion? This action cannot be
            undone.
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

      {/* //////////////////Success Snackbar /////////////*/}
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

      {/* ////////////Error Snackbars //////////*/}
      <Snackbar
        open={isFailedCamionsFetch}
        autoHideDuration={3000}
        onClose={handleCloseFailedCamionsFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCamionsFetch}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to fetch camions!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCamionDelete}
        autoHideDuration={3000}
        onClose={handleCloseFailedCamionDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCamionDelete}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to delete camion!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCamionUpdate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCamionUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCamionUpdate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to update camion! Verify the entered data.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCamionCreate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCamionCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCamionCreate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to create camion! Verify the entered data.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
