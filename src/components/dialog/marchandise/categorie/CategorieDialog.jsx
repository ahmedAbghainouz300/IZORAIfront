import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useSnackbar } from "notistack";
import categorieService from "../../../../service/marchandise/categorieService";

export default function CategorieDialog({ open, onClose, onSave, categorie }) {
  const [formData, setFormData] = useState({
    categorie: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Initialize form when opening or when categorie changes
  useEffect(() => {
    if (open) {
      if (categorie) {
        setFormData({
          categorie: categorie.categorie || "",
          description: categorie.description || ""
        });
      } else {
        setFormData({
          categorie: "",
          description: ""
        });
      }
    }
  }, [open, categorie]);

  const handleSubmit = async () => {
    if (!formData.categorie.trim()) {
      enqueueSnackbar("Le categorie est obligatoire", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      if (categorie) {
        // Update existing category
        await categorieService.update(categorie.id, formData);
        enqueueSnackbar("Catégorie mise à jour avec succès", { variant: "success" });
      } else {
        // Create new category
        await categorieService.create(formData);
        enqueueSnackbar("Catégorie créée avec succès", { variant: "success" });
      }
      
      onSave(); // Refresh parent component
      onClose(); // Close dialog
    } catch (error) {
      console.error("Error saving category:", error);
      const errorMessage = error.response?.data?.message || 
        `Erreur lors de ${categorie ? "la modification" : "la création"}`;
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {categorie ? "Modifier la catégorie" : "Ajouter une nouvelle catégorie"}
      </DialogTitle>
      <DialogContent>
        <TextField
          name="categorie"
          label="Libellé *"
          fullWidth
          value={formData.categorie}
          onChange={handleChange}
          margin="normal"
          required
          autoFocus
          disabled={loading}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
        >
          {loading ? "En cours..." : (categorie ? "Mettre à jour" : "Créer")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}