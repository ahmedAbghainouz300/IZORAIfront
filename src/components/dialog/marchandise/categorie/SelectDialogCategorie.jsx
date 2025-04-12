import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import categorieService from "../../../../service/marchandise/categorieService";
import CategorieDialog from "./CategorieDialog";

export default function SelectDialogCategorie({ open, onClose, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [categorieDialogOpen, setCategorieDialogOpen] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = () => {
    categorieService
      .getAll()
      .then((res) => setCategories(res.data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        enqueueSnackbar("Erreur lors du chargement des catégories", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")
    ) {
      categorieService
        .delete(id)
        .then(() => {
          enqueueSnackbar("Catégorie supprimée avec succès", {
            variant: "success",
          });
          fetchCategories();
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
          enqueueSnackbar(
            error.response?.data?.message || "Erreur lors de la suppression",
            { variant: "error" }
          );
        });
    }
  };

  const handleEdit = (categorie) => {
    setSelectedCategorie(categorie);
    setCategorieDialogOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "categorie", headerName: "Libellé", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSelect(params.row)}
            sx={{ ml: 1 }}
          >
            Sélectionner
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Sélectionner une catégorie
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedCategorie(null);
              setCategorieDialogOpen(true);
            }}
            sx={{ float: "right", mr: 2 }}
          >
            Ajouter
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={categories}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <CategorieDialog
        open={categorieDialogOpen}
        onClose={() => {
          setCategorieDialogOpen(false);
          setSelectedCategorie(null);
        }}
        onSave={() => {
          fetchCategories();
          setCategorieDialogOpen(false);
          setSelectedCategorie(null);
        }}
        categorie={selectedCategorie}
      />
    </>
  );
}
