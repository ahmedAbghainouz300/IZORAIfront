import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function EditCarteGriseDialog({
  open,
  onClose,
  carteGrise,
  onSave,
}) {
  const [formData, setFormData] = useState(carteGrise || {});

  // Initialize formData when the dialog opens
  useEffect(() => {
    if (open) {
      console.log("Form Data Initialized:", carteGrise); // Debugging line
      setFormData(carteGrise || {});
    }
  }, [open, carteGrise]);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Field Changed:", name, value); // Debugging line
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    const payload = {
      ...formData,
    };
    console.log("Payload before save:", payload); // Debugging line
    onSave(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Carte Grise</DialogTitle>
      <DialogContent>
        <TextField
          name="marque"
          label="Marque"
          value={formData.marque || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="genre"
          label="Genre"
          value={formData.genre || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="numeroSerie"
          label="Numéro de Série"
          value={formData.numeroSerie || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="couleur"
          label="Couleur"
          value={formData.couleur || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="nombrePlace"
          label="Nombre de Places"
          value={formData.nombrePlace || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="puissanceFiscale"
          label="Puissance Fiscale"
          value={formData.puissanceFiscale || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="energie"
          label="Énergie"
          value={formData.energie || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="proprietaire"
          label="Propriétaire"
          value={formData.proprietaire || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="poidsVide"
          label="Poids à Vide (kg)"
          value={formData.poidsVide || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="poidsAutorise"
          label="Poids Autorisé (kg)"
          value={formData.poidsAutorise || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="dateMiseEnCirculation"
          label="Date de Mise en Circulation"
          value={formData.dateMiseEnCirculation || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="dateDelivrance"
          label="Date de Délivrance"
          value={formData.dateDelivrance || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
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
