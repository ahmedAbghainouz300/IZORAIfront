import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import chauffeurService from "../../../../service/partenaire/chaufeurService";
import adressService from "../../../../service/partenaire/adressService";
import physiqueService from "../../../../service/partenaire/physiqueService";
import AddAdress from "../adress/addAdress";
import EditAdress from "../adress/editAdress";
import ViewAdress from "../adress/voirAdress";
import AdressTable from "../adress/AdressTable"; // Importer le nouveau composant

export default function ModifierChauffeurDialog({ open, onClose, chauffeur, onUpdate }) {

  const [adresses, setAdresses] = useState([]);
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isViewAddressOpen, setIsViewAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);



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

  const fetchAdressesById = (id) => {
    physiqueService.getAdressesByPartenaire(id)
      .then((response) => setAdresses(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des adresses:", error));
  };


  useEffect(() => {
    if (chauffeur) {
      const defaultAddress = adresses.length > 0 ? adresses[0] : null;
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
        adresse: defaultAddress
          ? `${defaultAddress.rue}, ${defaultAddress.ville}, ${defaultAddress.codePostal}, ${defaultAddress.pays}`
          : "",
      });
      fetchAdressesById(chauffeur.idPartenaire);
    }
  }, [chauffeur]);


  const handleAddAddress = async (newAddress) => {
    try {
      await physiqueService.addAdresse(chauffeur.idPartenaire, newAddress);
      fetchAdressesById(chauffeur.idPartenaire); // Rafraîchir la liste des adresses
      setFormData((prevFormData) => ({
        ...prevFormData,
        adresse: `${newAddress.rue}, ${newAddress.ville}, ${newAddress.codePostal}, ${newAddress.pays}`,
      }));
      console.log
      alert("Adresse ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse :", error);
      alert("Erreur lors de l'ajout de l'adresse.");
    }
  };

  

  const handleDeleteAdresse = async (id) => {
    try {
      await adressService.delete(id);
      fetchAdressesById(chauffeur.idPartenaire); // Rafraîchir la liste des adresses
    } catch (error) {
      console.error("Erreur lors de la suppression de l'adresse :", error);
    }
  };

  

  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    chauffeurService.update(chauffeur.idPartenaire, formData)
      .then(() => {
        onUpdate();
        onClose();
      })
      .catch((error) => console.error("Erreur lors de la mise à jour :", error));
  };
  
  const openEditDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsEditAddressOpen(true);
  };

  const openViewDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsViewAddressOpen(true);
  };


 

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le Chauffeur</DialogTitle>
      <DialogContent>
        {/* Formulaire de modification du chauffeur */}
        <TextField margin="dense" label="Nom" name="nom" fullWidth value={formData.nom} onChange={handleChange} />
        <TextField margin="dense" label="Prénom" name="prenom" fullWidth value={formData.prenom} onChange={handleChange} />
        <TextField margin="dense" label="CNI" name="cni" fullWidth value={formData.cni} onChange={handleChange} />
        <TextField margin="dense" label="Email" name="email" type="email" fullWidth value={formData.email} onChange={handleChange} />
        <TextField margin="dense" label="Téléphone" name="telephone" fullWidth value={formData.telephone} onChange={handleChange} />
        <TextField margin="dense" label="CNSS" name="cnss" fullWidth value={formData.cnss} onChange={handleChange} />
        <TextField margin="dense" label="Date de Recrutement" name="dateRecrutement" type="date" fullWidth value={formData.dateRecrutement} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField margin="dense" label="dateExpirationPermis" name="dateExpirationPermis" type="date" fullWidth value={formData.dateExpirationPermis} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField margin="dense" label="Disponibilité" name="disponibilite" fullWidth value={formData.disponibilite} onChange={handleChange} />
        <Button variant="outlined" onClick={() => setIsAdressModalOpen(true)} style={{ marginTop: "16px", marginBottom: "16px" }}>
          Afficher Adresse
        </Button>
      </DialogContent>  
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Enregistrer</Button>
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


      {/* Modals pour ajouter, modifier et voir les adresses */}
      <AddAdress open={isAddAddressOpen} onClose={() => setIsAddAddressOpen(false)} onAdd={handleAddAddress} />
      <EditAdress open={isEditAddressOpen} onClose={() => setIsEditAddressOpen(false)} adresse={selectedAddress} />
      <ViewAdress open={isViewAddressOpen} onClose={() => setIsViewAddressOpen(false)} adresse={selectedAddress} />
    </Dialog>
  );
}