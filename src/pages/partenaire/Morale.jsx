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
import "../../styles/DataGrid.css";

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

  useEffect(() => {
    fetchAllMorales();
  }, []);

  const fetchAllMorales = () => {
    moraleService
      .getAll()
      .then((response) => {
        setRows(response.data);
        console.log(rows);
        console.log(response.data);
      })
      .catch((error) => console.error("Erreur:", error));
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleView = (partenaire) => {
    setSelectedPartenaire(partenaire);
    setViewDialogOpen(true);
  };

  const handleEdit = (partenaire) => {
    fetchAllMorales();
    setSelectedPartenaire(partenaire);
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    // Mettre à jour les données dans l'état
    fetchAllMorales();
    setEditDialogOpen(false);
  };

  const handleDelete = (idPartenaire) => {
    moraleService
      .delete(idPartenaire)
      .then(() => {
        // Mettre à jour les données en appelant fetchAllMorales, pas besoin de filtrer les lignes
        fetchAllMorales();
      })
      .catch((error) =>
        console.error("Erreur lors de la suppression :", error)
      );
  };

  // Définir les colonnes à l'intérieur du composant pour accéder aux fonctions
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
      headerName: "Libellé",
      flex: 1,
      valueGetter: (params) => {
        return params && params.libelle ? params.libelle : "N/A";
      },
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
            onClick={() => handleDelete(params.row.idPartenaire)}
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
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Ajouter un Partenaire Moral
        </Button>

        {dialogOpen && (
          <MoraleDialog open={dialogOpen} onClose={handleCloseDialog} />
        )}

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.idPartenaire}
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

      {/* Dialogue pour Voir les Détails */}
      {viewDialogOpen && (
        <ViewMoraleDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          partenaire={selectedPartenaire}
        />
      )}

      {/* Dialogue pour Modifier */}
      {editDialogOpen && (
        <EditMoraleDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          partenaire={selectedPartenaire}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
