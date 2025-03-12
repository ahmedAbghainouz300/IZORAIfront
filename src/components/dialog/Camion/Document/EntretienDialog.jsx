import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"; // Use MobileDatePicker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
export default function EntretienDialog({ vopen, onClose }) {
  const [entretienData, setEntretienData] = React.useState({
    dateEntretien: "",
    typeEntretien: "",
    description: "",
    cout: "",
    prochainEntretien: "",
    statut: "",
    camion: "", // Added camion field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntretienData({ ...entretienData, [name]: value });
  };

  const handleCamionChange = (event) => {
    setEntretienData({ ...entretienData, camion: event.target.value });
  };
  const handleDateChange = (name) => (newValue) => {
    setEntretienData({ ...entretienData, [name]: newValue });
  };
  const handleSubmit = () => {
    console.log("Entretien Data:", entretienData);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={vopen} onClose={onClose}>
        <DialogTitle>Ajouter Entretien</DialogTitle>
        <DialogContent>
          <MobileDatePicker
            label="Date d'Entretien"
            value={entretienData.dateEntretien}
            onChange={handleDateChange("dateEntretien")}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          <TextField
            fullWidth
            label="Type d'Entretien"
            name="typeEntretien"
            value={entretienData.typeEntretien}
            onChange={handleInputChange}
            margin="normal"
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
            label="Coût"
            name="cout"
            value={entretienData.cout}
            onChange={handleInputChange}
            margin="normal"
          />
          <MobileDatePicker
            label="Prochain Entretien"
            value={entretienData.prochainEntretien}
            onChange={handleDateChange("prochainEntretien")}
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

          {/* New Camion Selection Field */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Camion</InputLabel>
            <Select
              value={entretienData.camion}
              onChange={handleCamionChange}
              name="camion"
            >
              <MenuItem value="Camion 1">Camion 1</MenuItem>
              <MenuItem value="Camion 2">Camion 2</MenuItem>
              <MenuItem value="Camion 3">Camion 3</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
