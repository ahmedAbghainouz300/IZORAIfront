import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ChauffeurDialog from "../../components/dialog/partenaire/chauffeur/ChauffeurDialog";
import chauffeurService from "../../service/partenaire/chaufeurService";
import VoirChauffeurDialog from "../../components/dialog/partenaire/chauffeur/VoirChauffeurDialog"; // Nouveau dialogue pour voir les détails
import ModifierChauffeurDialog from "../../components/dialog/partenaire/chauffeur/ModifierChauffeurDialog..jsx";
import "../../styles/DataGrid.css";

const columns = (handleDelete, handleVoir, handleModifier) => [
  { field: "idPartenaire", headerName: "ID", width: 90 },
  { field: "nom", headerName: "Nom", flex: 1 },
  { field: "prenom", headerName: "Prénom", flex: 1 },
  { field: "CNI", headerName: "CNI", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "telephone", headerName: "Téléphone", flex: 1 },
  { field: "cnss", headerName: "CNSS", flex: 1 },
  { field: "dateRecrutement", headerName: "Date de Recrutement", flex: 1 },
  { field: "disponibilite", headerName: "Disponibilité", flex: 1 },
  { field: "adresse", headerName: "Adresse", flex: 1 },
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
          onClick={() => handleDelete(params.row.idPartenaire)}
          style={{ marginRight: 8 }}
        >
          Supprimer
        </Button>
      </strong>
    ),
  },
];

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ChauffeurDialog from "../../components/dialog/partenaire/chauffeur/ChauffeurDialog";
import chauffeurService from "../../service/partenaire/chaufeurService";
import VoirChauffeurDialog from "../../components/dialog/partenaire/chauffeur/VoirChauffeurDialog"; // Nouveau dialogue pour voir les détails
import ModifierChauffeurDialog from "../../components/dialog/partenaire/chauffeur/ModifierChauffeurDialog..jsx"; // Nouveau dialogue pour modifier les détails
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";

const columns = (handleDelete, handleVoir, handleModifier) => [
  { field: "idPartenaire", headerName: "ID", width: 90 },
  { field: "nom", headerName: "Nom", flex: 1 },
  { field: "prenom", headerName: "Prénom", flex: 1 },
  { field: "CNI", headerName: "CNI", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "telephone", headerName: "Téléphone", flex: 1 },
  { field: "cnss", headerName: "CNSS", flex: 1 },
  { field: "dateRecrutement", headerName: "Date de Recrutement", flex: 1 },
  { field: "disponibilite", headerName: "Disponibilité", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    width: 250,
    renderCell: (params) => (
      <strong>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleVoir(params.row)}
          style={{ marginRight: 8 }}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="warning"
          size="small"
          onClick={() => handleModifier(params.row)}
          style={{ marginRight: 8 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.row.idPartenaire)}
          style={{ marginRight: 8 }}
        >
          <DeleteIcon />
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

export default function Chauffeur() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voirDialogOpen, setVoirDialogOpen] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchChauffeurs();
  }, []);

  const fetchChauffeurs = () => {
    chauffeurService
      .getAll()
      .then((response) => setRows(response.data))
      .catch((error) => console.error("Erreur:", error));
  };

  const handleDelete = (id) => {
    chauffeurService
      .delete(id)
      .then(() => {
        setRows(rows.filter((row) => row.idPartenaire !== id));
        fetchChauffeurs();
      })
      .catch((error) => console.error("Erreur suppression:", error));
  };

  const handleVoir = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setVoirDialogOpen(true);
  };
  const handleModifier = () => {
    fetchChauffeurs();
    setModifierDialogOpen(true);
  };

  return (
    <div>
      <h1>Gestion des Chauffeurs :</h1>
      <Box>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          Ajouter un Chauffeur
        </Button>

        {dialogOpen && (
          <ChauffeurDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          />
        )}
        {voirDialogOpen && (
          <VoirChauffeurDialog
            open={voirDialogOpen}
            onClose={() => setVoirDialogOpen(false)}
            chauffeur={selectedChauffeur}
          />
        )}
        {modifierDialogOpen && (
          <ModifierChauffeurDialog
            open={modifierDialogOpen}
            onClose={() => setModifierDialogOpen(false)}
            chauffeur={selectedChauffeur}
            onUpdate={fetchChauffeurs}
          />
        )}

        <DataGrid
          rows={rows}
          columns={columns(handleDelete, handleVoir, handleModifier)}
          getRowId={(row) => row.idPartenaire}
          initialState={{
            pagination: { paginationModel: { pageSize: 4 } },
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
