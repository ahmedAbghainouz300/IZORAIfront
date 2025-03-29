import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
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

export default function AssuranceDialog({ open, onClose, onSave }) {
  const [assuranceData, setAssuranceData] = React.useState({
    numeroContrat: "",
    company: "",
    typeCouverture: "",
    montant: "",
    dateDebut: null,
    dateExpiration: null,
    primeAnnuelle: "",
    numCarteVerte: "",
    statutCarteVerte: "",
  });

  const [validationError, setValidationError] = React.useState("");
  const [isFailedValidation, setIsFailedValidation] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssuranceData({ ...assuranceData, [name]: value });
    // Clear validation error when user types
    if (name === "numeroContrat" && validationError) {
      setValidationError("");
    }
  };

  const handleDateChange = (name) => (newValue) => {
    setAssuranceData({ ...assuranceData, [name]: newValue });
  };

  const validateForm = () => {
    if (!assuranceData.numeroContrat.trim()) {
      setValidationError("Le numéro de contrat est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!assuranceData.company.trim()) {
      setValidationError("La compagnie est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!assuranceData.dateDebut) {
      setValidationError("La date de début est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!assuranceData.dateExpiration) {
      setValidationError("La date d'expiration est obligatoire");
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...assuranceData,
        montant: Number(assuranceData.montant),
        primeAnnuelle: Number(assuranceData.primeAnnuelle),
      };
      await onSave(payload);
      // Reset form on successful submission
      setAssuranceData({
        numeroContrat: "",
        company: "",
        typeCouverture: "",
        montant: "",
        dateDebut: null,
        dateExpiration: null,
        primeAnnuelle: "",
        numCarteVerte: "",
        statutCarteVerte: "",
      });
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter Assurance</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Numéro de contrat*"
              name="numeroContrat"
              value={assuranceData.numeroContrat}
              onChange={handleInputChange}
              margin="normal"
              error={!!validationError && !assuranceData.numeroContrat.trim()}
              helperText={
                validationError && !assuranceData.numeroContrat.trim()
                  ? validationError
                  : ""
              }
              required
            />

            <TextField
              fullWidth
              label="Compagnie*"
              name="company"
              value={assuranceData.company}
              onChange={handleInputChange}
              margin="normal"
              error={!!validationError && !assuranceData.company.trim()}
              helperText={
                validationError && !assuranceData.company.trim()
                  ? validationError
                  : ""
              }
              required
            />

            <TextField
              fullWidth
              label="Type de couverture"
              name="typeCouverture"
              value={assuranceData.typeCouverture}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Montant"
              name="montant"
              value={assuranceData.montant}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <MobileDatePicker
                label="Date début*"
                value={assuranceData.dateDebut}
                onChange={handleDateChange("dateDebut")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={!!validationError && !assuranceData.dateDebut}
                    helperText={
                      validationError && !assuranceData.dateDebut
                        ? validationError
                        : ""
                    }
                    required
                  />
                )}
              />

              <MobileDatePicker
                label="Date expiration*"
                value={assuranceData.dateExpiration}
                onChange={handleDateChange("dateExpiration")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={!!validationError && !assuranceData.dateExpiration}
                    helperText={
                      validationError && !assuranceData.dateExpiration
                        ? validationError
                        : ""
                    }
                    required
                  />
                )}
              />
            </Box>

            <TextField
              fullWidth
              label="Prime annuelle"
              name="primeAnnuelle"
              value={assuranceData.primeAnnuelle}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />

            <TextField
              fullWidth
              label="Numéro de la carte verte"
              name="numCarteVerte"
              value={assuranceData.numCarteVerte}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Statut de la carte verte"
              name="statutCarteVerte"
              value={assuranceData.statutCarteVerte}
              onChange={handleInputChange}
              margin="normal"
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
          <Alert severity="error">
            Veuillez remplir tous les champs obligatoires
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Dialog>
    </LocalizationProvider>
  );
}
