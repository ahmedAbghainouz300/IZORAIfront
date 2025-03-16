import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function EditPhysiqueDialog({ open, onClose, partenaire, onSave }) {
  const [formData, setFormData] = useState(partenaire);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData); // Envoyer les données modifiées au parent
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier le Partenaire Physique</DialogTitle>
      <DialogContent>
        <TextField
          name="nom"
          label="Nom"
          value={formData.nom}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="prenom"
          label="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="telephone"
          label="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="CNI"
          label="CNI"
          value={formData.CNI}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}