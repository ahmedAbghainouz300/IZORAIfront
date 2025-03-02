import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function EntretienDialog({ open, onClose }) {
  const [entretienData, setEntretienData] = React.useState({
    dateEntretien: "",
    typeEntretien: "",
    description: "",
    cout: "",
    prochainEntretien: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntretienData({ ...entretienData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Entretien Data:", entretienData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}
