import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid } from "@mui/material";
import chauffeurService from "../../../../service/partenaire/chaufeurService"; // Service pour envoyer les données au backend
import AdressDialog from "../AdressDialog";
export default function ChauffeurDialog({ open, onClose, chauffeur }) {
    const [openAdress, setOpenAdress] = useState(false);
  
  const [formData, setFormData] = useState({
    idChauffeur: "",
    nom: "",
    prenom: "",
    CNI: "",
    email: "",
    telephone: "",
    cnss: "",
    dateRecrutement: "",
    disponibilite: "",
  });

  useEffect(() => {
    if (chauffeur) {
      setFormData({
        idChauffeur: chauffeur.idChauffeur || "",
        nom: chauffeur.nom || "",
        prenom: chauffeur.prenom || "",
        CNI: chauffeur.CNI || "",
        email: chauffeur.email || "",
        telephone: chauffeur.telephone || "",
        cnss: chauffeur.cnss || "",
        dateRecrutement: chauffeur.dateRecrutement || "",
        disponibilite: chauffeur.disponibilite || "",
      });
    }
  }, [chauffeur]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Vous pouvez créer ou mettre à jour un chauffeur en fonction de l'ID
    if (formData.idChauffeur) {
      // Update existing chauffeur
      chauffeurService.update(formData.idChauffeur, formData)
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du chauffeur:", error);
        });
    } else {
      // Create new chauffeur
      chauffeurService.create(formData)
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Erreur lors de la création du chauffeur:", error);
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{chauffeur ? "Modifier le Chauffeur" : "Ajouter un Chauffeur"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nom"
              name="nom"
              fullWidth
              value={formData.nom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Prénom"
              name="prenom"
              fullWidth
              value={formData.prenom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CNI"
              name="CNI"
              fullWidth
              value={formData.CNI}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Téléphone"
              name="telephone"
              fullWidth
              value={formData.telephone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CNSS"
              name="cnss"
              fullWidth
              value={formData.cnss}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date de Recrutement"
              name="dateRecrutement"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.dateRecrutement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Disponibilité"
              name="disponibilite"
              fullWidth
              value={formData.disponibilite}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {chauffeur ? "Sauvegarder" : "Ajouter"}
        </Button>
        <Button  color="primary" onClick={() => setOpenAdress(true)} sx={{ mr: 2 }}>
                    Ajouter une Adresse
                  </Button>
      </DialogActions>

            <AdressDialog open={openAdress} onClose={() => setOpenAdress(false)} />
      
    </Dialog>
  );
}
