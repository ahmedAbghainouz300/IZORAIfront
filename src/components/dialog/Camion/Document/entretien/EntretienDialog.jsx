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
  MenuItem
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
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
  { value: "AUTRE", label: "Autre" }
];

// Enum options for StatusEntretien
const statusEntretienOptions = [
  { value: "PROGRAMME", label: "Programmé" },
  { value: "EN_COURS", label: "En Cours" },
  { value: "TERMINE", label: "Terminé" },
  { value: "ANNULE", label: "Annulé" }
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

  const handleSubmit = () => {
    const payload = {
      ...entretienData,
    };
    onCreate(payload);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter Entretien</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Date d'Entretien"
            value={entretienData.dateEntretien}
            onChange={handleDateChange("dateEntretien")}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
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
            label="Coût"
            name="cout"
            value={entretienData.cout}
            onChange={handleInputChange}
            margin="normal"
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
              InputProps={{
                readOnly: true,
              }}
              onClick={() => setIsCamionModalOpen(true)}
              fullWidth
              label="Camion"
            />
            <Button
              variant="outlined"
              onClick={() => setIsCamionModalOpen(true)}
              style={{ marginTop: "8px" }}
            >
              Sélectionner un Camion
            </Button>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Camion Selection Modal */}
      <CamionSelect
        open={isCamionModalOpen}
        onClose={() => setIsCamionModalOpen(false)}
        onSelect={handleSelectCamion}
      />
    </LocalizationProvider>
  );
}