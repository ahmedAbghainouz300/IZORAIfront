import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import typePartenaireService from "../../../../service/partenaire/typePartenaireService";

const TypePartenaireDialog = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    libelle: "",
    definition: "",
    genre: "",
  });
  const [errors, setErrors] = useState({
    libelle: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (name === "libelle" && value.trim() !== "") {
      setErrors({ ...errors, libelle: false });
    }
  };

  const validateForm = () => {
    const newErrors = {
      libelle: formData.libelle.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    typePartenaireService
      .create(formData)
      .then((response) => {
        onAdd();
        onClose(); // Ferme le dialogue après l'ajout
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout du type de partenaire:", error)
      );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un Type de Partenaire</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="libelle"
          label="Libellé *"
          fullWidth
          value={formData.libelle}
          onChange={handleInputChange}
          error={errors.libelle}
          helperText={errors.libelle ? "Ce champ est obligatoire" : ""}
          required
        />
        <TextField
          margin="dense"
          name="definition"
          label="Définition"
          fullWidth
          value={formData.definition}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="genre"
          label="Genre"
          fullWidth
          value={formData.genre}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TypePartenaireDialog;
