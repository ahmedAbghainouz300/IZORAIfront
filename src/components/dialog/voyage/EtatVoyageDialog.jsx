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
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setSelectedEtat(event.target.value);
    setError(null);
  };

  const handleConfirm = async () => {
    if (selectedEtat !== currentEtat) {
      try {
        await onEtatChange(voyage.id, selectedEtat);
        onClose();
      } catch (error) {
        setError(
          error.response?.data?.message || "Erreur lors du changement d'état"
        );
      }
    } else {
      onClose();
    }
  };

  const etatOptions = [
    { value: "PLANIFIE", label: "Planifié" },
    { value: "EN_COURS", label: "En cours" },
    { value: "EN_INCIDENT", label: "Incident" },
    { value: "TERMINE", label: "Terminé" },
    { value: "ANNULE", label: "Annulé" },
  ];

  const getValidEtatOptions = () => {
    const options = [];

    // Always include current state (disabled)
    options.push({
      value: currentEtat,
      label:
        etatOptions.find((o) => o.value === currentEtat)?.label || currentEtat,
      disabled: true,
    });

    // Add valid transitions based on current state
    switch (currentEtat) {
      case "PLANIFIE":
        options.push(
          ...etatOptions.filter((opt) =>
            ["EN_COURS", "ANNULE"].includes(opt.value)
          )
        );
        break;
      case "EN_COURS":
        options.push(
          ...etatOptions.filter((opt) =>
            ["EN_INCIDENT", "TERMINE"].includes(opt.value)
          )
        );
        break;
      case "EN_INCIDENT":
        options.push(
          ...etatOptions.filter((opt) =>
            ["EN_COURS", "TERMINE"].includes(opt.value)
          )
        );
        break;
    }

    // Disable EN_COURS if warnings exist
    if (voyage?.warnings?.length > 0) {
      options.forEach((opt) => {
        if (opt.value === "EN_COURS") {
          opt.disabled = true;
          opt.label += " (résoudre les alertes d'abord)";
        }
      });
    }

    return options;
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

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Nouvel état</InputLabel>
            <Select
              value={selectedEtat}
              onChange={handleChange}
              label="Nouvel état"
            >
              {validOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
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
          disabled={selectedEtat === currentEtat || validOptions.length <= 1} // <=1 because we always include current state
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EtatVoyageComponent;
