import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function EditAssuranceDialog({ open, onClose, assurance, onSave }) {
  const [formData, setFormData] = useState(assurance);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier l'Assurance</DialogTitle>
      <DialogContent>
        <TextField
          name="numeroContrat"
          label="Numéro de Contrat"
          value={formData.numeroContrat}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="company"
          label="Compagnie"
          value={formData.company}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="typeCouverture"
          label="Type de Couverture"
          value={formData.typeCouverture}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="montant"
          label="Montant"
          value={formData.montant}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="dateDebut"
          label="Date de Début"
          value={formData.dateDebut}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="dateExpiration"
          label="Date d'Expiration"
          value={formData.dateExpiration}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="primeAnnuelle"
          label="Prime Annuelle"
          value={formData.primeAnnuelle}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="numCarteVerte"
          label="Numéro Carte Verte"
          value={formData.numCarteVerte}
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