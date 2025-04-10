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
import emballageService from "../../../../service/marchandise/emballageService";

export default function EmballageDialog({ open, onClose, onSave, emballage }) {
  const [formData, setFormData] = useState({
    nom: "",
    capacite: 0,
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      if (emballage) {
        setFormData({
          nom: emballage.nom || "",
          capacite: emballage.capacite || "",
        });
      } else {
        setFormData({
          nom: "",
          capacite: 0,
        });
      }
    }
  }, [open, emballage]);

  const handleSubmit = async () => {
    if (!formData.nom.trim()) {
      enqueueSnackbar("Le libellé est obligatoire", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      if (emballage) {
        await emballageService.update(emballage.id, formData);
        enqueueSnackbar("Emballage mis à jour avec succès", {
          variant: "success",
        });
      } else {
        await emballageService.create(formData);
        enqueueSnackbar("Emballage créé avec succès", { variant: "success" });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving emballage:", error);
      const errorMessage =
        error.response?.data?.message ||
        `Erreur lors de ${emballage ? "la modification" : "la création"}`;
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
        {emballage ? "Modifier l'emballage" : "Ajouter un nouvel emballage"}
      </DialogTitle>
      <DialogContent>
        <TextField
          name="nom"
          label="Libellé *"
          fullWidth
          value={formData.nom}
          onChange={handleChange}
          margin="normal"
          required
          autoFocus
          disabled={loading}
        />
        <TextField
          name="capacite"
          label="capacite"
          fullWidth
          value={formData.capacite}
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
          {loading ? "En cours..." : emballage ? "Mettre à jour" : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
