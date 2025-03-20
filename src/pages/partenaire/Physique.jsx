import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import PhysiqueDialog from "../../components/dialog/partenaire/physique/PhysiqueDialogue";
import physiqueService from "../../service/partenaire/physiqueService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewPhysiqueDialog from "../../components/dialog/partenaire/physique/ViewPhysiqueDialog"; // Dialogue pour voir les détails
import EditPhysiqueDialog from "../../components/dialog/partenaire/physique/EditPhysiqueDialog"; // Dialogue pour modifier
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
    fetchAllPhysiques();
  }, []);

  const fetchAllPhysiques = () => {
    physiqueService
      .getAll()
      .then((response) => {
        setRows(response.data);
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
    setSelectedPartenaire(partenaire);

    setEditDialogOpen(true);
    fetchAllPhysiques();
  };

  const handleSave = (Partenaire) => {
    // Mettre à jour les données dans l'état
    setSelectedPartenaire(Partenaire)
    fetchAllPhysiques();
    setEditDialogOpen(false);
  };
  const handleAdd = () => {
    fetchAllPhysiques();
    setDialogOpen(false);
  };

  const handleDelete = (idPartenaire) => {
    physiqueService
      .delete(idPartenaire)
      .then(() => {
        setRows(rows.filter((row) => row.idPartenaire !== idPartenaire));
        console.log(rows);
        fetchAllPhysiques();

      })
      .catch((error) =>
        console.error("Erreur lors de la suppression :", error)
      );
  };

  // Définir les colonnes à l'intérieur du composant pour accéder aux fonctions
  const columns = [
    { field: "nom", headerName: "Nom", flex: 1, editable: true },
    { field: "prenom", headerName: "Prénom", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "telephone", headerName: "Téléphone", flex: 1, editable: true },
    { field: "cni", headerName: "CNI", flex: 1, editable: true },
    {
      field: "typePartenaire",
      headerName: "Libellé ",
      flex: 1,
      valueGetter: (params) => {
        const typePartenaire = params?.row?.typePartenaire;
        return typePartenaire && typePartenaire.libelle ? typePartenaire.libelle : "Non défini";
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
      <h1>Gestion des Partenaires Physiques :</h1>

      <Box>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Ajouter un Partenaire Physique
        </Button>

        {dialogOpen && (
          <PhysiqueDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            onAdd={handleAdd}
          />
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
