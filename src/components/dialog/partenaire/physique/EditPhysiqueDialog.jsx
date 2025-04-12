import React, { useState, useEffect } from "react";
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
import { FormControl, Snackbar, Alert as MuiAlert } from "@mui/material";
import adressService from "../../../../service/partenaire/adressService";

// Alert component for notifications
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Validation utility functions
const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.nom?.trim()) {
    errors.nom = "Name is required";
  }
  
  if (!formData.prenom?.trim()) {
    errors.prenom = "First name is required";
  }
  
  if (!formData.telephone) {
    errors.telephone = "Phone number is required";
  } else if (isNaN(formData.telephone)) {
    errors.telephone = "Phone must be a valid number";
  }
  
  if (!formData.cni) {
    errors.cni = "CNI is required";
  } else if (isNaN(formData.cni)) {
    errors.cni = "CNI must be a valid number";
  }
  
  if (!formData.typePartenaire) {
    errors.typePartenaire = "Partner type is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default function EditPhysiqueDialog({ open, onClose, partenaire, onSave }) {
  const [formData, setFormData] = useState(partenaire || {
    nom: "",
    prenom: "",
    telephone: "",
    cni: "",
    email: "",
    typePartenaire: null,
    adresses: []
  });
  
  const [adresses, setAdresses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Address management states
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isViewAddressOpen, setIsViewAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Type partenaire management
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState(partenaire?.typePartenaire || null);
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] = useState(false);

  // Initialize form data when dialog opens or partenaire changes
  useEffect(() => {
    if (open && partenaire) {
      setFormData({
        nom: partenaire.nom || "",
        prenom: partenaire.prenom || "",
        telephone: partenaire.telephone || "",
        cni: partenaire.cni|| "",
        email: partenaire.email || "",
        typePartenaire: partenaire.typePartenaire || null,
        adresses: partenaire.adresses || []
      });
      setSelectedTypePartenaire(partenaire.typePartenaire || null);
      
      if (partenaire.idPartenaire) {
        fetchAdressesById(partenaire.idPartenaire);
      }
    }
  }, [open, partenaire]);

  const fetchAdressesById = (id) => {
    physiqueService
      .getAdressesByPartenaire(id)
      .then((response) => setAdresses(response.data || []))
      .catch((error) => {
        console.error("Error fetching addresses:", error);
        setError("Failed to load addresses");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Gestion de la sélection du type partenaire
  const handleSelectTypePartenaire = (selectedType) => {
    setSelectedTypePartenaire(selectedType);
    setFormData(prev => ({ ...prev, typePartenaire: selectedType }));
    setIsTypePartenaireModalOpen(false);
    
    // Clear type partenaire error if it exists
    if (validationErrors.typePartenaire) {
      setValidationErrors(prev => ({
        ...prev,
        typePartenaire: null
      }));
    }
  };

  const handleSubmitEdit = async () => {
    const { isValid, errors } = validateForm(formData);
    setValidationErrors(errors);
    
    if (!isValid) {
      setError("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        cni: formData.cni,
        email: formData.email || null,
        typePartenaire: formData.typePartenaire,
      };

      await physiqueService.update(partenaire.idPartenaire, updatedData);
      setSuccess("Partner updated successfully");
      onSave();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Failed to update partner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = async (newAddress) => {
    try {
      const address = await physiqueService.addAdresse(partenaire.idPartenaire, newAddress);
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("Address added successfully");
      setIsAddAddressOpen(false);
    } catch (error) {
      console.error("Error adding address:", error);
      setError("Failed to add address");
      throw error;
    }
  };

  const handleDeleteAdresse = async (id) => {
    try {
      await adressService.delete(id);
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      setError("Failed to delete address");
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

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccess(null);
  };

  const handleChangeAdress = ()=>{
    fetchAdressesById(partenaire.idPartenaire);
    console.log("address was updatet succesfelly")
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le Partenaire Physique</DialogTitle>
        <DialogContent>
          <TextField
            name="nom"
            label="Nom*"
            value={formData.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.nom}
            helperText={validationErrors.nom}
            required
          />
          
          <TextField
            name="prenom"
            label="Prénom*"
            value={formData.prenom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.prenom}
            helperText={validationErrors.prenom}
            required
          />
          
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          
          <TextField
            name="telephone"
            label="Téléphone*"
            value={formData.telephone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.telephone}
            helperText={validationErrors.telephone}
            required
            inputProps={{ inputMode: "tel", pattern: "[0-9]*" }}
          />
          
          <TextField
            name="cni"
            label="CNI*"
            value={formData.cni}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!validationErrors.cni}
            helperText={validationErrors.cni}
            required
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          
          <FormControl fullWidth margin="normal">
            <TextField
              label="Type Partenaire*"
              value={selectedTypePartenaire?.libelle || ""}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              error={!!validationErrors.typePartenaire}
              helperText={validationErrors.typePartenaire}
              required
            />
            <Button
              variant="outlined"
              onClick={() => setIsTypePartenaireModalOpen(true)}
              style={{ marginTop: "8px" }}
            >
              Modifier le Type Partenaire
            </Button>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => setIsAdressModalOpen(true)}
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            Afficher Adresse ({adresses.length})
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmitEdit}
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address Table Dialog */}
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

      {/* Partner Type Selection Dialog */}
      <TypePartenaireTable
        open={isTypePartenaireModalOpen}
        onClose={() => setIsTypePartenaireModalOpen(false)}
        onSelectTypePartenaire={handleSelectTypePartenaire}
      />

      {/* Add Address Dialog */}
      <AddAdress
        open={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onAdd={handleAddAddress}
      />

      {/* Edit Address Dialog */}
      <EditAdress
        open={isEditAddressOpen}
        onClose={() => setIsEditAddressOpen(false)}
        adresse={selectedAddress}
        onUpdate={handleChangeAdress}
      />

      {/* View Address Dialog */}
      <ViewAdress
        open={isViewAddressOpen}
        onClose={() => setIsViewAddressOpen(false)}
        adresse={selectedAddress}
      />

      {/* Notification Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseError}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSuccess}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}