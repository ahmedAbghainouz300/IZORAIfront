import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import TypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/TypePartenaireDialog.jsx"; // Créez le dialogue pour ajouter un type de partenaire
import typePartenaireService from "../../service/partenaire/typePartenaireService"; // Import du service
import VoirTypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/VoirTypePartenaireDialog.jsx"; // Créez le dialogue pour voir un type de partenaire
import ModifierTypePartenaireDialog from "../../components/dialog/partenaire/typepartenaire/ModifierTypePartenaireDialog.jsx"; // Créez le dialogue pour modifier un type de partenaire
import "../../styles/DataGrid.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";

const columns = (handleVoir, handleModifier, handleDelete) => [
  // { field: "idTypePartenaire", headerName: "ID", width: 90 },
  { field: "libelle", headerName: "Libellé", flex: 1 },
  { field: "definition", headerName: "Définition", flex: 1 },
  { field: "genre", headerName: "Genre", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    width: 350,
    renderCell: (params) => (
      <strong>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleVoir(params.row)}
          style={{ marginRight: 8 }}
        >
          <VisibilityIcon/>
        </IconButton>
        <IconButton
          variant="contained"
          color="warning"
          size="small"
          onClick={() => handleModifier(params.row)}
          style={{ marginRight: 8 }}
        >
          <EditIcon/>
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.row.idTypePartenaire)}
        >
          <DeleteIcon/>
        </IconButton>
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
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchTypePartenaires();
  }, []);

  const fetchTypePartenaires = () => {
    typePartenaireService
      .getAll()
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => console.error("Erreur:", error));
  };

  const handleDelete = (id) => {
    typePartenaireService
      .delete(id)
      .then(() => {
        setRows(rows.filter((row) => row.idTypePartenaire !== id));
        fetchTypePartenaires();

      })
      .catch((error) => console.error("Erreur suppression:", error));
  };

  const handleVoir = (typePartenaire) => {
    setSelectedTypePartenaire(typePartenaire);
    setVoirDialogOpen(true);
  };

  const handleModifier = (typePartenaire) => {
    setSelectedTypePartenaire(typePartenaire);
    fetchTypePartenaires();

    setModifierDialogOpen(true);
  };

  return (
    <div>
      <h1>Gestion des Types de Partenaires :</h1>

      <Box>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Ajouter un Type de Partenaire
        </Button>

        {dialogOpen && (
          <TypePartenaireDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          />
        )}
        {voirDialogOpen && (
          <VoirTypePartenaireDialog
            open={voirDialogOpen}
            onClose={() => setVoirDialogOpen(false)}
            typePartenaire={selectedTypePartenaire}
          />
        )}
        {modifierDialogOpen && (
          <ModifierTypePartenaireDialog
            open={modifierDialogOpen}
            onClose={() => setModifierDialogOpen(false)}
            typePartenaire={selectedTypePartenaire}
            onUpdate={fetchTypePartenaires}
          />
        )}

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
