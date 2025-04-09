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
import uniteService from "../../../../service/marchandise/uniteService";

export default function UniteDialog({ open, onClose, onSave, unite }) {
  const [formData, setFormData] = useState({
    unite: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      if (unite) {
        setFormData({
          unite: unite.unite || "",
          description: unite.description || "",
        });
      } else {
        setFormData({
          unite: "",
          description: "",
        });
      }
    }
  }, [open, unite]);

  const handleSubmit = async () => {
    if (!formData.unite.trim()) {
      enqueueSnackbar("Le libellé est obligatoire", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      if (unite) {
        await uniteService.update(unite.id, formData);
        enqueueSnackbar("Unité mise à jour avec succès", {
          variant: "success",
        });
      } else {
        await uniteService.create(formData);
        enqueueSnackbar("Unité créée avec succès", { variant: "success" });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving unit:", error);
      const errorMessage =
        error.response?.data?.message ||
        `Erreur lors de ${unite ? "la modification" : "la création"}`;
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {unite ? "Modifier l'unité" : "Ajouter une nouvelle unité"}
      </DialogTitle>
      <DialogContent>
        <TextField
          name="unite"
          label="Libellé *"
          fullWidth
          value={formData.unite}
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
          {loading ? "En cours..." : unite ? "Mettre à jour" : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
