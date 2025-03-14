import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function EditRemorqueDialog({ open, onClose, remorque, onSave }) {
  const [formData, setFormData] = useState(remorque);

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
      <DialogTitle>Modifier la Remorque</DialogTitle>
      <DialogContent>
        <TextField
          name="immatriculation"
          label="Immatriculation"
          value={formData.immatriculation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="typeRemorque"
          label="Type de Remorque"
          value={formData.typeRemorque}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="volumesStockage"
          label="Volume de Stockage (m³)"
          value={formData.volumesStockage}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="poidsVide"
          label="Poids à Vide (kg)"
          value={formData.poidsVide}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="poidsChargeMax"
          label="Poids Charge Max (kg)"
          value={formData.poidsChargeMax}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
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