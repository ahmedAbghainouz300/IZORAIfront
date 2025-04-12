import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Snackbar,
  DialogContentText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import categorieService from "../../../service/marchandise/categorieService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CategorieSelect({ open, onClose, onSelectCategorie }) {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [editingCategorie, setEditingCategorie] = useState(null);
  const [newCategorie, setNewCategorie] = useState({
    categorie: "",
    description: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categorieToDelete, setCategorieToDelete] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailedFetch, setIsFailedFetch] = useState(false);
  const [isFailedDelete, setIsFailedDelete] = useState(false);
  const [isFailedUpdate, setIsFailedUpdate] = useState(false);
  const [isFailedCreate, setIsFailedCreate] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Fetch categories when the modal opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await categorieService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsFailedFetch(true);
    }
  };

  const validateForm = () => {
    if (!newCategorie.categorie.trim()) {
      setValidationError("Le nom de la catégorie est obligatoire");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleAddCategorie = async () => {
    if (!validateForm()) return;

    try {
      const response = await categorieService.create(newCategorie);
      setCategories([...categories, response.data]);
      setNewCategorie({ categorie: "", description: "" });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error adding category:", error);
      setIsFailedCreate(true);
    }
  };

  const handleEditCategorie = async () => {
    if (!validateForm()) return;

    try {
      if (!editingCategorie?.id) {
        console.error("ID is undefined for editing category");
        return;
      }

      const response = await categorieService.update(
        editingCategorie.id,
        newCategorie
      );
      setCategories(
        categories.map((item) =>
          item.id === editingCategorie.id ? response.data : item
        )
      );
      setEditingCategorie(null);
      setNewCategorie({ libelle: "", description: "" });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error updating category:", error);
      setIsFailedUpdate(true);
    }
  };

  const handleDeleteClick = (id) => {
    setCategorieToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await categorieService.delete(categorieToDelete);
      setCategories(categories.filter((item) => item.id !== categorieToDelete));
      setDeleteDialogOpen(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error deleting category:", error);
      setIsFailedDelete(true);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setIsSuccess(false);
  };

  const handleCloseFailedFetch = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedFetch(false);
  };

  const handleCloseFailedDelete = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedDelete(false);
  };

  const handleCloseFailedUpdate = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedUpdate(false);
  };

  const handleCloseFailedCreate = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedCreate(false);
  };

  const filteredCategories = categories.filter((categorie) => {
    const searchString = filter.toLowerCase();
    return (
      categorie.categorie?.toLowerCase().includes(searchString) ||
      categorie.description?.toLowerCase().includes(searchString)
    );
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner une Catégorie</DialogTitle>
      <DialogContent>
        {/* Filter Input */}
        <TextField
          fullWidth
          label="Rechercher"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          margin="normal"
        />

        {/* Add/Edit Form */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Nom de la catégorie*"
            value={newCategorie.categorie}
            onChange={(e) => {
              setNewCategorie({ ...newCategorie, categorie: e.target.value });
              if (validationError && e.target.value.trim()) {
                setValidationError("");
              }
            }}
            error={!!validationError}
            helperText={validationError}
            required
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={newCategorie.description}
            onChange={(e) =>
              setNewCategorie({ ...newCategorie, description: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={
              editingCategorie ? handleEditCategorie : handleAddCategorie
            }
            disabled={!newCategorie.categorie.trim()}
          >
            {editingCategorie ? "Modifier" : "Ajouter"}
          </Button>
        </Box>

        {/* Categories Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((categorie) => (
                <TableRow key={categorie.id}>
                  <TableCell>{categorie.categorie}</TableCell>
                  <TableCell>{categorie.description}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditingCategorie(categorie);
                        setNewCategorie({
                          categorie: categorie.categorie,
                          description: categorie.description,
                        });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(categorie.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelectCategorie(categorie)}
                    >
                      Sélectionner
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette catégorie ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success and Error Snackbars */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">Opération réussie!</Alert>
      </Snackbar>

      <Snackbar
        open={isFailedFetch}
        autoHideDuration={3000}
        onClose={handleCloseFailedFetch}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Échec de la récupération des catégories</Alert>
      </Snackbar>

      <Snackbar
        open={isFailedDelete}
        autoHideDuration={3000}
        onClose={handleCloseFailedDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Échec de la suppression</Alert>
      </Snackbar>

      <Snackbar
        open={isFailedUpdate}
        autoHideDuration={3000}
        onClose={handleCloseFailedUpdate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Échec de la mise à jour</Alert>
      </Snackbar>

      <Snackbar
        open={isFailedCreate}
        autoHideDuration={3000}
        onClose={handleCloseFailedCreate}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Échec de la création</Alert>
      </Snackbar>
    </Dialog>
  );
}
