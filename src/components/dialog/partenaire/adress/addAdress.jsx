import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";

// Alert component for notifications
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddAdress({ open, onClose, onAdd }) {
  const [newAdress, setNewAdress] = useState({
    rue: "",
    ville: "",
    codePostal: "",
    pays: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewAdress(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newAdress.rue.trim()) newErrors.rue = "La rue est obligatoire";
    if (!newAdress.ville.trim()) newErrors.ville = "La ville est obligatoire";
    
    // Validate postal code format (French example: 5 digits)
    if (!newAdress.codePostal.trim()) {
      newErrors.codePostal = "Le code postal est obligatoire";
    } else if (!/^\d{5}$/.test(newAdress.codePostal.trim())) {
      newErrors.codePostal = "Code postal invalide (5 chiffres requis)";
    }
    
    if (!newAdress.pays.trim()) newErrors.pays = "Le pays est obligatoire";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAdd(newAdress);
      setSuccess("Adresse ajoutée avec succès");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse :", error);
      setError(error.response?.data?.message || "Erreur lors de l'ajout de l'adresse");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewAdress({
      rue: "",
      ville: "",
      codePostal: "",
      pays: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter une Adresse</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Rue*"
              name="rue"
              fullWidth
              value={newAdress.rue}
              onChange={handleChange}
              error={!!errors.rue}
              helperText={errors.rue}
              required
            />
            <TextField
              margin="dense"
              label="Ville*"
              name="ville"
              fullWidth
              value={newAdress.ville}
              onChange={handleChange}
              error={!!errors.ville}
              helperText={errors.ville}
              required
            />
            <TextField
              margin="dense"
              label="Code Postal*"
              name="codePostal"
              fullWidth
              value={newAdress.codePostal}
              onChange={handleChange}
              error={!!errors.codePostal}
              helperText={errors.codePostal}
              required
            />
            <TextField
              margin="dense"
              label="Pays*"
              name="pays"
              fullWidth
              value={newAdress.pays}
              onChange={handleChange}
              error={!!errors.pays}
              helperText={errors.pays}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Ajout en cours...
              </>
            ) : "Ajouter"}
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