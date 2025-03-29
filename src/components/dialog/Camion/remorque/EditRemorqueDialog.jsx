import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import TypeRemorqueSelect from "../../../select/TypeRemorqueSelect";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditRemorqueDialog({
  open,
  onClose,
  remorque,
  onSave,
}) {
  const [formData, setFormData] = useState(remorque);
  const [isTypeRemorqueModalOpen, setIsTypeRemorqueModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    volumeStockage: "",
    poidsChargeMax: "",
    poidsVide: "",
  });
  const [showValidationError, setShowValidationError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(remorque);
      setValidationErrors({
        volumeStockage: "",
        poidsChargeMax: "",
        poidsVide: "",
      });
    }
  }, [open, remorque]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSelectTypeRemorque = (typeRemorque) => {
    setFormData({ ...formData, typeRemorque });
    setIsTypeRemorqueModalOpen(false);
  };

  const validateForm = () => {
    const errors = {
      volumeStockage: !formData.volumeStockage
        ? "Le volume de stockage est obligatoire"
        : "",
      poidsChargeMax: !formData.poidsChargeMax
        ? "Le poids charge max est obligatoire"
        : "",
      poidsVide: !formData.poidsVide ? "Le poids vide est obligatoire" : "",
    };

    setValidationErrors(errors);

    const isValid = !Object.values(errors).some((error) => error !== "");
    if (!isValid) {
      setShowValidationError(true);
    }

    return isValid;
  };

  const handleCloseValidationError = () => {
    setShowValidationError(false);
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
  };

  const handleCloseFailed = () => {
    setIsFailed(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        volumeStockage: Number(formData.volumeStockage),
        poidsChargeMax: Number(formData.poidsChargeMax),
        poidsVide: Number(formData.poidsVide),
      };

      await onSave(payload);
      setIsSuccess(true);
      onClose();
    } catch (error) {
      console.error("Error updating remorque:", error);
      setIsFailed(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Remorque</DialogTitle>
      <DialogContent>
        {/* Type de Remorque Field (optional) */}
        <FormControl fullWidth margin="normal">
          <TextField
            value={formData.typeRemorque?.type || ""}
            InputProps={{ readOnly: true }}
            onClick={() => setIsTypeRemorqueModalOpen(true)}
            fullWidth
            label="Type de Remorque"
          />
          <Button
            variant="outlined"
            onClick={() => setIsTypeRemorqueModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner un Type de Remorque
          </Button>
        </FormControl>

        {/* Volume de Stockage Field (required) */}
        <TextField
          name="volumeStockage"
          label="Volume de Stockage (m³)*"
          value={formData.volumeStockage}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          error={!!validationErrors.volumeStockage}
          helperText={validationErrors.volumeStockage}
          required
        />

        {/* Poids Vide Field (required) */}
        <TextField
          name="poidsVide"
          label="Poids à Vide (kg)*"
          value={formData.poidsVide}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          error={!!validationErrors.poidsVide}
          helperText={validationErrors.poidsVide}
          required
        />

        {/* Poids Charge Max Field (required) */}
        <TextField
          name="poidsChargeMax"
          label="Poids Charge Max (kg)*"
          value={formData.poidsChargeMax}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          error={!!validationErrors.poidsChargeMax}
          helperText={validationErrors.poidsChargeMax}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>

      {/* TypeRemorqueSelect Modal */}
      <TypeRemorqueSelect
        open={isTypeRemorqueModalOpen}
        onClose={() => setIsTypeRemorqueModalOpen(false)}
        onSelect={handleSelectTypeRemorque}
      />

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

      {/* Success Snackbar */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">Remorque mise à jour avec succès!</Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={isFailed}
        autoHideDuration={6000}
        onClose={handleCloseFailed}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Échec de la mise à jour de la remorque</Alert>
      </Snackbar>
    </Dialog>
  );
}
