import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function KilometrageDialog({ open, onClose }) {
  const [kilometrageData, setKilometrageData] = React.useState({
    dateEnregistrement: "",
    kilometrageActuel: "",
    dernierEntretien: "",
    prochainEntretien: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKilometrageData({ ...kilometrageData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Kilométrage Data:", kilometrageData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter Kilométrage</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Date d'Enregistrement"
          name="dateEnregistrement"
          value={kilometrageData.dateEnregistrement}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Kilométrage Actuel"
          name="kilometrageActuel"
          value={kilometrageData.kilometrageActuel}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Dernier Entretien"
          name="dernierEntretien"
          value={kilometrageData.dernierEntretien}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Prochain Entretien"
          name="prochainEntretien"
          value={kilometrageData.prochainEntretien}
          onChange={handleInputChange}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}
