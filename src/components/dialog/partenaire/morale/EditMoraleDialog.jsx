import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function EditMoraleDialog({ open, onClose, partenaire, onSave }) {
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier le Partenaire</DialogTitle>
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
          name="ice"
          label="ICE"
          value={formData.ice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="numeroRC"
          label="Numéro RC"
          value={formData.numeroRC}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="abreviation"
          label="Abréviation"
          value={formData.abreviation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="formeJuridique"
          label="Forme Juridique"
          value={formData.formeJuridique}
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