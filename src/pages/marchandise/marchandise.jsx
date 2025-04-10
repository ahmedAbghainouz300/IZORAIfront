import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import MarchandiseDialog from "../../components/dialog/marchandise/MarchandiseDialog";
import marchandiseService from "../../service/marchandise/marchandiseService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewMarchandiseDialog from "../../components/dialog/marchandise/ViewMarchandiseDialog";
import { useSnackbar } from "notistack";
import "../../styles/DataGrid.css";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Marchandise() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMarchandise, setSelectedMarchandise] = useState(null);
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchAllMarchandises = () => {
    marchandiseService
      .getAll()
      .then((response) => {
        setRows(response.data);
        console.log(response.data);
      })

      .catch((error) => {
        console.error("Erreur:", error);
        enqueueSnackbar("Erreur lors du chargement des marchandises", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    fetchAllMarchandises();
  }, []);

  const handleOpenDialog = () => {
    setSelectedMarchandise(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleView = (marchandise) => {
    setSelectedMarchandise(marchandise);
    setViewDialogOpen(true);
  };

  const handleEdit = (marchandise) => {
    setSelectedMarchandise(marchandise);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette marchandise ?")
    ) {
      marchandiseService
        .delete(id)
        .then(() => {
          enqueueSnackbar("Marchandise supprimée avec succès", {
            variant: "success",
          });
          fetchAllMarchandises();
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression:", error);
          enqueueSnackbar(
            error.response?.data?.message || "Erreur lors de la suppression",
            { variant: "error" }
          );
        });
    }
  };

  const columns = [
    { field: "libelle", headerName: "Libellé", flex: 1 },
    { field: "codeMarchandise", headerName: "Code Marchandise", flex: 1 },
    {
      field: "categorie",
      headerName: "Catégorie",
      flex: 1,
      valueGetter: (params) => {
        return params ? params.libelle : "N/A";
      },
    },
    {
      field: "unite",
      headerName: "Unite",
      flex: 1,
      valueGetter: (params) => {
        return params ? params.unite : "N/A";
      },
    },
    {
      field: "emballage",
      headerName: "Emballage",
      flex: 1,
      valueGetter: (params) => {
        return params ? params.nom : "N/A";
      },
    },
    { field: "description", headerName: "Description", flex: 1 },
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
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Gestion des Marchandises</h1>

      <Box>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Ajouter une Marchandise
        </Button>

        <MarchandiseDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          marchandise={selectedMarchandise}
          onSave={fetchAllMarchandises}
        />

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

      {viewDialogOpen && (
        <ViewMarchandiseDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          marchandiseId={selectedMarchandise?.id}
        />
      )}
    </div>
  );
}
