import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditCarteGriseDialog({
  open,
  onClose,
  carteGrise,
  onSave,
}) {
  const [formData, setFormData] = useState({
    marque: "",
    genre: "",
    numeroSerie: "",
    couleur: "",
    nombrePlace: "",
    puissanceFiscale: "",
    energie: "",
    proprietaire: "",
    poidsVide: "",
    poidsAutorise: "",
    dateMiseEnCirculation: "",
    dateDelivrance: "",
    ...carteGrise,
  });

  const [validationError, setValidationError] = useState("");
  const [isFailedValidation, setIsFailedValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize formData when the dialog opens or carteGrise changes
  useEffect(() => {
    if (open) {
      setFormData({
        marque: "",
        genre: "",
        numeroSerie: "",
        couleur: "",
        nombrePlace: "",
        puissanceFiscale: "",
        energie: "",
        proprietaire: "",
        poidsVide: "",
        poidsAutorise: "",
        dateMiseEnCirculation: "",
        dateDelivrance: "",
        ...carteGrise,
      });
      setValidationError("");
      setIsFailedValidation(false);
      setError(null);
    }
  }, [open, carteGrise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user types in required fields
    if ((name === "marque" || name === "numeroSerie") && validationError) {
      setValidationError("");
    }
  };

  const validateForm = () => {
    if (!formData.marque?.trim()) {
      setValidationError("La marque est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!String(formData.numeroSerie)?.trim()) {
      setValidationError("Le numéro de série est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleCloseFailedValidation = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedValidation(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        nombrePlace: formData.nombrePlace ? Number(formData.nombrePlace) : null,
        poidsVide: formData.poidsVide ? Number(formData.poidsVide) : null,
        poidsAutorise: formData.poidsAutorise
          ? Number(formData.poidsAutorise)
          : null,
      };
      await onSave(payload);
      setSuccess(true);
      onClose();
    } catch (err) {
      setError(
        err.message || "Une erreur est survenue lors de la modification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Carte Grise</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <TextField
            name="marque"
            label="Marque*"
            value={formData.marque || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!validationError && !formData.marque?.trim()}
            helperText={
              validationError && !formData.marque?.trim() ? validationError : ""
            }
            required
          />
          <TextField
            name="genre"
            label="Genre"
            value={formData.genre || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="numeroSerie"
            label="Numéro de Série*"
            value={formData.numeroSerie || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!validationError && !String(formData.numeroSerie)?.trim()}
            helperText={
              validationError && !String(formData.numeroSerie)?.trim()
                ? validationError
                : ""
            }
            required
          />
          <TextField
            name="couleur"
            label="Couleur"
            value={formData.couleur || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="nombrePlace"
            label="Nombre de Places"
            value={formData.nombrePlace || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="puissanceFiscale"
            label="Puissance Fiscale"
            value={formData.puissanceFiscale || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="energie"
            label="Énergie"
            value={formData.energie || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="proprietaire"
            label="Propriétaire"
            value={formData.proprietaire || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="poidsVide"
            label="Poids à Vide (kg)"
            value={formData.poidsVide || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="poidsAutorise"
            label="Poids Autorisé (kg)"
            value={formData.poidsAutorise || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            name="dateMiseEnCirculation"
            label="Date de Mise en Circulation"
            value={formData.dateMiseEnCirculation || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="dateDelivrance"
            label="Date de Délivrance"
            value={formData.dateDelivrance || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </DialogActions>

      {/* Validation Error Snackbar */}
      <Snackbar
        open={isFailedValidation}
        autoHideDuration={6000}
        onClose={handleCloseFailedValidation}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseFailedValidation}>
          {validationError || "Veuillez remplir tous les champs obligatoires"}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
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

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSuccess}>
          La carte grise a été modifiée avec succès!
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
