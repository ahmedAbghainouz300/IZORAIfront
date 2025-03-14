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

export default function AssuranceDialog({ vopen, onClose }) {
  const [assuranceData, setAssuranceData] = React.useState({
    numContrat: "",
    company: "",
    numCouverture: "",
    montant: "",
    dateDebut: null,
    dateFin: null,
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
    try {
      const payload = {
        ...assuranceData,
        dateDebut: assuranceData.dateDebut
          ? assuranceData.dateDebut.toISOString()
          : null,
        dateFin: assuranceData.dateFin
          ? assuranceData.dateFin.toISOString()
          : null,
      };

      const response = await fetch("/api/assurances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add assurance");
      }

      const newAssurance = await response.json();
      console.log("Assurance added successfully:", newAssurance);
      onClose();
    } catch (error) {
      console.error("Error adding assurance:", error);
      alert("Failed to add assurance. Please try again.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={vopen} onClose={onClose}>
        <DialogTitle>Ajouter Assurance</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Numero de contrat"
            name="numContrat"
            value={assuranceData.numContrat}
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
            name="numCouverture"
            value={assuranceData.numCouverture}
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
          />
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
            value={assuranceData.dateFin}
            onChange={handleDateChange("dateFin")}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
          <TextField
            fullWidth
            label="Prime annuelle"
            name="primeAnnuelle"
            value={assuranceData.primeAnnuelle}
            onChange={handleInputChange}
            margin="normal"
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
