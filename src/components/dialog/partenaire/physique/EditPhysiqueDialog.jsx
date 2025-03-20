import React, { useState,useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import physiqueService from './../../../../service/partenaire/physiqueService';
import AdressTable from "../adress/AdressTable";
import AddAdress from "../adress/addAdress";
import EditAdress from "../adress/editAdress";
import ViewAdress from "../adress/voirAdress";  
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";
import { FormControl } from "@mui/material";


export default function EditPhysiqueDialog({ open, onClose, partenaire, onSave }) {
  const [formData, setFormData] = useState(partenaire);
  const [adresses, setAdresses] = useState([]);
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isViewAddressOpen, setIsViewAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState(partenaire?.typePartenaire || null);
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] = useState(false);

// Gestion de la sélection du type partenaire
const handleSelectTypePartenaire = (selectedType) => {
  setSelectedTypePartenaire(selectedType); // Mise à jour de l'état local
  setFormData({ ...formData, typePartenaire: selectedType }); // Mise à jour du formData
  setIsTypePartenaireModalOpen(false);
};


    const fetchAdressesById = (id) => {
        physiqueService
          .getAdressesByPartenaire(id)
          .then((response) => setAdresses(response.data))
          .catch((error) => console.error("Erreur lors de la récupération des adresses:", error));
    };

    useEffect(() => {
      if (partenaire) {
        fetchAdressesById(partenaire.idPartenaire);
      }
    }, [partenaire]);
    

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitEdit =async () => {
    await physiqueService.update(partenaire.idPartenaire, formData);
    onSave();
    onClose();
    alert("Partenaire mis à jour avec succès !");

  };

  const handleAddAddress = async (newAddress) => {
      try {
        const address = await physiqueService.addAdresse(partenaire.idPartenaire, newAddress);
        console.log("Adresse ajoutée avec succès:", address);
        await fetchAdressesById(partenaire.idPartenaire); // Refresh addresses
        alert("Adresse ajoutée avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'adresse :", error);
        alert("Erreur lors de l'ajout de l'adresse.");
      }
    };

    const handleDeleteAdresse = async (id) => {
      try {
        await moraleService.deleteAdresse(id);
        fetchAdressesById(partenaire.idPartenaire);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'adresse :", error);
      }
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier le Partenaire Physique</DialogTitle>
      <DialogContent>
        <TextField  name="nom"  label="Nom"  value={formData.nom}  onChange={handleChange}  fullWidth  margin="normal"/>
        <TextField  name="prenom"  label="Prénom"  value={formData.prenom}  onChange={handleChange}  fullWidth  margin="normal"/>
        <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth margin="normal"/>
        <TextField name="telephone" label="Téléphone" value={formData.telephone} onChange={handleChange} fullWidth margin="normal"/>
        <TextField name="cni" label="CNI" value={formData.cni} onChange={handleChange} fullWidth margin="normal"/>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Type Partenaire"
            value={selectedTypePartenaire?.libelle || partenaire?.typePartenaire?.libelle || ""}
            fullWidth margin="normal" InputProps={{   readOnly: true,  }}
          />
          <Button variant="outlined"  onClick={() => setIsTypePartenaireModalOpen(true)}  style={{ marginTop: "8px" }}>
            Modifier le Type Partenaire
          </Button>
        </FormControl>


        <Button variant="outlined" onClick={() => setIsAdressModalOpen(true)} style={{ marginTop: "16px", marginBottom: "16px" }}>
          Afficher Adresse
        </Button> 
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmitEdit} color="primary">
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

      <TypePartenaireTable
        open={isTypePartenaireModalOpen}
        onClose={() => setIsTypePartenaireModalOpen(false)}
        onSelectTypePartenaire={(selectedType) => {
          console.log("Type sélectionné :", selectedType)
          handleSelectTypePartenaire(selectedType)}
      }
        />
      <AddAdress open={isAddAddressOpen} onClose={() => setIsAddAddressOpen(false)} onAdd={handleAddAddress} />
      <EditAdress open={isEditAddressOpen} onClose={() => setIsEditAddressOpen(false)} adresse={selectedAddress} />
      <ViewAdress open={isViewAddressOpen} onClose={() => setIsViewAddressOpen(false)} adresse={selectedAddress} />
    </Dialog>
  );
}