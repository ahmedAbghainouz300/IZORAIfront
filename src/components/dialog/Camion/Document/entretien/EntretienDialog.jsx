import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert as MuiAlert,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CamionSelect from "../../../../select/CamionSelect";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const typeEntretienOptions = [
  { value: "VIDANGE", label: "Vidange" },
  { value: "FREINS", label: "Freins" },
  { value: "PNEUMATIQUES", label: "Pneumatiques" },
  { value: "SUSPENSION", label: "Suspension" },
  { value: "FILTRES", label: "Filtres" },
  { value: "BATTERIE", label: "Batterie" },
  { value: "COURROIE", label: "Courroie" },
  { value: "REFROIDISSEMENT", label: "Refroidissement" },
  { value: "ELECTRICITE", label: "Electricité" },
  { value: "TRANSMISSION", label: "Transmission" },
  { value: "AUTRE", label: "Autre" }
];

const statusEntretienOptions = [
  { value: "PROGRAMME", label: "Programmé" },
  { value: "EN_COURS", label: "En Cours" },
  { value: "TERMINE", label: "Terminé" },
  { value: "ANNULE", label: "Annulé" }
];

export default function EntretienDialog({ open, onClose, onCreate, entretienToEdit }) {
  const [entretienData, setEntretienData] = React.useState({
    dateEntretien: null,
    typeEntretien: "",
    description: "",
    cout: "",
    dateProchainEntretien: null,
    statusEntretien: "PROGRAMME",
    camion: null,
  });

  const [errors, setErrors] = React.useState({});
  const [isCamionModalOpen, setIsCamionModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    if (entretienToEdit) {
      setEntretienData({
        dateEntretien: entretienToEdit.dateEntretien || null,
        typeEntretien: entretienToEdit.typeEntretien || "",
        description: entretienToEdit.description || "",
        cout: entretienToEdit.cout || "",
        dateProchainEntretien: entretienToEdit.dateProchainEntretien || null,
        statusEntretien: entretienToEdit.statusEntretien || "PROGRAMME",
        camion: entretienToEdit.camion || null,
      });
    } else {
      // Reset form when opening for new entry
      setEntretienData({
        dateEntretien: null,
        typeEntretien: "",
        description: "",
        cout: "",
        dateProchainEntretien: null,
        statusEntretien: "PROGRAMME",
        camion: null,
      });
    }
    setErrors({});
  }, [open, entretienToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!entretienData.dateEntretien) newErrors.dateEntretien = "La date est requise";
    if (!entretienData.typeEntretien) newErrors.typeEntretien = "Le type est requis";
    if (!entretienData.camion) newErrors.camion = "Un camion doit être sélectionné";
    if (!entretienData.statusEntretien) newErrors.statusEntretien = "Le statut est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntretienData({ ...entretienData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleDateChange = (name) => (newValue) => {
    setEntretienData({ ...entretienData, [name]: newValue });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSelectCamion = (camion) => {
    setEntretienData({ ...entretienData, camion });
    setIsCamionModalOpen(false);
    if (errors.camion) setErrors({ ...errors, camion: null });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setNotification({
        open: true,
        message: "Veuillez corriger les erreurs dans le formulaire",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...entretienData,
        cout: parseFloat(entretienData.cout) || 0,
      };
      await onCreate(payload);
      setNotification({
        open: true,
        message: entretienToEdit 
          ? "Entretien mis à jour avec succès" 
          : "Entretien créé avec succès",
        severity: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error saving maintenance:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Erreur lors de l'enregistrement",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {entretienToEdit ? "Modifier Entretien" : "Ajouter Entretien"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <DatePicker
              label="Date d'Entretien*"
              value={entretienData.dateEntretien}
              onChange={handleDateChange("dateEntretien")}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.dateEntretien,
                  helperText: errors.dateEntretien,
                },
              }}
            />

            <FormControl fullWidth margin="normal" error={!!errors.typeEntretien}>
              <InputLabel id="type-entretien-label">Type d'Entretien*</InputLabel>
              <Select
                labelId="type-entretien-label"
                id="typeEntretien"
                name="typeEntretien"
                value={entretienData.typeEntretien}
                label="Type d'Entretien*"
                onChange={handleInputChange}
              >
                {typeEntretienOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.typeEntretien && (
                <Typography variant="caption" color="error">
                  {errors.typeEntretien}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={entretienData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Coût"
              name="cout"
              value={entretienData.cout}
              onChange={handleInputChange}
              margin="normal"
              type="number"
              inputProps={{ step: "0.01" }}
            />

            <DatePicker
              label="Prochain Entretien"
              value={entretienData.dateProchainEntretien}
              onChange={handleDateChange("dateProchainEntretien")}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />

            <FormControl fullWidth margin="normal" error={!!errors.statusEntretien}>
              <InputLabel id="status-label">Statut*</InputLabel>
              <Select
                labelId="statusEntretien-label"
                id="statusEntretien"
                name="statusEntretien"
                value={entretienData.statusEntretien}
                label="Statut*"
                onChange={handleInputChange}
              >
                {statusEntretienOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.statusEntretien && (
                <Typography variant="caption" color="error">
                  {errors.statusEntretien}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.camion}>
              <TextField
                value={
                  entretienData.camion
                    ? `Camion: ${entretienData.camion.immatriculation} (${entretienData.camion.marque || ''})`
                    : ""
                }
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setIsCamionModalOpen(true)}
                fullWidth
                label="Camion*"
                error={!!errors.camion}
                helperText={errors.camion}
              />
              <Button
                variant="outlined"
                onClick={() => setIsCamionModalOpen(true)}
                sx={{ mt: 1 }}
                startIcon={<Typography>🚛</Typography>}
              >
                Sélectionner un Camion
              </Button>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <CamionSelect
        open={isCamionModalOpen}
        onClose={() => setIsCamionModalOpen(false)}
        onSelect={handleSelectCamion}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={notification.severity} onClose={handleCloseNotification}>
          {notification.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}