import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { idID } from "@mui/material/locale";
import adressService from "../../../../service/partenaire/adressService";

export default function EditAdress({ open, onClose, adresse, onUpdate }) {
  const [formData, setFormData] = useState({
    idAdress: 0,
    type: "",
    rue: "",
    ville: "",
    codePostal: "",
    pays: "",
  });

  const handleEditAddress = async (editedAddress) => {
    try {
      console.log(editedAddress);
      await adressService.update(editedAddress.idAdress, editedAddress);
      alert("Adresse mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse :", error);
      alert("Erreur lors de la mise à jour de l'adresse.");
    }
  };

  // Mettre à jour formData lorsque `adresse` change
  useEffect(() => {
    if (adresse) {
      setFormData({
        idAdress: adresse.idAdress,
        rue: adresse.rue || "",
        ville: adresse.ville || "",
        codePostal: adresse.codePostal || "",
        pays: adresse.pays || "",
      });
    }
  }, [adresse]);

  // Gérer les changements de champs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer la soumission
  const handleSubmit = () => {
    if (
      !formData.rue ||
      !formData.ville ||
      !formData.codePostal ||
      !formData.pays
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    handleEditAddress(formData); // Fusionner les anciennes données avec les nouvelles
    onClose(); // Fermer le modal après la mise à jour
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier l'Adresse</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Rue"
          name="rue"
          fullWidth
          value={formData.rue}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Ville"
          name="ville"
          fullWidth
          value={formData.ville}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Code Postal"
          name="codePostal"
          fullWidth
          value={formData.codePostal}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Pays"
          name="pays"
          fullWidth
          value={formData.pays}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
