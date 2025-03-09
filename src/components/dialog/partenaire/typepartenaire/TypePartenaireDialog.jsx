import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import typePartenaireService from "../../../../service/partenaire/typePartenaireService"; // Import du service

const TypePartenaireDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    libelle: "",
    definition: "",
    genre: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    typePartenaireService.create(formData)
      .then((response) => {
        console.log("Type de Partenaire ajouté :", response.data);
        onClose(); // Ferme le dialogue après l'ajout
      })
      .catch((error) => console.error("Erreur lors de l'ajout du type de partenaire:", error));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Type de Partenaire</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="libelle"
          label="Libellé"
          fullWidth
          value={formData.libelle}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="definition"
          label="Définition"
          fullWidth
          value={formData.definition}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="genre"
          label="Genre"
          fullWidth
          value={formData.genre}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TypePartenaireDialog;
