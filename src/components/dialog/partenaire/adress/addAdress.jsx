import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function AddAdress({ open, onClose, onAdd }) {
  const [newAdress, setNewAdress] = useState({
    rue: "",
    ville: "",
    codePostal: "",
    pays: "",
  });

  const [errors, setErrors] = useState({}); // Pour gérer les erreurs de validation

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewAdress({ ...newAdress, [name]: value });
    // Effacer l'erreur lorsque l'utilisateur commence à saisir
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newAdress.rue) newErrors.rue = "La rue est obligatoire";
    if (!newAdress.ville) newErrors.ville = "La ville est obligatoire";
    if (!newAdress.codePostal) newErrors.codePostal = "Le code postal est obligatoire";
    if (!newAdress.pays) newErrors.pays = "Le pays est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si aucune erreur
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Valider le formulaire avant de soumettre

    try {
      await onAdd(newAdress); // Appeler la fonction `onAdd` du parent
      setNewAdress({ rue: "", ville: "", codePostal: "", pays: "" }); // Réinitialiser le formulaire
      onClose(); // Fermer le dialogue
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse :", error);
      // Afficher un message d'erreur à l'utilisateur (par exemple, avec un Snackbar)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter une Adresse</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Rue"
          name="rue"
          fullWidth
          value={newAdress.rue}
          onChange={handleChange}
          error={!!errors.rue}
          helperText={errors.rue}
        />
        <TextField
          margin="dense"
          label="Ville"
          name="ville"
          fullWidth
          value={newAdress.ville}
          onChange={handleChange}
          error={!!errors.ville}
          helperText={errors.ville}
        />
        <TextField
          margin="dense"
          label="Code Postal"
          name="codePostal"
          fullWidth
          value={newAdress.codePostal}
          onChange={handleChange}
          error={!!errors.codePostal}
          helperText={errors.codePostal}
        />
        <TextField
          margin="dense"
          label="Pays"
          name="pays"
          fullWidth
          value={newAdress.pays}
          onChange={handleChange}
          error={!!errors.pays}
          helperText={errors.pays}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}