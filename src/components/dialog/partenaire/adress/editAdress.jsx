import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert as MuiAlert,
  Box,
} from "@mui/material";
import adressService from "../../../../service/partenaire/adressService";

// Alert component for notifications
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Validation function
const validateAddressForm = (formData) => {
  const errors = {};
  
  if (!formData.rue?.trim()) {
    errors.rue = "Street is required";
  }
  
  if (!formData.ville?.trim()) {
    errors.ville = "City is required";
  }
  
  if (!formData.codePostal?.trim()) {
    errors.codePostal = "Postal code is required";
  }
  
  if (!formData.pays?.trim()) {
    errors.pays = "Country is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default function EditAdress({ open, onClose, adresse, onUpdate }) {
  const [formData, setFormData] = useState({
    idAdress: 0,
    rue: "",
    ville: "",
    codePostal: "",
    pays: "",
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize form data when address changes
  useEffect(() => {
    if (adresse) {
      setFormData({
        idAdress: adresse.idAdress || 0,
        rue: adresse.rue || "",
        ville: adresse.ville || "",
        codePostal: adresse.codePostal || "",
        pays: adresse.pays || "",
      });
      // Clear any existing errors when loading new data
      setValidationErrors({});
    }
  }, [adresse]);

  const handleChange = (event) => {
    const { name, value } = event.target;
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

  const handleEditAddress = async (editedAddress) => {
    const { isValid, errors } = validateAddressForm(editedAddress);
    setValidationErrors(errors);
    
    if (!isValid) {
      setError("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      await adressService.update(editedAddress.idAdress, editedAddress);
      setSuccess("Address updated successfully");
       onUpdate(); // Notify parent component of the update
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error updating address:", error);
      setError(error.response?.data?.message || "Failed to update address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccess(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Modifier l'Adresse</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Rue*"
              name="rue"
              fullWidth
              value={formData.rue}
              onChange={handleChange}
              error={!!validationErrors.rue}
              helperText={validationErrors.rue}
              required
            />
            <TextField
              margin="dense"
              label="Ville*"
              name="ville"
              fullWidth
              value={formData.ville}
              onChange={handleChange}
              error={!!validationErrors.ville}
              helperText={validationErrors.ville}
              required
            />
            <TextField
              margin="dense"
              label="Code Postal*"
              name="codePostal"
              fullWidth
              value={formData.codePostal}
              onChange={handleChange}
              error={!!validationErrors.codePostal}
              helperText={validationErrors.codePostal}
              required
            />
            <TextField
              margin="dense"
              label="Pays*"
              name="pays"
              fullWidth
              value={formData.pays}
              onChange={handleChange}
              error={!!validationErrors.pays}
              helperText={validationErrors.pays}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={() => handleEditAddress(formData)} 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

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