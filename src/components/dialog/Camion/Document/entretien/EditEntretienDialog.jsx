import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
} from "@mui/material";
import CamionSelect from "../../../../select/CamionSelect"; // Import the CamionSelect component

export default function EditEntretienDialog({
  open,
  onClose,
  entretien,
  onSave,
}) {
  const [formData, setFormData] = useState(entretien);
  const [isCamionModalOpen, setIsCamionModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for selecting a camion
  const handleSelectCamion = (camion) => {
    setFormData({ ...formData, camion });
    setIsCamionModalOpen(false);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
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
        <TextField
          name="typeEntretien"
          label="Type d'Entretien"
          value={formData.typeEntretien}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
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

        {/* Camion Selection Field */}
        <FormControl fullWidth margin="normal">
          <TextField
            value={
              formData.camion
                ? "Immatriculation : " + formData.camion.immatriculation // Display the selected camion's immatriculation
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

      {/* Camion Selection Modal */}
      <CamionSelect
        open={isCamionModalOpen}
        onClose={() => setIsCamionModalOpen(false)}
        onSelect={handleSelectCamion} // Pass the handler for selection
      />
    </Dialog>
  );
}
