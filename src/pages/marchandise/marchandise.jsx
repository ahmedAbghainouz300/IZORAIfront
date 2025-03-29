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
import MarchandiseDialog from "../../components/dialog/Marchandise/MarchandiseDialog";
import EditMarchandiseDialog from "../../components/dialog/Marchandise/EditMarchandiseDialog";
import "../../styles/DataGrid.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import marchandiseService from "../../service/marchandise/MarchandiseService";
import ViewMarchandiseDialog from "../../components/dialog/marchandise/ViewMarchandiseDialog";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedFetch, setIsFailedFetch] = useState(false);
  const [isFailedDelete, setIsFailedDelete] = useState(false);
  const [isFailedUpdate, setIsFailedUpdate] = useState(false);
  const [isFailedCreate, setIsFailedCreate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marchandiseToDelete, setMarchandiseToDelete] = useState(null);

  useEffect(() => {
    fetchMarchandises();
  }, []);

  const fetchMarchandises = async () => {
    try {
      const response = await marchandiseService.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching marchandises:", error);
      setIsFailedFetch(true);
    }
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

  const handleDelete = async () => {
    try {
      await marchandiseService.delete(marchandiseToDelete);
      setIsSuccess(true);
      setDeleteDialogOpen(false);
      fetchMarchandises();
    } catch (error) {
      console.error("Error deleting marchandise:", error);
      setIsFailedDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = async (updatedMarchandise) => {
    try {
      await marchandiseService.update(
        updatedMarchandise.id,
        updatedMarchandise
      );
      setRows(
        rows.map((row) =>
          row.id === updatedMarchandise.id ? updatedMarchandise : row
        )
      );
      setEditDialogOpen(false);
      setIsSuccess(true);
      fetchMarchandises();
    } catch (error) {
      console.error("Error updating marchandise:", error);
      setIsFailedUpdate(true);
    }
  };

  const handleCreate = async (newMarchandise) => {
    try {
      const response = await marchandiseService.create(newMarchandise);
      setRows([...rows, response.data]);
      setMarchandiseDialogOpen(false);
      setIsSuccess(true);
      fetchMarchandises();
    } catch (error) {
      console.error("Error creating marchandise:", error);
      setIsFailedCreate(true);
    }
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setIsSuccess(false);
  };

  const handleCloseFailedFetch = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedFetch(false);
  };

  const handleCloseFailedDelete = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedDelete(false);
  };

  const handleCloseFailedUpdate = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedUpdate(false);
  };

  const handleCloseFailedCreate = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedCreate(false);
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
        <button className="blue-button" onClick={handleOpenMarchandiseDialog}>
          <p>Nouvelle Marchandise</p>
        </button>
      </div>

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
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        style={{ border: "none", marginLeft: 30 }}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette marchandise ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="success">Opération réussie!</MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedFetch}
        autoHideDuration={3000}
        onClose={handleCloseFailedFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error">
          Échec de la récupération des marchandises
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedDelete}
        autoHideDuration={3000}
        onClose={handleCloseFailedDelete}
      >
        <MuiAlert severity="error">Échec de la suppression</MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedUpdate}
        autoHideDuration={3000}
        onClose={handleCloseFailedUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error">Échec de la mise à jour</MuiAlert>
      </Snackbar>

      <Snackbar
        open={isFailedCreate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="error">Échec de la création</MuiAlert>
      </Snackbar>
    </Box>
  );
}
