import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function EditAssuranceDialog({
  open,
  onClose,
  assurance,
  onSave,
}) {
  const [formData, setFormData] = useState(assurance || {});

  // Initialize formData when the dialog opens
  useEffect(() => {
    if (open) {
      console.log("Form Data Initialized:", assurance); // Debugging line
      setFormData(assurance || {});
    }
  }, [open, assurance]);

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
      <DialogTitle>Modifier l'Assurance</DialogTitle>
      <DialogContent>
        <TextField
          name="numeroContrat"
          label="Numéro de Contrat"
          value={formData.numeroContrat || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="company"
          label="Compagnie"
          value={formData.company || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="typeCouverture"
          label="Type de Couverture"
          value={formData.typeCouverture || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="montant"
          label="Montant"
          value={formData.montant || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="dateDebut"
          label="Date de Début"
          value={formData.dateDebut || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="dateExpiration"
          label="Date d'Expiration"
          value={formData.dateExpiration || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="primeAnnuelle"
          label="Prime Annuelle"
          value={formData.primeAnnuelle || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="numCarteVerte"
          label="Numéro Carte Verte"
          value={formData.numCarteVerte || ""}
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
