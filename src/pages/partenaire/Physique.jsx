import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import PhysiqueDialog from "../../components/dialog/partenaire/PhysiqueDialogue";
import physiqueService from "../../service/partenaire/physiqueService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewPhysiqueDialog from "../../components/dialog/partenaire/ViewPhysiqueDialog"; // Dialogue pour voir les détails
import EditPhysiqueDialog from "../../components/dialog/partenaire/EditPhysiqueDialog"; // Dialogue pour modifier
import "../../styles/DataGrid.css";

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
  const [selectedPartenaire, setSelectedPartenaire] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    physiqueService
      .getAll()
      .then((response) => setRows(response.data))
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleView = (partenaire) => {
    setSelectedPartenaire(partenaire);
    setViewDialogOpen(true);
  };

  const handleEdit = (partenaire) => {
    setSelectedPartenaire(partenaire);
    setEditDialogOpen(true);
  };

  const handleSave = (updatedPartenaire) => {
    // Mettre à jour les données dans l'état
    setRows(
      rows.map((row) =>
        row.idPartenaire === updatedPartenaire.idPartenaire
          ? updatedPartenaire
          : row
      )
    );
    setEditDialogOpen(false);
  };

  const handleDelete = (idPartenaire) => {
    physiqueService
      .delete(idPartenaire)
      .then(() => {
        setRows(rows.filter((row) => row.idPartenaire !== idPartenaire));
      })
      .catch((error) =>
        console.error("Erreur lors de la suppression :", error)
      );
  };

  // Définir les colonnes à l'intérieur du composant pour accéder aux fonctions
  const columns = [
    { field: "idPartenaire", headerName: "ID", width: 90 },
    { field: "nom", headerName: "Nom", flex: 1, editable: true },
    { field: "prenom", headerName: "Prénom", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "telephone", headerName: "Téléphone", flex: 1, editable: true },
    { field: "CNI", headerName: "CNI", flex: 1, editable: true },
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
      <h1>Gestion des Partenaires Physiques :</h1>

      <Box>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Ajouter un Partenaire Physique
        </Button>

        {dialogOpen && (
          <PhysiqueDialog open={dialogOpen} onClose={handleCloseDialog} />
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
        <ViewPhysiqueDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          partenaire={selectedPartenaire}
        />
      )}

      {/* Dialogue pour Modifier */}
      {editDialogOpen && (
        <EditPhysiqueDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          partenaire={selectedPartenaire}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
