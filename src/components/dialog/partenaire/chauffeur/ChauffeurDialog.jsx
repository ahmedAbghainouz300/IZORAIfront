import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid } from "@mui/material";
import chauffeurService from "../../../../service/partenaire/chaufeurService"; // Assurez-vous que le chemin est correct
import AdressDialog from "../AdressDialog";

export default function ChauffeurDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    CNI: "",
    email: "",
    telephone: "",
    cnss: "",
    dateRecrutement: "",
    disponibilite: "",
    adresses: [], // Tableau pour stocker les adresses

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddAdress = (newAdresse) => {
    setFormData((prevData) => ({
      ...prevData,
      adresses: [...prevData.adresses, newAdresse], // Ajouter la nouvelle adresse
    }));
  };

  const handleSubmit = () => {
    // Créer un nouveau chauffeur
    chauffeurService.create(formData)
      .then(() => {
        onClose(); // Fermer le dialogue après la création
        setFormData({ // Réinitialiser le formulaire
          nom: "",
          prenom: "",
          CNI: "",
          email: "",
          telephone: "",
          cnss: "",
          dateRecrutement: "",
          disponibilite: "",
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la création du chauffeur:", error);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Chauffeur</DialogTitle>
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

        
        {/* Section pour afficher les adresses */}
        <div style={{ marginTop: "20px" }}>
          <h4>Adresses</h4>
          {formData.adresses.map((adresse, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Adresse {index + 1}:</strong> {adresse.rue}, {adresse.ville}, {adresse.codePostal}, {adresse.pays}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
        <Button color="primary" onClick={() => setOpenAdress(true)} sx={{ mr: 2 }}>
          Ajouter une Adresse
        </Button>
      </DialogActions>

      <AdressDialog open={openAdress} onClose={() => setOpenAdress(false)} onSave={handleAddAdress} />
    </Dialog>
  );
}