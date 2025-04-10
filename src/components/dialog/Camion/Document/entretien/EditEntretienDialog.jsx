import React, { useState, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
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
  { value: "AUTRE", label: "Autre" },
];

// Enum options for StatusEntretien
const statusEntretienOptions = [
  { value: "PROGRAMME", label: "Programmé" },
  { value: "EN_COURS", label: "En Cours" },
  { value: "TERMINE", label: "Terminé" },
  { value: "ANNULE", label: "Annulé" },
];

export default function EditEntretienDialog({
  open,
  onClose,
  entretien,
  onSave,
}) {
  const [formData, setFormData] = useState({
    ...entretien,
    statusEntretien: entretien.statusEntretien || "", // Ensure statut exists
  });
  const [isCamionModalOpen, setIsCamionModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });
  const [errors, setErrors] = useState({
    dateEntretien: false,
    typeEntretien: false,
    cout: false,
  });

  useEffect(() => {
    if (open) {
      setFormData(entretien);
      setAlert({ message: null, severity: "success" });
      setErrors({
        dateEntretien: false,
        typeEntretien: false,
        cout: false,
      });
    }
  }, [open, entretien]);

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectCamion = (camion) => {
    setFormData({ ...formData, camion });
    setIsCamionModalOpen(false);
  };

  const validateForm = () => {
    const newErrors = {
      dateEntretien: !formData.dateEntretien,
      typeEntretien: !formData.typeEntretien?.trim(),
      cout:
        !formData.cout ||
        isNaN(formData.cout) ||
        parseFloat(formData.cout) <= 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        cout: parseFloat(formData.cout),
      };
      await onSave(payload);
      setAlert({
        message: "Entretien mis à jour avec succès",
        severity: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error updating entretien:", error);
      setAlert({
        message: "Erreur lors de la mise à jour de l'entretien",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier l'Entretien</DialogTitle>
      <DialogContent>
        <TextField
          name="dateEntretien"
          label="Date d'Entretien"
          value={formData.dateEntretien}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        {/* Type Entretien Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-entretien-label">Type d'Entretien</InputLabel>
          <Select
            labelId="type-entretien-label"
            id="typeEntretien"
            name="typeEntretien"
            value={formData.typeEntretien}
            label="Type d'Entretien"
            onChange={handleChange}
          >
            {typeEntretienOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="cout"
          label="Coût (€)"
          value={formData.cout}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="dateProchainEntretien"
          label="Date Prochain Entretien"
          value={formData.dateProchainEntretien}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />

        {/* Status Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Statut</InputLabel>
          <Select
            labelId="status-label"
            id="statusEntretien"
            name="statusEntretien"
            value={formData.statusEntretien}
            label="statusEntretien"
            onChange={handleChange}
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
              formData.camion
                ? "Immatriculation: " + formData.camion.immatriculation
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
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>

      <CamionSelect
        open={isCamionModalOpen}
        onClose={() => setIsCamionModalOpen(false)}
        onSelect={handleSelectCamion}
      />
    </Dialog>
  );
}
