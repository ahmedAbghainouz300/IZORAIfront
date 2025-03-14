import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Enum pour TypeCarburant
const TypeCarburant = {
  DIESEL: "DIESEL",
  ESSENCE: "ESSENCE",
  ELECTRIQUE: "ELECTRIQUE",
  HYBRIDE: "HYBRIDE",
};

export default function EditCarburantDialog({ open, onClose, carburant, onSave }) {
  const [formData, setFormData] = useState(carburant);

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
      <DialogTitle>Modifier le Carburant</DialogTitle>
      <DialogContent>
        <TextField
          name="dateRemplissage"
          label="Date de Remplissage"
          value={formData.dateRemplissage}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="quantity"
          label="Quantité (L)"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="prixParLitre"
          label="Prix par Litre (€)"
          value={formData.prixParLitre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="kilometrageActuel"
          label="Kilométrage Actuel"
          value={formData.kilometrageActuel}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type de Carburant</InputLabel>
          <Select
            name="typeCarburant"
            value={formData.typeCarburant}
            onChange={handleChange}
            label="Type de Carburant"
          >
            {Object.values(TypeCarburant).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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