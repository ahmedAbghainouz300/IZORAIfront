import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Alert,
  Snackbar,
} from "@mui/material";
import CamionSelect from "../../../../select/CamionSelect";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function EditEntretienDialog({
  open,
  onClose,
  entretien,
  onSave,
}) {
  const [formData, setFormData] = useState(entretien);
  const [isCamionModalOpen, setIsCamionModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(entretien);
      setValidationError("");
      setShowValidationError(false);
    }
  }, [open, entretien]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (["typeEntretien", "cout"].includes(name) && validationError) {
      setValidationError("");
      setShowValidationError(false);
    }
  };

  const handleSelectCamion = (camion) => {
    setFormData({ ...formData, camion });
    setIsCamionModalOpen(false);
  };

  const validateForm = () => {
    if (!formData.dateEntretien) {
      setValidationError("La date d'entretien est obligatoire");
      return false;
    }
    if (!formData.typeEntretien?.trim()) {
      setValidationError("Le type d'entretien est obligatoire");
      return false;
    }
    if (
      !formData.cout ||
      isNaN(formData.cout) ||
      parseFloat(formData.cout) <= 0
    ) {
      setValidationError("Veuillez entrer un coût valide");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setShowValidationError(true);
      return;
    }

    const payload = {
      ...formData,
      cout: parseFloat(formData.cout),
    };
    onSave(payload);
    onClose();
  };

  const handleCloseValidationError = () => {
    setShowValidationError(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'Entretien</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Date d'Entretien*"
            value={
              formData && formData.dateEntretien ? formData.dateEntretien : "-"
            }
            onChange={(newValue) => {
              setFormData({ ...formData, dateEntretien: newValue });
              if (validationError) setValidationError("");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={showValidationError && !formData.dateEntretien}
                helperText={
                  showValidationError && !formData.dateEntretien
                    ? "Ce champ est obligatoire"
                    : ""
                }
                required
              />
            )}
          />

          <TextField
            name="typeEntretien"
            label="Type d'Entretien*"
            value={
              formData && formData.typeEntretien ? formData.typeEntretien : "-"
            }
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={showValidationError && !formData.typeEntretien?.trim()}
            helperText={
              showValidationError && !formData.typeEntretien?.trim()
                ? "Ce champ est obligatoire"
                : ""
            }
            required
          />

          <TextField
            name="description"
            label="Description"
            value={
              formData && formData.description ? formData.description : "-"
            }
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="cout"
            label="Coût (€)*"
            value={formData && formData.cout ? formData.cout : "-"}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            error={
              showValidationError &&
              (!formData.cout ||
                isNaN(formData.cout) ||
                parseFloat(formData.cout) <= 0)
            }
            helperText={
              showValidationError &&
              (!formData.cout ||
              isNaN(formData.cout) ||
              parseFloat(formData.cout) <= 0
                ? "Veuillez entrer un montant valide"
                : "")
            }
            required
          />

          <DatePicker
            label="Prochain Entretien"
            value={
              formData && formData.dateProchainEntretien
                ? formData.dateProchainEntretien
                : "-"
            }
            onChange={(newValue) =>
              setFormData({ ...formData, dateProchainEntretien: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          <FormControl fullWidth margin="normal">
            <TextField
              value={
                formData && formData.camion
                  ? `Camion: ${formData.camion.immatriculation}`
                  : ""
              }
              InputProps={{ readOnly: true }}
              onClick={() => setIsCamionModalOpen(true)}
              fullWidth
              label="Camion"
            />
            <Button
              variant="outlined"
              onClick={() => setIsCamionModalOpen(true)}
              sx={{ mt: 1 }}
            >
              Sélectionner un Camion
            </Button>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <CamionSelect
        open={isCamionModalOpen}
        onClose={() => setIsCamionModalOpen(false)}
        onSelect={handleSelectCamion}
      />

      <Snackbar
        open={showValidationError}
        autoHideDuration={6000}
        onClose={handleCloseValidationError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseValidationError}>
          {validationError}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}
