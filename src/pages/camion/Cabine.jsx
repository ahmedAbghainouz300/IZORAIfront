  import * as React from "react";
  import { useEffect, useState } from "react"; // Importez useEffect et useState
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
  import CabineDialog from "../../components/dialog/Camion/cabinet/CabineDialog";
  import ViewCabineDialog from "../../components/dialog/Camion/cabinet/ViewCabineDialog";
  import EditCabineDialog from "../../components/dialog/Camion/cabinet/EditCabineDialog";
  import camionService from "../../service/camion/camionService"; // Importez le service
  import "../../styles/cabine.css";

  // Custom Toolbar with only the CSV/Excel Export Button
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  export default function Cabine() {
    const [cabineDialogOpen, setCabineDialogOpen] = React.useState(false);
    const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    // Charger les données au montage du composant
    useEffect(() => {
      fetchCamions();
    }, []);

    // Fonction pour récupérer les données du backend
    const fetchCamions = async () => {
      try {
        const response = await camionService.getAll();
        setRows(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des camions:", error);
      }
    };

    // Ouvrir le dialogue pour ajouter une cabine
    const handleOpenCabineDialog = () => setCabineDialogOpen(true);

    // Fermer le dialogue pour ajouter une cabine
    const handleCloseCabineDialog = () => setCabineDialogOpen(false);

    // Gérer les actions
    const handleView = (row) => {
      setSelectedRow(row);
      setViewDialogOpen(true);
    };

    const handleEdit = (row) => {
      setSelectedRow(row);
      setEditDialogOpen(true);
    };

    const handleDelete = async (immatriculation) => {
      try {
        await camionService.delete(immatriculation);
        setRows(rows.filter((row) => row.immatriculation !== immatriculation));
        console.log("Camion supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression du camion:", error);
      }
    };

    const handleSave = async (updatedCabine) => {
      try {
        await camionService.update(updatedCabine.immatriculation, updatedCabine);
        setRows(rows.map((row) => (row.immatriculation === updatedCabine.immatriculation ? updatedCabine : row)));
        setEditDialogOpen(false);
        console.log("Camion mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du camion:", error);
      }
    };

    const handleCreate = async (newCabine) => {
      try {
        const response = await camionService.create(newCabine);
        setRows([...rows, response.data]);
        setCabineDialogOpen(false);
        console.log("Camion créé avec succès");
      } catch (error) {
        console.error("Erreur lors de la création du camion:", error);
      }
    };

    // Définir les colonnes
    const columns = [
      { field: "immatriculation", headerName: "ID", width: 90 },
      { field: "typeCabine", headerName: "Type de Cabine", flex: 1 },
      { field: "poidsMax", headerName: "Poids Max (kg)", flex: 1, type: "number" },
      { field: "consommation", headerName: "Consommation (L/100km)", flex: 1, type: "number" },
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
            <IconButton color="error" onClick={() => handleDelete(params.row.immatriculation)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ];

    return (
      <Box sx={{ height: 500, width: "100%" }}>
        <div className="buttons">
          <button className="blue-button" onClick={handleOpenCabineDialog}>
            <p>Nouvelle Cabine</p>
          </button>
        </div>

        {/* Dialogue pour ajouter une cabine */}
        {cabineDialogOpen && (
          <CabineDialog
            open={cabineDialogOpen}
            onClose={handleCloseCabineDialog}
            onCreate={handleCreate}
          />
        )}

        {/* Dialogue pour voir les détails d'une cabine */}
        {viewDialogOpen && (
          <ViewCabineDialog
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            cabine={selectedRow}
          />
        )}

        {/* Dialogue pour modifier une cabine */}
        {editDialogOpen && (
          <EditCabineDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            cabine={selectedRow}
            onSave={handleSave}
          />
        )}

        {/* Tableau */}
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.immatriculation}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar }}
          style={{ border: "none", marginLeft: 30 }}
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