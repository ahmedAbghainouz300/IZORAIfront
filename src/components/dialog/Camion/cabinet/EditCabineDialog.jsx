import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AssuranceSelect from "../../../select/AssuranceSelect";
import CarteGriseSelect from "../../../select/CarteGriseSelect";
import TypeCabineSelect from "../../../select/TypeCabineSelect";

export default function EditCabineDialog({ open, onClose, cabine, onSave }) {
  const [formData, setFormData] = useState(cabine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] = useState(false);
  const [isTypeCamionModalOpen, setIsTypeCamionModalOpen] = useState(false); // State for TypeCamion modal

  useEffect(() => {
    if (open) {
      setFormData(cabine);
    }
  }, [open, cabine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectAssurance = (assurance) => {
    setFormData({ ...formData, assurance });
    setIsAssuranceModalOpen(false); // Close the modal after selection
  };

  const handleSelectCarteGrise = (carteGrise) => {
    setFormData({ ...formData, carteGrise });
    setIsCarteGriseModalOpen(false); // Close the modal after selection
  };

  // Handler for selecting a TypeCamion
  const handleSelectTypeCamion = (typeCamion) => {
    setFormData({ ...formData, typeCamion });
    setIsTypeCamionModalOpen(false); // Close the modal after selection
  };

  const handleSubmit = async () => {
    const payload = {
      immatriculation: formData.immatriculation,
      typeCamion: formData.typeCamion, // Updated to use typeCamion
      poidsMax: Number(formData.poidsMax),
      consommation: Number(formData.consommation),
      assurance: formData.assurance,
      carteGrise: formData.carteGrise,
    };

    setFormData({
      immatriculation: "",
      typeCamion: null, // Reset to null
      poidsMax: 0,
      consommation: 0,
      assurance: null,
      carteGrise: null,
    });
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
              justifyContent: "space-between",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Immatriculation Field */}
            <TextField
              name="immatriculation"
              label="Immatriculation"
              value={formData.immatriculation || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            {/* Type de Camion Field */}
            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.typeCamion
                    ? formData.typeCamion.type // Assuming `typeCamion` has a `type` property
                    : ""
                }
                InputProps={{
                  readOnly: true, // Make the field read-only
                }}
                onClick={() => setIsTypeCamionModalOpen(true)} // Open the modal on click
                fullWidth
                label="Type de Camion"
              />
              <Button
                variant="outlined"
                onClick={() => setIsTypeCamionModalOpen(true)}
                style={{ marginTop: "8px" }}
              >
                Sélectionner un Type de Camion
              </Button>
            </FormControl>

            {/* Poids Max Field */}
            <TextField
              name="poidsMax"
              label="Poids Max (kg)"
              value={formData.poidsMax || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />

            {/* Consommation Field */}
            <TextField
              name="consommation"
              label="Consommation (L/100km)"
              value={formData.consommation || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />

            {/* Assurance Field */}
            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.assurance
                    ? `${formData.assurance.company} | ${formData.assurance.numeroContrat}`
                    : ""
                }
                InputProps={{
                  readOnly: true, // Make the field read-only
                }}
                onClick={() => setIsAssuranceModalOpen(true)} // Open the modal on click
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

            {/* Carte Grise Field */}
            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.carteGrise
                    ? `${formData.carteGrise.marque} | ${formData.carteGrise.numeroSerie}`
                    : ""
                }
                InputProps={{
                  readOnly: true, // Make the field read-only
                }}
                onClick={() => setIsCarteGriseModalOpen(true)} // Open the modal on click
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

            {/* Assurance Selection Modal */}
            <AssuranceSelect
              open={isAssuranceModalOpen}
              onClose={() => setIsAssuranceModalOpen(false)}
              onSelectAssurance={handleSelectAssurance}
            />

            {/* Carte Grise Selection Modal */}
            <CarteGriseSelect
              open={isCarteGriseModalOpen}
              onClose={() => setIsCarteGriseModalOpen(false)}
              onSelectCarteGrise={handleSelectCarteGrise}
            />

            {/* TypeCamion Selection Modal */}
            <TypeCabineSelect
              open={isTypeCamionModalOpen}
              onClose={() => setIsTypeCamionModalOpen(false)}
              onSelect={handleSelectTypeCamion} // Pass the handler for selection
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

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
