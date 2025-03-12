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

  const handleSubmit = () => {
    console.log("Entretien Data:", entretienData);
    onClose();
  };

  return (
    <Dialog open={vopen} onClose={onClose}>
      <DialogTitle>Ajouter Entretien</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Date d'Entretien"
          name="dateEntretien"
          value={entretienData.dateEntretien}
          onChange={handleInputChange}
          margin="normal"
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
        <TextField
          fullWidth
          label="Prochain Entretien"
          name="prochainEntretien"
          value={entretienData.prochainEntretien}
          onChange={handleInputChange}
          margin="normal"
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
  );
}
