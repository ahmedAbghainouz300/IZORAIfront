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
import CarburantDialog from "../../../components/dialog/Camion/Document/carburant/CarburantDialog";
import ViewCarburantDialog from "../../../components/dialog/Camion/Document/carburant/ViewCarburantDialog";
import EditCarburantDialog from "../../../components/dialog/Camion/Document/carburant/EditCarburantDialog";
import carburantService from "../../../service/camion/carburantService";
import "../../../styles/DataGrid.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Custom Toolbar with only the CSV/Excel Export Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Carburant() {
  const [carburantDialogOpen, setCarburantDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedCarburantsFetch, setIsFailedCarburantsFetch] = useState(false);
  const [isFailedCarburantDelete, setIsFailedCarburantDelete] = useState(false);
  const [isFailedCarburantUpdate, setIsFailedCarburantUpdate] = useState(false);
  const [isFailedCarburantCreate, setIsFailedCarburantCreate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carburantToDelete, setCarburantToDelete] = useState(null);

  // Load data when the component mounts
  useEffect(() => {
    fetchCarburants();
  }, []);

  // Fetch carburants from the backend
  const fetchCarburants = async () => {
    try {
      const response = await carburantService.getAll();
      setRows(response.data);
      console.log("Carburants récupérés avec succès");
    } catch (error) {
      console.error("Erreur lors de la récupération des carburants:", error);
      setIsFailedCarburantsFetch(true);
    }
  };

  // Open the dialog to add a carburant
  const handleOpenCarburantDialog = () => setCarburantDialogOpen(true);

  // Close the dialog to add a carburant
  const handleCloseCarburantDialog = () => setCarburantDialogOpen(false);

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
  const handleDeleteClick = (id) => {
    setCarburantToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle the actual deletion
  const handleDelete = async () => {
    try {
      await carburantService.delete(carburantToDelete);
      setRows(rows.filter((row) => row.id !== carburantToDelete));
      setIsSuccess(true);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du carburant:", error);
      setIsFailedCarburantDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  // Close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCarburantToDelete(null);
  };

  const handleSave = async (updatedCarburant) => {
    try {
      await carburantService.update(updatedCarburant.id, updatedCarburant);
      setRows(
        rows.map((row) =>
          row.id === updatedCarburant.id ? updatedCarburant : row
        )
      );
      setEditDialogOpen(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du carburant:", error);
      setIsFailedCarburantUpdate(true);
    }
  };

  const handleCreate = async (newCarburant) => {
    try {
      const response = await carburantService.create(newCarburant);
      setRows([...rows, response.data]);
      setCarburantDialogOpen(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la création du carburant:", error);
      setIsFailedCarburantCreate(true);
    }
  };

  // Close success message
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
  };

  // Close error messages
  const handleCloseFailedCarburantsFetch = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarburantsFetch(false);
  };

  const handleCloseFailedCarburantDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarburantDelete(false);
  };

  const handleCloseFailedCarburantUpdate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarburantUpdate(false);
  };

  const handleCloseFailedCarburantCreate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFailedCarburantCreate(false);
  };

  // Define columns
  const columns = [
    { field: "dateRemplissage", headerName: "Date de Remplissage", flex: 1.2 },
    {
      field: "quantity",
      headerName: "Quantité (L)",
      flex: 0.8,
      type: "number",
    },
    {
      field: "prixParLitre",
      headerName: "Prix par Litre (€)",
      flex: 1,
      type: "number",
    },
    {
      field: "kilometrageActuel",
      headerName: "Kilométrage Actuel",
      flex: 1,
      type: "number",
    },
    {
      field: "typeCarburant",
      headerName: "Type de Carburant",
      flex: 1,
      valueGetter: (params) => {
        return params ? params.type : "N/A";
      },
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
        <button className="blue-button" onClick={handleOpenCarburantDialog}>
          <p>Nouveau Carburant</p>
        </button>
      </div>

      {/* Dialog to add a carburant */}
      {carburantDialogOpen && (
        <CarburantDialog
          open={carburantDialogOpen}
          onClose={handleCloseCarburantDialog}
          onCreate={handleCreate}
        />
      )}

      {/* Dialog to view carburant details */}
      {viewDialogOpen && (
        <ViewCarburantDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          carburant={selectedRow}
        />
      )}

      {/* Dialog to edit a carburant */}
      {editDialogOpen && (
        <EditCarburantDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          carburant={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* DataGrid */}
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
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this carburant? This action cannot
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
        open={isFailedCarburantsFetch}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarburantsFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarburantsFetch}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to fetch carburants!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCarburantDelete}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarburantDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarburantDelete}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to delete carburant!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCarburantUpdate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarburantUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarburantUpdate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to update carburant! Verify the entered data.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isFailedCarburantCreate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCarburantCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseFailedCarburantCreate}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to create carburant! Verify the entered data.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
