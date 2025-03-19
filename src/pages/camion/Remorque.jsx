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
import remorqueService from "../../service/camion/remorqueService"; // Import the service
import "../../styles/DataGrid.css";

// Custom Toolbar with only the CSV/Excel Export Button
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

  // Load data when the component mounts
  React.useEffect(() => {
    fetchRemorques();
  }, []);

  // Fetch all remorques from the backend
  const fetchRemorques = async () => {
    try {
      const response = await remorqueService.getAll();
      setRows(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching remorques:", error);
    }
  };

  // Open the dialog to add a remorque
  const handleOpenRemorqueDialog = () => setRemorqueDialogOpen(true);

  // Close the dialog to add a remorque
  const handleCloseRemorqueDialog = () => setRemorqueDialogOpen(false);

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

  // Handle delete action
  const handleDelete = async (idRemorque) => {
    console.log("Deleting remorque with ID:", idRemorque); // Debugging log
    try {
      await remorqueService.delete(idRemorque);
      console.log("Remorque deleted:", idRemorque);
      fetchRemorques(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting remorque:", error);
    }
  };

  // Handle save action (update)
  const handleSave = async (updatedRemorque) => {
    try {
      await remorqueService.update(updatedRemorque.idRemorque, updatedRemorque);
      setRows(
        rows.map((row) =>
          row.idRemorque === updatedRemorque.idRemorque ? updatedRemorque : row
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating remorque:", error);
    }
  };

  // Handle create action (add new remorque)
  const handleCreate = async (newRemorque) => {
    try {
      console.log(newRemorque);
      const response = await remorqueService.create(newRemorque);
      setRows([...rows, response.data]);
      setRemorqueDialogOpen(false);
    } catch (error) {
      console.error("Error adding remorque:", error);
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "idRemorque", headerName: "ID", width: 90 },
    {
      field: "typeRemorque",
      headerName: "Type de Remorque",
      flex: 1,
      valueGetter: (params) => {
        return params ? params.type : "N/A";
      },
    },
    {
      field: "volumesStockage",
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
    { field: "disponible", headerName: "Disponible", flex: 1, type: "boolean" },
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
            onClick={() => handleDelete(params.row.idRemorque)} // Pass idRemorque correctly
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

      {/* Dialog to add a new remorque */}
      {remorqueDialogOpen && (
        <RemorqueDialog
          open={remorqueDialogOpen}
          onClose={handleCloseRemorqueDialog}
          onCreate={handleCreate}
        />
      )}

      {/* Dialog to view remorque details */}
      {viewDialogOpen && (
        <ViewRemorqueDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          remorque={selectedRow}
        />
      )}

      {/* Dialog to edit a remorque */}
      {editDialogOpen && (
        <EditRemorqueDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          remorque={selectedRow}
          onSave={handleSave}
        />
      )}

      {/* DataGrid to display remorques */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.idRemorque} // Use idRemorque as the row ID
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
            ".MuiDataGrid-toolbarContainer": {
              display: "none",
            },
          },
        }}
      />
    </Box>
  );
}
