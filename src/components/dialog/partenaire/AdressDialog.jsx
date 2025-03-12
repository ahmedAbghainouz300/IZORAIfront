import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function AdressDialog({ open, onClose, onSave }) {
  const [adressData, setAdressData] = React.useState({
    rue: "",
    ville: "",
    codePostal: "",
    pays: "",
  });

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdressData({ ...adressData, [name]: value });
  };

  // Enregistrer l'adresse et réinitialiser le formulaire
  const handleSave = () => {
    onSave(adressData); // Envoyer les données de l'adresse au parent
    onClose(); // Fermer le dialogue
    setAdressData({ rue: "", ville: "", codePostal: "", pays: "" }); // Réinitialiser le formulaire
  };

  // Valider et soumettre le formulaire
  const handleSubmit = () => {
    if (Object.values(adressData).some((val) => val.trim() === "")) {
      alert("Tous les champs doivent être remplis !");
      return;
    }
    handleSave(); // Appeler handleSave pour enregistrer l'adresse
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