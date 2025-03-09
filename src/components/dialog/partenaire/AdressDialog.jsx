import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function AdressDialog({ open, onClose }) {
  const [adressData, setAdressData] = React.useState({
    rue: "",
    ville: "",
    codePostal: "",
    pays: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdressData({ ...adressData, [name]: value });
  };

  const handleSubmit = () => {
    if (Object.values(adressData).some((val) => val.trim() === "")) {
      alert("Tous les champs doivent être remplis !");
      return;
    }
    console.log("Adresse Data:", adressData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter Adresse</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Rue"
          name="rue"
          value={adressData.rue}
          onChange={handleInputChange}
          margin="normal"
          autoFocus
        />
        <TextField
          fullWidth
          label="Ville"
          name="ville"
          value={adressData.ville}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Code Postal"
          name="codePostal"
          type="number"
          value={adressData.codePostal}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Pays"
          name="pays"
          value={adressData.pays}
          onChange={handleInputChange}
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
