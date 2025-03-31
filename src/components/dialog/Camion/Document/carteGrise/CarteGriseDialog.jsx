import * as React from "react";
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
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CarteGriseDialog({ open, onClose, onSave }) {
  const [carteGriseData, setCarteGriseData] = React.useState({
    dateMiseEnCirculation: null,
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
    dateDelivrance: null,
    adress: null,
  });

  const [validationError, setValidationError] = React.useState("");
  const [isFailedValidation, setIsFailedValidation] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarteGriseData({ ...carteGriseData, [name]: value });
    // Clear validation error when user types
    if ((name === "marque" || name === "numeroSerie") && validationError) {
      setValidationError("");
    }
  };

  const handleDateChange = (name) => (newValue) => {
    setCarteGriseData({ ...carteGriseData, [name]: newValue });
  };

  const validateForm = () => {
    if (!carteGriseData.marque.trim()) {
      setValidationError("La marque est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!carteGriseData.numeroSerie?.trim()) {
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
        ...carteGriseData,
        nombrePlace: Number(carteGriseData.nombrePlace),
        poidsVide: Number(carteGriseData.poidsVide),
        poidsAutorise: Number(carteGriseData.poidsAutorise),
      };
      await onSave(payload);
      // Reset form on successful submission
      setCarteGriseData({
        dateMiseEnCirculation: null,
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
        dateDelivrance: null,
        adress: null,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.message || "Une erreur est survenue lors de l'enregistrement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter Carte Grise</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Marque*"
              name="marque"
              value={carteGriseData.marque}
              onChange={handleInputChange}
              margin="normal"
              error={!!validationError && !carteGriseData.marque.trim()}
              helperText={
                validationError && !carteGriseData.marque.trim()
                  ? validationError
                  : ""
              }
              required
            />

            <TextField
              fullWidth
              label="Genre"
              name="genre"
              value={carteGriseData.genre}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Numéro de Série*"
              name="numeroSerie"
              value={carteGriseData.numeroSerie}
              onChange={handleInputChange}
              margin="normal"
              error={!!validationError && !carteGriseData.numeroSerie?.trim()}
              helperText={
                validationError && !carteGriseData.numeroSerie?.trim()
                  ? validationError
                  : ""
              }
              required
            />

            <TextField
              fullWidth
              label="Couleur"
              name="couleur"
              value={carteGriseData.couleur}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Nombre de Places"
              name="nombrePlace"
              value={carteGriseData.nombrePlace}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />

            <TextField
              fullWidth
              label="Puissance Fiscale"
              name="puissanceFiscale"
              value={carteGriseData.puissanceFiscale}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Énergie"
              name="energie"
              value={carteGriseData.energie}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Propriétaire"
              name="proprietaire"
              value={carteGriseData.proprietaire}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Poids à Vide (kg)"
              name="poidsVide"
              value={carteGriseData.poidsVide}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />

            <TextField
              fullWidth
              label="Poids Autorisé (kg)"
              name="poidsAutorise"
              value={carteGriseData.poidsAutorise}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />

            <MobileDatePicker
              label="Date de Mise en Circulation"
              value={carteGriseData.dateMiseEnCirculation}
              onChange={handleDateChange("dateMiseEnCirculation")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            <MobileDatePicker
              label="Date de Délivrance"
              value={carteGriseData.dateDelivrance}
              onChange={handleDateChange("dateDelivrance")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
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
            La carte grise a été enregistrée avec succès!
          </Alert>
        </Snackbar>
      </Dialog>
    </LocalizationProvider>
  );
}
