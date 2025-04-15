import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

const EtatVoyageComponent = ({
  open,
  onClose,
  voyage,
  onEtatChange,
  currentEtat,
}) => {
  const [selectedEtat, setSelectedEtat] = useState(currentEtat);

  const handleChange = (event) => {
    setSelectedEtat(event.target.value);
  };

  const handleConfirm = () => {
    if (selectedEtat !== currentEtat) {
      onEtatChange(voyage.id, selectedEtat);
    }
    onClose();
  };

  const etatOptions = [
    { value: "PLANIFIE", label: "Planifié" },
    { value: "EN_COURS", label: "En cours" },
    { value: "EN_INCIDENT", label: "Incident" },
    { value: "TERMINE", label: "Terminé" },
    { value: "ANNULE", label: "Annulé" },
  ];

  // Filter out invalid transitions based on current state
  const getValidEtatOptions = () => {
    switch (currentEtat) {
      case "PLANIFIE":
        return etatOptions.filter((opt) =>
          ["EN_COURS", "ANNULE"].includes(opt.value)
        );
      case "EN_COURS":
        return etatOptions.filter((opt) =>
          ["EN_INCIDENT", "TERMINE"].includes(opt.value)
        );
      case "EN_INCIDENT":
        return etatOptions.filter((opt) =>
          ["EN_COURS", "TERMINE"].includes(opt.value)
        );
      default:
        return []; // No changes allowed for TERMINE or ANNULE
    }
  };

  const validOptions = getValidEtatOptions();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier l'état du voyage</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Voyage: {voyage?.lieuDepart?.ville} → {voyage?.lieuArrive?.ville}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ID: {voyage?.id}
          </Typography>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Nouvel état</InputLabel>
            <Select
              value={selectedEtat}
              onChange={handleChange}
              label="Nouvel état"
            >
              {validOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedEtat === currentEtat || validOptions.length === 0}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EtatVoyageComponent;
