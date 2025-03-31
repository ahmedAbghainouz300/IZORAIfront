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
  IconButton,
  Box,
} from "@mui/material";
import CategorieSelect from "../../../components/select/marchandise/CategorieSelect";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

export default function EditMarchandiseDialog({
  open,
  onClose,
  marchandise,
  onSave,
}) {
  const [formData, setFormData] = useState(marchandise);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: "success" });
  const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    libelle: false,
    codeMarchandise: false,
  });

  useEffect(() => {
    if (open) {
      setFormData(marchandise);
      setAlert({ message: null, severity: "success" });
    }
  }, [open, marchandise]);

  const validateForm = () => {
    const errors = {
      libelle: !formData.libelle?.trim(),
      codeMarchandise: !formData.codeMarchandise?.trim(),
    };
    setValidationErrors(errors);
    return !errors.libelle && !errors.codeMarchandise;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name] && value.trim()) {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const handleSelectCategorie = (categorie) => {
    setFormData({ ...formData, categorie });
    setIsCategorieModalOpen(false);
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      setAlert({
        message: "Marchandise modifiée avec succès",
        severity: "success",
      });
      onClose();
    } catch (error) {
      setAlert({
        message: "Erreur lors de la modification de la marchandise",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Modifier la Marchandise
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 2 }}>
          <TextField
            name="libelle"
            label="Libellé*"
            value={formData.libelle || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={validationErrors.libelle}
            helperText={
              validationErrors.libelle ? "Ce champ est obligatoire" : ""
            }
            required
          />

          <TextField
            name="description"
            label="Description"
            value={formData.description || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            name="codeMarchandise"
            label="Code Marchandise*"
            value={formData.codeMarchandise || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={validationErrors.codeMarchandise}
            helperText={
              validationErrors.codeMarchandise ? "Ce champ est obligatoire" : ""
            }
            required
          />

          <FormControl fullWidth margin="normal">
            <TextField
              value={formData.categorie?.categorie || ""}
              InputProps={{ readOnly: true }}
              onClick={() => setIsCategorieModalOpen(true)}
              fullWidth
              label="Catégorie"
            />
            <Button
              variant="outlined"
              onClick={() => setIsCategorieModalOpen(true)}
              style={{ marginTop: "8px" }}
            >
              Sélectionner une Catégorie
            </Button>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Enregistrer"}
        </Button>
      </DialogActions>

      <CategorieSelect
        open={isCategorieModalOpen}
        onClose={() => setIsCategorieModalOpen(false)}
        onSelectCategorie={handleSelectCategorie}
      />

      <Snackbar
        open={!!alert.message}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} onClose={handleCloseAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
