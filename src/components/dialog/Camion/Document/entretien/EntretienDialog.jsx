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
    camion: null, // Change to an object
  });

  const [isCamionModalOpen, setIsCamionModalOpen] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntretienData({ ...entretienData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setEntretienData({ ...entretienData, [name]: newValue });
  };

  // Handler for selecting a camion
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

          {/* Camion Selection Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              value={
                entretienData.camion
                  ? "immatriculation : " + entretienData.camion.immatriculation // Assuming `camion` has a `type` property
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
        onSelect={handleSelectCamion} // Pass the handler for selection
      />
    </LocalizationProvider>
  );
}
