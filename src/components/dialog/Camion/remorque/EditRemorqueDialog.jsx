import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TypeRemorqueSelect from "../../../select/TypeRemorqueSelect"; // Import the TypeRemorqueSelect component
import { FormControl } from "@mui/material";

export default function EditRemorqueDialog({
  open,
  onClose,
  remorque,
  onSave,
}) {
  const [formData, setFormData] = useState(remorque);
  const [isTypeRemorqueModalOpen, setIsTypeRemorqueModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for selecting a typeRemorque
  const handleSelectTypeRemorque = (typeRemorque) => {
    setFormData({ ...formData, typeRemorque });
    setIsTypeRemorqueModalOpen(false);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Remorque</DialogTitle>
      <DialogContent>
        {/* Replace the TextField for Type de Remorque with TypeRemorqueSelect */}
        <FormControl fullWidth margin="normal">
          <TextField
            value={
              formData.typeRemorque
                ? formData.typeRemorque.type // Assuming `typeRemorque` has a `type` property
                : ""
            }
            InputProps={{
              readOnly: true,
            }}
            onClick={() => setIsTypeRemorqueModalOpen(true)}
            fullWidth
            label="Type de Remorque"
          />
          <Button
            variant="outlined"
            onClick={() => setIsTypeRemorqueModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner un Type de Remorque
          </Button>
        </FormControl>

        <TextField
          name="volumesStockage"
          label="Volume de Stockage (m³)"
          value={formData.volumesStockage}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="poidsVide"
          label="Poids à Vide (kg)"
          value={formData.poidsVide}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="poidsChargeMax"
          label="Poids Charge Max (kg)"
          value={formData.poidsChargeMax}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>

      {/* TypeRemorqueSelect Modal */}
      <TypeRemorqueSelect
        open={isTypeRemorqueModalOpen}
        onClose={() => setIsTypeRemorqueModalOpen(false)}
        onSelect={handleSelectTypeRemorque} // Pass the handler for selection
      />
    </Dialog>
  );
}
