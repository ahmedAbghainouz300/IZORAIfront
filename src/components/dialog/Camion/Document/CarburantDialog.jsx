import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function CarburantDialog({ vopen, onClose }) {
  const [carburantData, setCarburantData] = React.useState({
    dateRemplissage: "",
    quantiteLitres: "",
    prixParLitre: "",
    kilometrageActuel: "",
    typeCarburant: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarburantData({ ...carburantData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Carburant Data:", carburantData);
    onClose();
  };

  return (
    <Dialog open={vopen} onClose={onClose}>
      <DialogTitle>Ajouter Carburant</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Date de Remplissage"
          name="dateRemplissage"
          value={carburantData.dateRemplissage}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Quantité (Litres)"
          name="quantiteLitres"
          value={carburantData.quantiteLitres}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Prix par Litre"
          name="prixParLitre"
          value={carburantData.prixParLitre}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Kilométrage Actuel"
          name="kilometrageActuel"
          value={carburantData.kilometrageActuel}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Type de Carburant"
          name="typeCarburant"
          value={carburantData.typeCarburant}
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
