import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import AdressDialog from "../AdressDialog";
import physiqueService from "../../../../service/partenaire/physiqueService";
import typePartenaireService from "../../../../service/partenaire/typePartenaireService";
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";

export default function PhysiqueDialog({ open, onClose,onAdd }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Centralized form state
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    cni: "",
    typePartenaireId: null,
    adresses: [],
  });


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new address
  const handleAddAdress = (newAdresse) => {
    setFormData((prev) => ({
      ...prev,
      adresses: [...prev.adresses, newAdresse],
    }));
    setOpenAdress(false);
  };

  // Validate form
  const validateForm = () => {
    const { nom, prenom, email, telephone, cni, typePartenaireId } = formData;

    if (!nom || !prenom || !email || !telephone || !cni || !typePartenaireId) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    if (isNaN(telephone) || isNaN(cni)) {
      setErrorMessage("Téléphone et CNI doivent être des nombres.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newPhysique = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: Number(formData.telephone),
      cni: Number(formData.cni),
      typePartenaireId: formData.typePartenaireId,
      adresses: formData.adresses,
    };

    try {
      await physiqueService.create(newPhysique);
      resetForm();
      onAdd();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création du partenaire physique:", error);
      setErrorMessage("Une erreur est survenue lors de l'ajout du partenaire physique.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      cni: "",
      typePartenaireId: null,
      adresses: [],
    });
    setErrorMessage("");
  };

  
  // Handle selection of a type partenaire
  const handleSelectIdTypePartenaire = (selectedId) => {
    setFormData((prev) => ({
      ...prev,
      typePartenaireId: selectedId,
    }));
    setIsTypePartenaireModalOpen(false); // Close the modal after selection
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter un Partenaire Physique</DialogTitle>
        <DialogContent>
          {/* Nom */}
          <TextField label="Nom" fullWidth margin="normal" name="nom" value={formData.nom} onChange={handleInputChange}/>
          {/* Prénom */}
          <TextField label="Prénom" fullWidth margin="normal" name="prenom" value={formData.prenom} onChange={handleInputChange}/>
          {/* Email */}
          <TextField label="Email" fullWidth margin="normal" name="email" value={formData.email} onChange={handleInputChange}/>
          {/* Téléphone */}
          <TextField label="Téléphone" fullWidth margin="normal" name="telephone" value={formData.telephone} onChange={handleInputChange}/>

          {/* CNI */}
          <TextField label="CNI" fullWidth margin="normal" name="cni" value={formData.cni} onChange={handleInputChange}/>

          {/* Type Partenaire */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Type Partenaire</InputLabel>
           
            <Button
              variant="outlined"
              onClick={() => setIsTypePartenaireModalOpen(true)}
              style={{ marginTop: "8px" }}
            >
              Sélectionner un Type Partenaire
            </Button>
          </FormControl>

          {/* Adresses */}
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
      </Dialog>

      {/* AdressDialog */}
      <AdressDialog
        open={openAdress}
        onClose={() => setOpenAdress(false)}
        onSave={handleAddAdress}
      />

      {/* TypePartenaireTable Modal */}
      <TypePartenaireTable
        open={isTypePartenaireModalOpen}
        onClose={() => setIsTypePartenaireModalOpen(false)}
        onSelectIdTypePartenaire={handleSelectIdTypePartenaire}
      />

      {/* Snackbar for Error Messages */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </>
  );
}