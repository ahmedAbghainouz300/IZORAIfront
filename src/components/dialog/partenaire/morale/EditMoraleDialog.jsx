import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AdressTable from "../adress/AdressTable";
import AddAdress from "../adress/addAdress";
import EditAdress from "../adress/editAdress";
import ViewAdress from "../adress/voirAdress";
import moraleService from "../../../../service/partenaire/moraleService";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";


export default function EditMoraleDialog({ open, onClose, partenaire, onSave }) {
  const [adresses, setAdresses] = useState([]);
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isViewAddressOpen, setIsViewAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] = useState(false);
  

  const [formData, setFormData] = useState(partenaire);
  const handleSelectIdTypePartenaire = (selectedId) => {
    setFormData((prev) => ({
      ...prev,
      typePartenaireId: selectedId,
    }));
    setIsTypePartenaireModalOpen(false); // Close the modal after selection
  };

  useEffect(() => {
    if (partenaire) {
      fetchAdressesById(partenaire.idPartenaire);
    }
  }, [partenaire]);

  const fetchAdressesById = (id) => {
    moraleService
      .getAdressesByPartenaire(id)
      .then((response) => setAdresses(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des adresses:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitEdit = async () => {
    try {
      await moraleService.update(partenaire.idPartenaire, formData);
      onSave(); // Optionnel: Appeler une fonction de rappel pour informer le composant parent de la mise à jour réussie
      onClose();
      alert("Partenaire mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du partenaire :", error);
      alert("Erreur lors de la mise à jour du partenaire.");
    }
  };

  const handleAddAddress = async (newAddress) => {
    try {
      const address = await moraleService.addAdresse(partenaire.idPartenaire, newAddress);
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le Partenaire</DialogTitle>
      <DialogContent>
        <TextField name="nom" label="Nom" value={formData.nom} onChange={handleChange} fullWidth margin="normal" autoFocus/>
        <TextField name="ice" label="ICE" value={formData.ice} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="numeroRC" label="Numéro RC" value={formData.numeroRC} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="abreviation" label="Abréviation" value={formData.abreviation} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="formeJuridique" label="Forme Juridique" value={formData.formeJuridique} onChange={handleChange} fullWidth margin="normal" />
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

      {/* Nested Dialogs */}
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
      {/* TypePartenaireTable Modal */}
            <TypePartenaireTable
              open={isTypePartenaireModalOpen}
              onClose={() => setIsTypePartenaireModalOpen(false)}
              onSelectIdTypePartenaire={handleSelectIdTypePartenaire}
            />

      <AddAdress open={isAddAddressOpen} onClose={() => setIsAddAddressOpen(false)} onAdd={handleAddAddress} />
      <EditAdress open={isEditAddressOpen} onClose={() => setIsEditAddressOpen(false)} adresse={selectedAddress} />
      <ViewAdress open={isViewAddressOpen} onClose={() => setIsViewAddressOpen(false)} adresse={selectedAddress} />
    </Dialog>
  );
}