import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Box,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditAssuranceDialog({
  open,
  onClose,
  assurance,
  onSave,
}) {
  const [formData, setFormData] = useState(assurance || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(assurance || {});
      setValidationError("");
      setShowValidationError(false);
    }
  }, [open, assurance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "numeroContrat" && validationError) {
      setValidationError("");
    }
  };

  const handleDateChange = (name) => (newValue) => {
    setFormData({ ...formData, [name]: newValue });
  };

  const validateForm = () => {
    if (!String(formData.numeroContrat)?.trim()) {
      setValidationError("Le numéro de contrat est obligatoire");
      setShowValidationError(true);
      return false;
    }
    if (!formData.company?.trim()) {
      setValidationError("La compagnie est obligatoire");
      setShowValidationError(true);
      return false;
    }
    if (!formData.dateDebut) {
      setValidationError("La date de début est obligatoire");
      setShowValidationError(true);
      return false;
    }
    if (!formData.dateExpiration) {
      setValidationError("La date d'expiration est obligatoire");
      setShowValidationError(true);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleCloseValidationError = () => {
    setShowValidationError(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        montant: Number(formData.montant),
        primeAnnuelle: Number(formData.primeAnnuelle),
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'Assurance</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                label="Numéro de contrat*"
                name="numeroContrat"
                value={formData.numeroContrat || ""}
                onChange={handleChange}
                margin="normal"
                error={
                  !!validationError && !String(formData.numeroContrat)?.trim()
                }
                helperText={
                  validationError && !String(formData.numeroContrat)?.trim()
                    ? validationError
                    : ""
                }
                required
              />

              <TextField
                fullWidth
                label="Compagnie*"
                name="company"
                value={formData.company || ""}
                onChange={handleChange}
                margin="normal"
                error={!!validationError && !formData.company?.trim()}
                helperText={
                  validationError && !formData.company?.trim()
                    ? validationError
                    : ""
                }
                required
              />

              <TextField
                fullWidth
                label="Type de couverture"
                name="typeCouverture"
                value={formData.typeCouverture || ""}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Montant"
                name="montant"
                value={formData.montant || ""}
                onChange={handleChange}
                margin="normal"
                type="number"
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <MobileDatePicker
                  label="Date début*"
                  value={formData.dateDebut || null}
                  onChange={handleDateChange("dateDebut")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!validationError && !formData.dateDebut}
                      helperText={
                        validationError && !formData.dateDebut
                          ? validationError
                          : ""
                      }
                      required
                    />
                  )}
                />

                <MobileDatePicker
                  label="Date expiration*"
                  value={formData.dateExpiration || null}
                  onChange={handleDateChange("dateExpiration")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!validationError && !formData.dateExpiration}
                      helperText={
                        validationError && !formData.dateExpiration
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
                value={formData.primeAnnuelle || ""}
                onChange={handleChange}
                margin="normal"
                type="number"
              />

              <TextField
                fullWidth
                label="Numéro de la carte verte"
                name="numCarteVerte"
                value={formData.numCarteVerte || ""}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Statut de la carte verte"
                name="statutCarteVerte"
                value={formData.statutCarteVerte || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogActions>

        {/* Validation Error Snackbar */}
        <Snackbar
          open={showValidationError}
          autoHideDuration={6000}
          onClose={handleCloseValidationError}
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
