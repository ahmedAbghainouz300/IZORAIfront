import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function EditCabineDialog({ open, onClose, cabine, onSave }) {
  const [formData, setFormData] = useState(cabine);

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
      <DialogTitle>Modifier la Cabine</DialogTitle>
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
          name="typeCabine"
          label="Type de Cabine"
          value={formData.typeCabine}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="poidsMax"
          label="Poids Max (kg)"
          value={formData.poidsMax}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="consommation"
          label="Consommation (L/100km)"
          value={formData.consommation}
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