import React, { useState } from "react";
import {
  Dialog,
  InputLabel,
  TextField,
  Button,
  FormControl,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import moraleService from "../../../../service/partenaire/moraleService";
import AdressDialog from "../AdressDialog";
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";

export default function MoraleDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] = useState(false);

  // Utilisez formData pour gérer tous les champs du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    ice: "",
    numeroRC: "",
    abreviation: "",
    formeJuridique: "",
    typePartenaireId: null, // ID du type de partenaire sélectionné
    adresses: [], // Liste des adresses
  });

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Ajouter une nouvelle adresse
  const handleAddAdress = (newAdresse) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      adresses: [...prevFormData.adresses, newAdresse],
    }));
    setOpenAdress(false); // Fermer le modal d'adresse après ajout
  };

  // Validation du formulaire
  const validateForm = () => {
    const { nom, ice, numeroRC, abreviation, formeJuridique, typePartenaireId } = formData;
    if (!nom || !ice || !numeroRC || !abreviation || !formeJuridique || !typePartenaireId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    if (isNaN(ice) || isNaN(numeroRC)) {
      alert("ICE et Numéro RC doivent être des nombres.");
      return false;
    }
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = () => {
    if (!validateForm()) return;

    const newMorale = {
      nom: formData.nom,
      ice: Number(formData.ice), // Convertir en nombre
      numeroRC: Number(formData.numeroRC), // Convertir en nombre
      abreviation: formData.abreviation,
      formeJuridique: formData.formeJuridique,
      typePartenaireId: formData.typePartenaireId, // Utiliser l'ID du type de partenaire
      adresses: formData.adresses, // Liste des adresses
    };

    moraleService
      .create(newMorale)
      .then((response) => {
        console.log("Partenaire moral ajouté:", response);
        resetForm(); // Réinitialiser le formulaire
        onClose(); // Fermer le modal
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du partenaire moral:", error);
        alert("Une erreur est survenue lors de l'ajout du partenaire moral. Veuillez réessayer.");
      });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      ice: "",
      numeroRC: "",
      abreviation: "",
      formeJuridique: "",
      typePartenaireId: null,
      adresses: [],
    });
  };

  // Gestion de la sélection d'un type partenaire
  const handleSelectIdTypePartenaire = (selectedId) => {
    setFormData((prevData) => ({
      ...prevData,
      typePartenaireId: selectedId, // Mettre à jour l'ID du type de partenaire sélectionné
    }));
    setIsTypePartenaireModalOpen(false); // Fermer le modal après sélection
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Partenaire Moral</DialogTitle>
      <DialogContent>
        {/* Champ Nom */}
        <TextField
          label="Nom"
          fullWidth
          margin="normal"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
        />

        {/* Champ ICE */}
        <TextField
          label="ICE"
          fullWidth
          margin="normal"
          name="ice"
          value={formData.ice}
          onChange={handleInputChange}
        />

        {/* Champ Numéro RC */}
        <TextField
          label="Numéro RC"
          fullWidth
          margin="normal"
          name="numeroRC"
          value={formData.numeroRC}
          onChange={handleInputChange}
        />

        {/* Champ Abréviation */}
        <TextField
          label="Abreviation"
          fullWidth
          margin="normal"
          name="abreviation"
          value={formData.abreviation}
          onChange={handleInputChange}
        />

        {/* Champ Forme Juridique */}
        <TextField
          label="Forme Juridique"
          fullWidth
          margin="normal"
          name="formeJuridique"
          value={formData.formeJuridique}
          onChange={handleInputChange}
        />

        {/* Champ pour sélectionner le type de partenaire */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Type Partenaire</InputLabel>
          <TextField
            value={formData.typePartenaireId ? "Sélectionné" : "Aucun type sélectionné"}
            InputProps={{
              readOnly: true,
            }}
            onClick={() => setIsTypePartenaireModalOpen(true)}
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={() => setIsTypePartenaireModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner un Type Partenaire
          </Button>
        </FormControl>

        {/* Modal pour sélectionner le type de partenaire */}
        <TypePartenaireTable
          open={isTypePartenaireModalOpen}
          onClose={() => setIsTypePartenaireModalOpen(false)}
          onSelectIdTypePartenaire={handleSelectIdTypePartenaire}
        />

        {/* Section pour afficher les adresses */}
        <div style={{ marginTop: "20px" }}>
          <h4>Adresses</h4>
          {formData.adresses.length > 0 ? (
            <ul>
              {formData.adresses.map((adresse, index) => (
                <li key={index}>
                  {adresse.rue}, {adresse.ville}, {adresse.codePostal}, {adresse.pays}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune adresse ajoutée.</p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
        <Button onClick={() => setOpenAdress(true)}>Ajouter une Adresse</Button>
      </DialogActions>
      <AdressDialog
        open={openAdress}
        onClose={() => setOpenAdress(false)}
        onSave={handleAddAdress}
      />
    </Dialog>
  );
}   