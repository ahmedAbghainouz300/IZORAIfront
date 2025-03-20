import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

export default function AssuranceDialog({ open, onClose, onSave }) {
  const [assuranceData, setAssuranceData] = React.useState({
    numeroContrat: "",
    company: "",
    typeCouverture: "",
    montant: "",
    dateDebut: null,
    dateExpiration: null,
    primeAnnuelle: "",
    numCarteVerte: "",
    statutCarteVerte: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssuranceData({ ...assuranceData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setAssuranceData({ ...assuranceData, [name]: newValue });
  };

  const handleSubmit = async () => {
    const payload = {
      ...assuranceData,
    };
    console.log(payload);
    onSave(payload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter Assurance</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Numero de contrat"
            name="numeroContrat"
            value={assuranceData.numeroContrat}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={assuranceData.company}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Type de couverture"
            name="typeCouverture"
            value={assuranceData.typeCouverture}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Montant"
            name="montant"
            value={assuranceData.montant}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <MobileDatePicker
              label="Date debut"
              value={assuranceData.dateDebut}
              onChange={handleDateChange("dateDebut")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
            <MobileDatePicker
              label="Date expiration"
              value={assuranceData.dateExpiration}
              onChange={handleDateChange("dateExpiration")}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </div>
          <TextField
            fullWidth
            label="Prime annuelle"
            name="primeAnnuelle"
            value={assuranceData.primeAnnuelle}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />

          <TextField
            fullWidth
            label="numero de la carte verte"
            name="numCarteVerte"
            value={assuranceData.numCarteVerte}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="statut de la carte verte"
            name="statutCarteVerte"
            value={assuranceData.statutCarteVerte}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
