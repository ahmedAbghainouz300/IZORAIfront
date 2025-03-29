import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import AssuranceSelect from "../../../select/AssuranceSelect";
import CarteGriseSelect from "../../../select/CarteGriseSelect";
import TypeCabineSelect from "../../../select/TypeCabineSelect";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditCabineDialog({ open, onClose, cabine, onSave }) {
  const [formData, setFormData] = useState(cabine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] = useState(false);
  const [isTypeCamionModalOpen, setIsTypeCamionModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(cabine);
      setValidationError(""); // Clear validation errors when opening
      setShowValidationError(false); // Reset validation error display
    }
  }, [open, cabine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user types in immatriculation
    if (name === "immatriculation" && validationError) {
      setValidationError("");
    }
  };

  const validateForm = () => {
    if (!formData.immatriculation?.trim()) {
      setValidationError("L'immatriculation est obligatoire");
      setShowValidationError(true);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSelectAssurance = (assurance) => {
    setFormData({ ...formData, assurance });
    setIsAssuranceModalOpen(false);
  };

  const handleSelectCarteGrise = (carteGrise) => {
    setFormData({ ...formData, carteGrise });
    setIsCarteGriseModalOpen(false);
  };

  const handleSelectTypeCamion = (typeCamion) => {
    setFormData({ ...formData, typeCamion });
    setIsTypeCamionModalOpen(false);
  };

  const handleCloseValidationError = () => {
    setShowValidationError(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        immatriculation: formData.immatriculation,
        typeCamion: formData.typeCamion,
        poidsMax: Number(formData.poidsMax),
        consommation: Number(formData.consommation),
        assurance: formData.assurance,
        carteGrise: formData.carteGrise,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Cabine</DialogTitle>
      <DialogContent>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Required Immatriculation Field */}
            <TextField
              name="immatriculation"
              label="Immatriculation*"
              value={formData.immatriculation || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!validationError}
              helperText={validationError}
              required
            />

            {/* Rest of the form fields remain unchanged */}
            <FormControl fullWidth margin="normal">
              <TextField
                value={formData.typeCamion?.type || ""}
                InputProps={{ readOnly: true }}
                onClick={() => setIsTypeCamionModalOpen(true)}
                fullWidth
                label="Type de Camion"
              />
              <Button
                variant="outlined"
                onClick={() => setIsTypeCamionModalOpen(true)}
                style={{ marginTop: "8px" }}
              >
                Sélectionner un Type de Camion
              </Button>
            </FormControl>

            <TextField
              name="poidsMax"
              label="Poids Max (kg)"
              value={formData.poidsMax || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />

            <TextField
              name="consommation"
              label="Consommation (L/100km)"
              value={formData.consommation || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />

            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.assurance
                    ? `${formData.assurance.company} | ${formData.assurance.numeroContrat}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                onClick={() => setIsAssuranceModalOpen(true)}
                fullWidth
                label="Assurance"
              />
              <Button
                variant="outlined"
                onClick={() => setIsAssuranceModalOpen(true)}
                style={{ marginTop: "8px" }}
              >
                Sélectionner une Assurance
              </Button>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.carteGrise
                    ? `${formData.carteGrise.marque} | ${formData.carteGrise.numeroSerie}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                onClick={() => setIsCarteGriseModalOpen(true)}
                fullWidth
                label="Carte Grise"
              />
              <Button
                variant="outlined"
                onClick={() => setIsCarteGriseModalOpen(true)}
                style={{ marginTop: "8px" }}
              >
                Sélectionner une Carte Grise
              </Button>
            </FormControl>

            <AssuranceSelect
              open={isAssuranceModalOpen}
              onClose={() => setIsAssuranceModalOpen(false)}
              onSelectAssurance={handleSelectAssurance}
            />

            <CarteGriseSelect
              open={isCarteGriseModalOpen}
              onClose={() => setIsCarteGriseModalOpen(false)}
              onSelectCarteGrise={handleSelectCarteGrise}
            />

            <TypeCabineSelect
              open={isTypeCamionModalOpen}
              onClose={() => setIsTypeCamionModalOpen(false)}
              onSelect={handleSelectTypeCamion}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          Enregistrer
        </Button>
      </DialogActions>

      {/* Error Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

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
    </Dialog>
  );
}
