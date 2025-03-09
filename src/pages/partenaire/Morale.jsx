import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import MoraleDialog from "../../components/dialog/partenaire/MoraleDialog"; // Créez le dialogue pour ajouter un partenaire moral
import moraleService from "../../service/partenaire/moraleService"; // Import du service

// Colonnes pour le DataGrid
const columns = [
  { field: "idMorale", headerName: "ID", width: 90 },
  {
    field: "nom",
    headerName: "Nom",
    flex: 1,
    editable: true,
  },
  {
    field: "ice",
    headerName: "ICE",
    flex: 1,
    editable: true,
  },
  {
    field: "numeroRC",
    headerName: "Numéro RC",
    flex: 1,
    editable: true,
  },
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
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Morale() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   moraleService.getAll()  // On récupère les données via le service
  //     .then((response) => setRows(response.data))
  //     .catch((error) => console.error("Erreur:", error));
  // }, []);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <div>
      <h1>Gestion des Partenaires Moraux :</h1>

      <Box sx={{ height: 500, width: "100%" }}>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Ajouter un Partenaire Moral
        </Button>

        {dialogOpen && <MoraleDialog open={dialogOpen} onClose={handleCloseDialog} />}

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.idMorale} // Assure que l'ID est bien reconnu
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
    </div>
  );
}
