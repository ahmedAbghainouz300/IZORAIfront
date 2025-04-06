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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CamionSelect from "../../../../select/CamionSelect";

// Enum options for TypeEntretien
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
  { value: "AUTRE", label: "Autre" },
];

// Enum options for StatusEntretien
const statusEntretienOptions = [
  { value: "PROGRAMME", label: "Programmé" },
  { value: "EN_COURS", label: "En Cours" },
  { value: "TERMINE", label: "Terminé" },
  { value: "ANNULE", label: "Annulé" },
];

export default function EntretienDialog({ open, onClose, onCreate }) {
  const [entretienData, setEntretienData] = React.useState({
    dateEntretien: null,
    typeEntretien: "",
    description: "",
    cout: "",
    dateProchainEntretien: null,
    statusEntretien: "",
    camion: null,
  });
  const [isCamionModalOpen, setIsCamionModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    message: null,
    severity: "success",
  });
  const [errors, setErrors] = React.useState({
    dateEntretien: false,
    typeEntretien: false,
    cout: false,
  });

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntretienData({ ...entretienData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setEntretienData({ ...entretienData, [name]: newValue });
  };

  const handleSelectCamion = (camion) => {
    setEntretienData({ ...entretienData, camion });
    setIsCamionModalOpen(false);
  };

  const validateForm = () => {
    const newErrors = {
      dateEntretien: !entretienData.dateEntretien,
      typeEntretien: !entretienData.typeEntretien.trim(),
      cout:
        !entretienData.cout ||
        isNaN(entretienData.cout) ||
        parseFloat(entretienData.cout) <= 0,
    };
    setErrors(newErrors);

    const errorMessages = [];
    if (newErrors.dateEntretien) errorMessages.push("La date d'entretien");
    if (newErrors.typeEntretien) errorMessages.push("Le type d'entretien");
    if (newErrors.cout) errorMessages.push("Le coût");

    if (errorMessages.length > 0) {
      setAlert({
        message: `${errorMessages.join(", ")} ${errorMessages.length > 1 ? "sont" : "est"} obligatoire(s)`,
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...entretienData,
        cout: parseFloat(entretienData.cout),
      };
      await onCreate(payload);
      setAlert({
        message: "Entretien ajouté avec succès",
        severity: "success",
      });
      setEntretienData({
        dateEntretien: null,
        typeEntretien: "",
        description: "",
        cout: "",
        dateProchainEntretien: null,
        statut: "",
        camion: null,
      });
      onClose();
    } catch (error) {
      console.error("Error creating entretien:", error);
      setAlert({
        message: "Erreur lors de la création de l'entretien",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Ajouter Entretien
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DatePicker
            label="Date d'Entretien*"
            value={entretienData.dateEntretien}
            onChange={(newValue) => {
              handleDateChange("dateEntretien")(newValue);
              setErrors({ ...errors, dateEntretien: false });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={errors.dateEntretien}
                helperText={
                  errors.dateEntretien ? "Ce champ est obligatoire" : ""
                }
                required
              />
            )}
          />

          {/* Type Entretien Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-entretien-label">Type d'Entretien</InputLabel>
            <Select
              labelId="type-entretien-label"
              id="typeEntretien"
              name="typeEntretien"
              value={entretienData.typeEntretien}
              label="Type d'Entretien"
              onChange={handleInputChange}
            >
              {typeEntretienOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            onChange={(e) => {
              handleInputChange(e);
              setErrors({ ...errors, cout: false });
            }}
            margin="normal"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            error={errors.cout}
            helperText={errors.cout ? "Veuillez entrer un montant valide" : ""}
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

          {/* Status Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Statut</InputLabel>
            <Select
              labelId="statusEntretien-label"
              id="statusEntretien"
              name="statusEntretien"
              value={entretienData.statusEntretien}
              label="statusEntretien"
              onChange={handleInputChange}
            >
              {statusEntretienOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Camion Selection Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              value={
                entretienData.camion
                  ? "Immatriculation: " + entretienData.camion.immatriculation
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
          <Button onClick={onClose} color="secondary" variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      <CamionSelect
        open={isCamionModalOpen}
        onClose={() => setIsCamionModalOpen(false)}
        onSelect={handleSelectCamion}
      />
    </LocalizationProvider>
  );
}
