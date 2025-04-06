import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { useSnackbar } from "notistack";
import marchandiseService from "../../../service/marchandise/marchandiseService";
import SelectDialogCategorie from "./categorie/SelectDialogCategorie";

export default function MarchandiseDialog({ open, onClose, marchandise, onSave }) {
  const [formData, setFormData] = useState({
    libelle: "",
    description: "",
    codeMarchandise: "",
    categorie: null
  });
  const [categorieDialogOpen, setCategorieDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Initialize form when opening or when marchandise changes
  useEffect(() => {
    if (open) {
      if (marchandise) {
        setFormData({
          libelle: marchandise.libelle || "",
          description: marchandise.description || "",
          codeMarchandise: marchandise.codeMarchandise || "",
          categorie: marchandise.categorie || null
        });
      } else {
        setFormData({
          libelle: "",
          description: "",
          codeMarchandise: "",
          categorie: null
        });
      }
    }
  }, [open, marchandise]);

  const handleSubmit = async () => {
    if (!formData.libelle.trim()) {
      enqueueSnackbar("Le libellé est obligatoire", { variant: "warning" });
      return;
    }

    if (!formData.categorie) {
      enqueueSnackbar("Veuillez sélectionner une catégorie", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const marchandiseData = {
        libelle: formData.libelle.trim(),
        description: formData.description.trim(),
        codeMarchandise: formData.codeMarchandise.trim(),
        categorie: { id: formData.categorie.id }
      };

      if (marchandise) {
        // Update existing marchandise
        await marchandiseService.update(marchandise.id, marchandiseData);
        enqueueSnackbar("Marchandise mise à jour avec succès", { variant: "success" });
      } else {
        // Create new marchandise
        await marchandiseService.create(marchandiseData);
        enqueueSnackbar("Marchandise créée avec succès", { variant: "success" });
      }
      
      onSave(); // Notify parent to refresh data
      onClose(); // Close dialog
    } catch (error) {
      console.error("Error saving marchandise:", error);
      const errorMessage = error.response?.data?.message || 
        `Erreur lors de ${marchandise ? "la modification" : "la création"}`;
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
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {marchandise ? "Modifier la marchandise" : "Ajouter une nouvelle marchandise"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="libelle"
            label="Libellé *"
            fullWidth
            value={formData.libelle}
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
          <TextField
            name="codeMarchandise"
            label="Code Marchandise"
            fullWidth
            value={formData.codeMarchandise}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Catégorie *"
            fullWidth
            value={formData.categorie?.libelle || ""}
            onClick={() => setCategorieDialogOpen(true)}
            InputProps={{ readOnly: true }}
            margin="normal"
            required
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
            {loading ? "En cours..." : (marchandise ? "Mettre à jour" : "Créer")}
          </Button>
        </DialogActions>
      </Dialog>

      <SelectDialogCategorie
        open={categorieDialogOpen}
        onClose={() => setCategorieDialogOpen(false)}
        onSelect={(categorie) => {
          setFormData(prev => ({ ...prev, categorie }));
          setCategorieDialogOpen(false);
        }}
      />
    </>
  );
}