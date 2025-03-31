import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import chauffeurService from "../../../../service/partenaire/chaufeurService";
import adressService from "../../../../service/partenaire/adressService";
import physiqueService from "../../../../service/partenaire/physiqueService";
import AdressTable from "../adress/AdressTable";

export default function ModifierChauffeurDialog({
  open,
  onClose,
  chauffeur,
  onUpdate,
}) {
  const [adresses, setAdresses] = useState([]);
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [errors, setErrors] = useState({
    nom: false,
    prenom: false,
    cni: false,
    telephone: false,
    dateExpirationPermis: false,
  });

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cni: "",
    email: "",
    telephone: "",
    cnss: "",
    dateRecrutement: "",
    dateExpirationPermis: "",
    disponibilite: "",
  });

  const validateForm = () => {
    const newErrors = {
      nom: formData.nom.trim() === "",
      prenom: formData.prenom.trim() === "",
      cni: formData.cni.trim() === "",
      telephone: formData.telephone.trim() === "",
      dateExpirationPermis: formData.dateExpirationPermis.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const fetchAdressesById = (id) => {
    physiqueService
      .getAdressesByPartenaire(id)
      .then((response) => setAdresses(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des adresses:", error)
      );
  };

  useEffect(() => {
    if (chauffeur) {
      setFormData({
        nom: chauffeur.nom || "",
        prenom: chauffeur.prenom || "",
        cni: chauffeur.cni || "",
        email: chauffeur.email || "",
        telephone: chauffeur.telephone || "",
        cnss: chauffeur.cnss || "",
        dateExpirationPermis: chauffeur.dateExpirationPermis || "",
        dateRecrutement: chauffeur.dateRecrutement || "",
        disponibilite: chauffeur.disponibilite || "",
      });
      fetchAdressesById(chauffeur.idPartenaire);
    }
  }, [chauffeur]);

  const handleAddAddress = async (newAddress) => {
    try {
      await physiqueService.addAdresse(chauffeur.idPartenaire, newAddress);
      fetchAdressesById(chauffeur.idPartenaire);
      alert("Adresse ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse :", error);
      alert("Erreur lors de l'ajout de l'adresse.");
    }
  };

  const handleDeleteAdresse = async (id) => {
    try {
      await adressService.delete(id);
      fetchAdressesById(chauffeur.idPartenaire);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'adresse :", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    chauffeurService
      .update(chauffeur.idPartenaire, formData)
      .then(() => {
        onUpdate();
        onClose();
      })
      .catch((error) =>
        console.error("Erreur lors de la mise à jour :", error)
      );
  };

  const openEditDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsAddAddressOpen(true);
  };

  const openViewDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsAdressModalOpen(true);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le Chauffeur</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nom *"
          name="nom"
          fullWidth
          value={formData.nom}
          onChange={handleChange}
          error={errors.nom}
          helperText={errors.nom ? "Ce champ est obligatoire" : ""}
          required
        />
        <TextField
          margin="dense"
          label="Prénom *"
          name="prenom"
          fullWidth
          value={formData.prenom}
          onChange={handleChange}
          error={errors.prenom}
          helperText={errors.prenom ? "Ce champ est obligatoire" : ""}
          required
        />
        <TextField
          margin="dense"
          label="CNI *"
          name="cni"
          fullWidth
          value={formData.cni}
          onChange={handleChange}
          error={errors.cni}
          helperText={errors.cni ? "Ce champ est obligatoire" : ""}
          required
        />
        <TextField
          margin="dense"
          label="Téléphone *"
          name="telephone"
          fullWidth
          value={formData.telephone}
          onChange={handleChange}
          error={errors.telephone}
          helperText={errors.telephone ? "Ce champ est obligatoire" : ""}
          required
        />
        <TextField
          margin="dense"
          label="Date d'expiration du permis *"
          name="dateExpirationPermis"
          type="date"
          fullWidth
          value={formData.dateExpirationPermis}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={errors.dateExpirationPermis}
          helperText={
            errors.dateExpirationPermis ? "Ce champ est obligatoire" : ""
          }
          required
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

        <Button
          variant="outlined"
          onClick={() => setIsAdressModalOpen(true)}
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          Afficher Adresse
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>

      <AdressTable
        adresses={adresses}
        onView={openViewDialog}
        onEdit={openEditDialog}
        onDelete={handleDeleteAdresse}
        open={isAdressModalOpen}
        onClose={() => setIsAdressModalOpen(false)}
        onAddAddress={() => setIsAddAddressOpen(true)}
        title="Liste des Adresses"
      />
    </Dialog>
  );
}
