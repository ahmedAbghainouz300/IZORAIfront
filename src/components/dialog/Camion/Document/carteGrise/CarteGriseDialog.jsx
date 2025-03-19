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

export default function CarteGriseDialog({ open, onClose, onSave }) {
  const [carteGriseData, setCarteGriseData] = React.useState({
    dateMiseEnCirculation: null,
    marque: "",
    genre: "",
    numeroSerie: "",
    couleur: "",
    nombrePlace: "",
    puissanceFiscale: "",
    energie: "",
    proprietaire: "",
    poidsVide: "",
    poidsAutorise: "",
    dateDelivrance: null,
    adress: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarteGriseData({ ...carteGriseData, [name]: value });
  };

  const handleDateChange = (name) => (newValue) => {
    setCarteGriseData({ ...carteGriseData, [name]: newValue });
  };

  const handleSubmit = async () => {
    const payload = {
      ...carteGriseData,
    };
    console.log(payload);
    onSave(payload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter Carte Grise</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Marque"
            name="marque"
            value={carteGriseData.marque}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Genre"
            name="genre"
            value={carteGriseData.genre}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Numéro de Série"
            name="numeroSerie"
            value={carteGriseData.numeroSerie}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Couleur"
            name="couleur"
            value={carteGriseData.couleur}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nombre de Places"
            name="nombrePlace"
            value={carteGriseData.nombrePlace}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />
          <TextField
            fullWidth
            label="Puissance Fiscale"
            name="puissanceFiscale"
            value={carteGriseData.puissanceFiscale}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Énergie"
            name="energie"
            value={carteGriseData.energie}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Propriétaire"
            name="proprietaire"
            value={carteGriseData.proprietaire}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Poids à Vide (kg)"
            name="poidsVide"
            value={carteGriseData.poidsVide}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />
          <TextField
            fullWidth
            label="Poids Autorisé (kg)"
            name="poidsAutorise"
            value={carteGriseData.poidsAutorise}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />
          <MobileDatePicker
            label="Date de Mise en Circulation"
            value={carteGriseData.dateMiseEnCirculation}
            onChange={handleDateChange("dateMiseEnCirculation")}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
          <MobileDatePicker
            label="Date de Délivrance"
            value={carteGriseData.dateDelivrance}
            onChange={handleDateChange("dateDelivrance")}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
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
