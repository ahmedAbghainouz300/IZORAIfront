import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import typePartenaireService from "../../../../service/partenaire/typePartenaireService";

export default function ModifierTypePartenaireDialog({ open, onClose, typePartenaire, onUpdate }) {
  const [formData, setFormData] = useState({
    libelle: typePartenaire?.libelle || "",
    definition: typePartenaire?.definition || "",
    genre: typePartenaire?.genre || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!typePartenaire) return;

    typePartenaireService.update(typePartenaire.idTypePartenaire, formData)
      .then(() => {
        onUpdate(); // Rafraîchir la liste après modification
        onClose(); // Fermer le dialogue
      })
      .catch((error) => console.error("Erreur lors de la mise à jour :", error));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le Type de Partenaire</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Libellé"
          name="libelle"
          fullWidth
          margin="dense"
          value={formData.libelle}
          onChange={handleChange}
        />
        <TextField
          label="Définition"
          name="definition"
          fullWidth
          margin="dense"
          value={formData.definition}
          onChange={handleChange}
        />
        <TextField
          label="Genre"
          name="genre"
          fullWidth
          margin="dense"
          value={formData.genre}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">Annuler</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}
