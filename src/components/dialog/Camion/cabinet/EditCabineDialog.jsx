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
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import AssuranceSelect from "../../../select/AssuranceSelect";
import CarteGriseSelect from "../../../select/CarteGriseSelect";
import TypeCabineSelect from "../../../select/TypeCabineSelect";

// Enum des statuts
const statusOptions = [
  { value: "EN_SERVICE", label: "En Service" },
  { value: "EN_REPARATION", label: "En Réparation" },
  { value: "EN_MISSION", label: "En Mission" },
  { value: "HORS_SERVICE", label: "Hors Service" },
];

export default function EditCabineDialog({ open, onClose, cabine, onSave }) {
  const [formData, setFormData] = useState(cabine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] = useState(false);
  const [isTypeCabineModalOpen, setIsTypeCabineModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(cabine);
      setValidationError(""); // Clear validation errors when opening
      setShowValidationError(false); // Reset validation error display
    }
  }, [open, cabine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user types in immatriculation
    if (name === "immatriculation" && validationError) {
      setValidationError("");
    }
  };

  const validateForm = () => {
    if (!formData.immatriculation?.trim()) {
      setValidationError("L'immatriculation est obligatoire");
      setShowValidationError(true);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSelectAssurance = (assurance) => {
    setFormData({ ...formData, assurance });
    setIsAssuranceModalOpen(false);
  };

  const handleSelectCarteGrise = (carteGrise) => {
    setFormData({ ...formData, carteGrise });
    setIsCarteGriseModalOpen(false);
  };

  const handleSelectTypeCabine = (typeCabine) => {
    setFormData({ ...formData, typeCabine });
    setIsTypeCabineModalOpen(false);
  };

  const handleSubmit = async () => {
    const payload = {
      immatriculation: formData.immatriculation,
      typeCamion: formData.typeCamion,
      poidsMax: Number(formData.poidsMax),
      consommation: Number(formData.consommation),
      status: formData.status,
      assurance: formData.assurance,
      carteGrise: formData.carteGrise,
    };

    onSave(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Cabine</DialogTitle>
      <DialogContent>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <TextField
              name="immatriculation"
              label="Immatriculation*"
              value={formData.immatriculation || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!validationError}
              helperText={validationError}
              required
            />

            <FormControl fullWidth margin="normal">
              <TextField
                value={formData.typeCamion ? formData.typeCamion.type : ""}
                InputProps={{ readOnly: true }}
                onClick={() => setIsTypeCabineModalOpen(true)}
                fullWidth
                label="Type de Cabine"
              />
              <Button
                variant="outlined"
                onClick={() => setIsTypeCabineModalOpen(true)}
                style={{ marginTop: "8px" }}
              >
                Sélectionner un Type de Cabine
              </Button>
            </FormControl>

            <TextField
              name="poidsMax"
              label="Poids Max (kg)"
              value={formData.poidsMax || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Statut</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                label="Statut"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.assurance
                    ? `${formData.assurance.company} | ${formData.assurance.numeroContrat}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                onClick={() => setIsAssuranceModalOpen(true)}
                fullWidth
                label="Assurance"
              />
              <Button
                variant="outlined"
                onClick={() => setIsAssuranceModalOpen(true)}
                style={{ marginTop: "8px" }}
              >
                Sélectionner une Assurance
              </Button>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.carteGrise
                    ? `${formData.carteGrise.marque} | ${formData.carteGrise.numeroSerie}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                onClick={() => setIsCarteGriseModalOpen(true)}
                fullWidth
                label="Carte Grise"
              />
              <Button
                variant="outlined"
                onClick={() => setIsCarteGriseModalOpen(true)}
                style={{ marginTop: "8px" }}
              >
                Sélectionner une Carte Grise
              </Button>
            </FormControl>

            {/* Modals */}
            <AssuranceSelect
              open={isAssuranceModalOpen}
              onClose={() => setIsAssuranceModalOpen(false)}
              onSelectAssurance={handleSelectAssurance}
            />
            <CarteGriseSelect
              open={isCarteGriseModalOpen}
              onClose={() => setIsCarteGriseModalOpen(false)}
              onSelectCarteGrise={handleSelectCarteGrise}
            />
            <TypeCabineSelect
              open={isTypeCabineModalOpen}
              onClose={() => setIsTypeCabineModalOpen(false)}
              onSelect={handleSelectTypeCabine}
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          Enregistrer
        </Button>
      </DialogActions>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showValidationError}
        autoHideDuration={6000}
        onClose={handleCloseValidationError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">
          Veuillez remplir tous les champs obligatoires
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
