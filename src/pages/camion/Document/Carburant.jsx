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
import Typography from "@mui/material/Typography";
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
  const [stats, setStats] = useState({
    coutTotal: 0,
    distanceTotal: 0,
    quantityTotal: 0,
    prixMoyen: 0,
    tauxConsommation: 0
  });

  // Load data when the component mounts
  useEffect(() => {
    fetchCarburants();
    fetchStatistics(); // Add this line

  }, []);

  const fetchStatistics = async () => {
    try {
      const responses = await Promise.all([
        carburantService.getCoutTotal(),
        carburantService.getDistanceTotal(),
        carburantService.getQuantityTotal(),
        carburantService.getPrixMoyenne(),
        carburantService.getTauxConsommation()
      ]);
  
      setStats({
        coutTotal: responses[0].data,
        distanceTotal: responses[1].data,
        quantityTotal: responses[2].data,
        prixMoyen: responses[3].data,
        tauxConsommation: responses[4].data
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

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
  const handleCloseCarburantDialog = () => {
    setCarburantDialogOpen(false);
    fetchCarburants();
  }


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
      console.log(updatedCarburant);
      fetchCarburants();
      setEditDialogOpen(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du carburant:", error);
      setIsFailedCarburantUpdate(true);
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
      field: "quantiteLitres",
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
      field: "montantActuel",
      headerName: "montantActuel",
      flex: 1,
      type: "number",
    },
    {
      field: "consommation",
      headerName: "consommation",
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
    }
    ,
    {
      field: "station",
      headerName: "station",
      flex: 1,
      valueGetter: (params) => {
        return params ? params.name : "N/A";
      },
    },
    {
      field: "camion",
      headerName: "camion",
      flex: 1,
      valueGetter: (params) => {
        return params ? params.immatriculation : "N/A";
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

  const StatsDisplay = () => (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      mb: 4,
      p: 2,
      backgroundColor: '#f5f5f5',
      borderRadius: 1,
      boxShadow: 1
    }}>
      <StatCard 
        title="Coût Total" 
        value={`${stats.coutTotal.toFixed(2)} €`} 
        icon="€"
      />
      <StatCard 
        title="Distance Totale" 
        value={`${stats.distanceTotal.toFixed(2)} km`} 
        icon="🚛"
      />
      <StatCard 
        title="Quantité Totale" 
        value={`${stats.quantityTotal.toFixed(2)} L`} 
        icon="⛽"
      />
      <StatCard 
        title="Prix Moyen" 
        value={`${stats.prixMoyen.toFixed(2)} €/L`} 
        icon="💲"
      />
      <StatCard 
        title="Consommation Moyenne" 
        value={`${stats.tauxConsommation.toFixed(2)} L/100km`} 
        icon="📊"
      />
    </Box>
  );
  
  const StatCard = ({ title, value, icon }) => (
    <Box sx={{
      flex: 1,
      minWidth: 150,
      p: 2,
      backgroundColor: 'white',
      borderRadius: 1,
      boxShadow: 1,
      textAlign: 'center'
    }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>
        {value}
      </Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        {icon}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <div className="buttons">
        <button className="blue-button" onClick={handleOpenCarburantDialog}>
          <p>Nouveau Carburant</p>
        </button>
      </div>
      
    {/* Add this line */}
    <StatsDisplay />

      {/* Dialog to add a carburant */}
      {carburantDialogOpen && (
        <CarburantDialog
          open={carburantDialogOpen}
          onClose={handleCloseCarburantDialog}
        />
      )}

      {/* Dialog to view carburant details */}
      {viewDialogOpen && (
        <ViewCarburantDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          carburantId={selectedRow.id}
        />
      )}

      {/* Dialog to edit a carburant */}
      {editDialogOpen && (
        <EditCarburantDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          carburant={selectedRow}
          onUpdate={handleSave}
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
