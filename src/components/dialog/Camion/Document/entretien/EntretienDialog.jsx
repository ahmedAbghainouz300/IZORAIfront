import * as React from "react";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CamionSelect from "../../../../select/CamionSelect";

export default function EntretienDialog({ open, onClose, onCreate }) {
  const [entretienData, setEntretienData] = React.useState({
    dateEntretien: null,
    typeEntretien: "",
    description: "",
    cout: "",
    dateProchainEntretien: null,
    statut: "",
    camion: null,
  });

  const [isCamionModalOpen, setIsCamionModalOpen] = React.useState(false);
  const [validationError, setValidationError] = React.useState("");
  const [showValidationError, setShowValidationError] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntretienData({ ...entretienData, [name]: value });
    // Clear validation error when user types
    if (validationError && ["typeEntretien", "cout"].includes(name)) {
      setValidationError("");
      setShowValidationError(false);
    }
  };

  const handleDateChange = (name) => (newValue) => {
    setEntretienData({ ...entretienData, [name]: newValue });
    if (name === "dateEntretien" && validationError) {
      setValidationError("");
      setShowValidationError(false);
    }
  };

  const handleSelectCamion = (camion) => {
    setEntretienData({ ...entretienData, camion });
    setIsCamionModalOpen(false);
  };

  const validateForm = () => {
    if (!entretienData.dateEntretien) {
      setValidationError("La date d'entretien est obligatoire");
      return false;
    }
    if (!entretienData.typeEntretien.trim()) {
      setValidationError("Le type d'entretien est obligatoire");
      return false;
    }
    if (!entretienData.cout) {
      setValidationError("Le coût est obligatoire");
      return false;
    }
    if (isNaN(entretienData.cout) || parseFloat(entretienData.cout) <= 0) {
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
      ...entretienData,
      cout: parseFloat(entretienData.cout),
    };
    onCreate(payload);
    onClose();
    // Reset form
    setEntretienData({
      dateEntretien: null,
      typeEntretien: "",
      description: "",
      cout: "",
      dateProchainEntretien: null,
      statut: "",
      camion: null,
    });
  };

  const handleCloseValidationError = () => {
    setShowValidationError(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter Entretien</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Date d'Entretien*"
            value={entretienData.dateEntretien}
            onChange={handleDateChange("dateEntretien")}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={showValidationError && !entretienData.dateEntretien}
                helperText={
                  showValidationError && !entretienData.dateEntretien
                    ? "Ce champ est obligatoire"
                    : ""
                }
                required
              />
            )}
          />

          <TextField
            fullWidth
            label="Type d'Entretien*"
            name="typeEntretien"
            value={entretienData.typeEntretien}
            onChange={handleInputChange}
            margin="normal"
            error={showValidationError && !entretienData.typeEntretien.trim()}
            helperText={
              showValidationError && !entretienData.typeEntretien.trim()
                ? "Ce champ est obligatoire"
                : ""
            }
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={entretienData.description}
            onChange={handleInputChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Coût (€)*"
            name="cout"
            value={entretienData.cout}
            onChange={handleInputChange}
            margin="normal"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            error={
              showValidationError &&
              (!entretienData.cout ||
                isNaN(entretienData.cout) ||
                parseFloat(entretienData.cout) <= 0)
            }
            helperText={
              showValidationError &&
              (!entretienData.cout ||
              isNaN(entretienData.cout) ||
              parseFloat(entretienData.cout) <= 0
                ? "Veuillez entrer un montant valide"
                : "")
            }
            required
          />

          <DatePicker
            label="Prochain Entretien"
            value={entretienData.dateProchainEntretien}
            onChange={handleDateChange("dateProchainEntretien")}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          <TextField
            fullWidth
            label="Statut"
            name="statut"
            value={entretienData.statut}
            onChange={handleInputChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <TextField
              value={
                entretienData.camion
                  ? `Camion: ${entretienData.camion.immatriculation}`
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
