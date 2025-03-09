import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import TypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/TypePartenaireDialog.jsx"; // Créez le dialogue pour ajouter un type de partenaire
import typePartenaireService from "../../service/partenaire/typePartenaireService"; // Import du service
import VoirTypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/VoirTypePartenaireDialog.jsx"; // Créez le dialogue pour voir un type de partenaire
import ModifierTypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/ModifierTypePartenaireDialog.jsx"; // Créez le dialogue pour modifier un type de partenaire

const rows   = [
  { idTypePartenaire: 1, libelle: "Partenaire A", definition: "Définition A", genre: "Genre A" },
  { idTypePartenaire: 2, libelle: "Partenaire B", definition: "Définition B", genre: "Genre B" },
  { idTypePartenaire: 3, libelle: "Partenaire C", definition: "Définition C", genre: "Genre C" },
  { idTypePartenaire: 4, libelle: "Partenaire D", definition: "Définition D", genre: "Genre D" },
  { idTypePartenaire: 5, libelle: "Partenaire E", definition: "Définition E", genre: "Genre E" },
];

const columns = (handleVoir, handleModifier, handleDelete) => [
  { field: "idTypePartenaire", headerName: "ID", width: 90 },
  { field: "libelle", headerName: "Libellé", flex: 1 },
  { field: "definition", headerName: "Définition", flex: 1 },
  { field: "genre", headerName: "Genre", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    width: 250,
    renderCell: (params) => (
      <strong>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleVoir(params.row)}
          style={{ marginRight: 8 }}
        >
          Voir
        </Button>
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={() => handleModifier(params.row)}
          style={{ marginRight: 8 }}
        >
          Modifier
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.row.idTypePartenaire)}
        >
          Supprimer
        </Button>
      </strong>
    ),
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function TypePartenaire() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voirDialogOpen, setVoirDialogOpen] = useState(false);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState(null);
  const [rows1, setRows] = useState([]);

  useEffect(() => {
    fetchTypePartenaires();
  }, []);

  const fetchTypePartenaires = () => {
    typePartenaireService.getAll()
      .then((response) => setRows(response.data))
      .catch((error) => console.error("Erreur:", error));
  };

  const handleDelete = (id) => {
    typePartenaireService.delete(id)
      .then(() => {
        setRows(rows.filter((row) => row.idTypePartenaire !== id));
      })
      .catch((error) => console.error("Erreur suppression:", error));
  };

  const handleVoir = (typePartenaire) => {
    setSelectedTypePartenaire(typePartenaire);
    setVoirDialogOpen(true);
  };

  const handleModifier = (typePartenaire) => {
    setSelectedTypePartenaire(typePartenaire);
    setModifierDialogOpen(true);
  };

  return (
    <div>
      <h1>Gestion des Types de Partenaires :</h1>

      <Box sx={{ height: 500, width: "100%" }}>
        <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>
          Ajouter un Type de Partenaire
        </Button>

        {dialogOpen && <TypePartenaireDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />}
        {voirDialogOpen && <VoirTypePartenaireDialog open={voirDialogOpen} onClose={() => setVoirDialogOpen(false)} typePartenaire={selectedTypePartenaire} />}
        {modifierDialogOpen && <ModifierTypePartenaireDialog open={modifierDialogOpen} onClose={() => setModifierDialogOpen(false)} typePartenaire={selectedTypePartenaire} onUpdate={fetchTypePartenaires} />}

        <DataGrid
          rows={rows}
          columns={columns(handleVoir, handleModifier, handleDelete)}
          getRowId={(row) => row.idTypePartenaire}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar }}
          sx={{
            "@media print": {
              ".MuiDataGrid-toolbarContainer": { display: "none" },
            },
          }}
        />
      </Box>
    </div>
  );
}