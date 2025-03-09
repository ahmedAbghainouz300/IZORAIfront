import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
// import chauffeurService from "../../../../service/partenaire/chaufeurService";

export default function ModifierChauffeurDialog({ open, onClose, chauffeur, onUpdate }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    CNI: "",
    email: "",
    telephone: "",
    cnss: "",
    dateRecrutement: "",
    disponibilite: "",
    adresse: "",
  });

  // Mettre à jour les champs avec les infos du chauffeur sélectionné
  useEffect(() => {
    if (chauffeur) {
      setFormData({
        nom: chauffeur.nom || "",
        prenom: chauffeur.prenom || "",
        CNI: chauffeur.CNI || "",
        email: chauffeur.email || "",
        telephone: chauffeur.telephone || "",
        cnss: chauffeur.cnss || "",
        dateRecrutement: chauffeur.dateRecrutement || "",
        disponibilite: chauffeur.disponibilite || "",
        adresse: chauffeur.adresse || "",
      });
    }
  }, [chauffeur]);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    chauffeurService.update(chauffeur.idChauffeur, formData)
      .then(() => {
        onUpdate(); // Rafraîchir la liste des chauffeurs
        onClose(); // Fermer le dialogue
      })
      .catch((error) => console.error("Erreur lors de la mise à jour :", error));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le Chauffeur</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nom"
          name="nom"
          fullWidth
          value={formData.nom}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Prénom"
          name="prenom"
          fullWidth
          value={formData.prenom}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="CNI"
          name="CNI"
          fullWidth
          value={formData.CNI}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Téléphone"
          name="telephone"
          fullWidth
          value={formData.telephone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="CNSS"
          name="cnss"
          fullWidth
          value={formData.cnss}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Date de Recrutement"
          name="dateRecrutement"
          type="date"
          fullWidth
          value={formData.dateRecrutement}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Disponibilité"
          name="disponibilite"
          fullWidth
          value={formData.disponibilite}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Adresse"
          name="adresse"
          fullWidth
          value={formData.adresse}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}
