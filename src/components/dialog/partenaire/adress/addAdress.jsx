import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function AddAdress({ open, onClose, onAdd }) {
  const [newAdress, setNewAdress] = useState({
    type: "",
    rue: "",
    ville: "",
    codePostal: "",
    pays: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewAdress({ ...newAdress, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newAdress.type) newErrors.type = "Le type est obligatoire";
    if (!newAdress.rue) newErrors.rue = "La rue est obligatoire";
    if (!newAdress.ville) newErrors.ville = "La ville est obligatoire";
    if (!newAdress.codePostal)
      newErrors.codePostal = "Le code postal est obligatoire";
    if (!newAdress.pays) newErrors.pays = "Le pays est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onAdd(newAdress);
      setNewAdress({
        type: "",
        rue: "",
        ville: "",
        codePostal: "",
        pays: "",
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter une Adresse</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Type d'adresse"
          name="type"
          fullWidth
          value={newAdress.type}
          onChange={handleChange}
          error={!!errors.type}
          helperText={errors.type}
          placeholder="Ex: Domicile, Travail, Livraison..."
        />
        <TextField
          margin="dense"
          label="Rue"
          name="rue"
          fullWidth
          value={newAdress.rue}
          onChange={handleChange}
          error={!!errors.rue}
          helperText={errors.rue}
        />
        <TextField
          margin="dense"
          label="Ville"
          name="ville"
          fullWidth
          value={newAdress.ville}
          onChange={handleChange}
          error={!!errors.ville}
          helperText={errors.ville}
        />
        <TextField
          margin="dense"
          label="Code Postal"
          name="codePostal"
          fullWidth
          value={newAdress.codePostal}
          onChange={handleChange}
          error={!!errors.codePostal}
          helperText={errors.codePostal}
        />
        <TextField
          margin="dense"
          label="Pays"
          name="pays"
          fullWidth
          value={newAdress.pays}
          onChange={handleChange}
          error={!!errors.pays}
          helperText={errors.pays}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
