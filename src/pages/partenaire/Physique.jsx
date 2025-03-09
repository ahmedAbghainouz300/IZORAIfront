import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import PhysiqueDialog from "../../components/dialog/partenaire/PhysiqueDialogue";
import physiqueService from "../../service/partenaire/physiqueService"; 
const columns = [
  { field: "idPartenaire", headerName: "ID", width: 90 },
  {
    field: "nom",
    headerName: "Nom",
    flex: 1,
    editable: true,
  },
  {
    field: "prenom",
    headerName: "Prénom",
    flex: 1,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    editable: true,
  },
  {
    field: "telephone",
    headerName: "Téléphone",
    flex: 1,
    editable: true,
  },
  {
    field: "CNI",
    headerName: "CNI",
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

export default function Physique() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rows, setRows] = useState([]);

  
  useEffect(() => {
    physiqueService.getAll()
      .then((response) => setRows(response.data))
      .catch((error) => console.error("Erreur:", error));
  }, [])

  

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <h1>Gestion des Partenaires Physiques :</h1>

      <Box sx={{ height: 500, width: "100%" }}>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
          Ajouter un Partenaire Physique
        </Button>

        {dialogOpen && <PhysiqueDialog open={dialogOpen} onClose={handleCloseDialog} />}

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.idPartenaire} // Assure que l'ID est bien reconnu
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
