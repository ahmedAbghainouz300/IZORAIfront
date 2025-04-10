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
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import marchandiseService from "../../../service/marchandise/marchandiseService";
import SelectDialogCategorie from "./categorie/SelectDialogCategorie";
import SelectDialogUnite from "./unite/SelectDialogUnite";
import SelectDialogEmballage from "./emballage/SelectDialogEmballage";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

export default function EditMarchandiseDialog({
  open,
  onClose,
  marchandise,
  onSave,
}) {
  const [formData, setFormData] = useState({
    libelle: "",
    description: "",
    codeMarchandise: "",
    categorie: null,
    unite: null,
    emballage: null,
  });
  const [categorieDialogOpen, setCategorieDialogOpen] = useState(false);
  const [uniteDialogOpen, setUniteDialogOpen] = useState(false);
  const [emballageDialogOpen, setEmballageDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [validationErrors, setValidationErrors] = useState({
    libelle: false,
    codeMarchandise: false,
    categorie: false,
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open && marchandise) {
      setFormData({
        libelle: marchandise.libelle || "",
        description: marchandise.description || "",
        codeMarchandise: marchandise.codeMarchandise || "",
        categorie: marchandise.categorie || null,
        unite: marchandise.unite || null,
        emballage: marchandise.emballage || null,
      });
      setValidationErrors({
        libelle: false,
        codeMarchandise: false,
        categorie: false,
      });
    }
  }, [open, marchandise]);

  const validateForm = () => {
    const errors = {
      libelle: !formData.libelle?.trim(),
      codeMarchandise: !formData.codeMarchandise?.trim(),
      categorie: !formData.categorie,
    };
    setValidationErrors(errors);
    return !errors.libelle && !errors.codeMarchandise && !errors.categorie;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name] && value.trim()) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      enqueueSnackbar("Veuillez corriger les erreurs dans le formulaire", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const marchandiseData = {
        libelle: formData.libelle.trim(),
        description: formData.description.trim(),
        codeMarchandise: formData.codeMarchandise.trim(),
        categorie: { id: formData.categorie.id },
        unite: formData.unite ? { id: formData.unite.id } : null,
        emballage: formData.emballage ? { id: formData.emballage.id } : null,
      };

      const response = await marchandiseService.update(
        marchandise.id,
        marchandiseData
      );
      onSave(response.data);
      setAlert({
        open: true,
        message: "Marchandise mise à jour avec succès",
        severity: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error updating marchandise:", error);
      setAlert({
        open: true,
        message:
          error.response?.data?.message || "Erreur lors de la modification",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
              label="Libellé *"
              fullWidth
              value={formData.libelle}
              onChange={handleChange}
              margin="normal"
              error={validationErrors.libelle}
              helperText={
                validationErrors.libelle ? "Ce champ est obligatoire" : ""
              }
              required
              disabled={loading}
            />

            <TextField
              name="description"
              label="Description"
              fullWidth
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              disabled={loading}
            />

            <TextField
              name="codeMarchandise"
              label="Code Marchandise *"
              fullWidth
              value={formData.codeMarchandise}
              onChange={handleChange}
              margin="normal"
              error={validationErrors.codeMarchandise}
              helperText={
                validationErrors.codeMarchandise
                  ? "Ce champ est obligatoire"
                  : ""
              }
              required
              disabled={loading}
            />

            <TextField
              label="Catégorie *"
              fullWidth
              value={formData.categorie?.libelle || ""}
              onClick={() => setCategorieDialogOpen(true)}
              InputProps={{ readOnly: true }}
              margin="normal"
              error={validationErrors.categorie}
              helperText={
                validationErrors.categorie
                  ? "Veuillez sélectionner une catégorie"
                  : ""
              }
              required
              disabled={loading}
            />

            <TextField
              label="Unité"
              fullWidth
              value={formData.unite?.libelle || ""}
              onClick={() => setUniteDialogOpen(true)}
              InputProps={{ readOnly: true }}
              margin="normal"
              disabled={loading}
            />

            <TextField
              label="Emballage"
              fullWidth
              value={formData.emballage?.libelle || ""}
              onClick={() => setEmballageDialogOpen(true)}
              InputProps={{ readOnly: true }}
              margin="normal"
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Mettre à jour"}
          </Button>
        </DialogActions>
      </Dialog>

      <SelectDialogCategorie
        open={categorieDialogOpen}
        onClose={() => setCategorieDialogOpen(false)}
        onSelect={(categorie) => {
          setFormData((prev) => ({ ...prev, categorie }));
          setValidationErrors((prev) => ({ ...prev, categorie: false }));
          setCategorieDialogOpen(false);
        }}
      />

      <SelectDialogUnite
        open={uniteDialogOpen}
        onClose={() => setUniteDialogOpen(false)}
        onSelect={(unite) => {
          setFormData((prev) => ({ ...prev, unite }));
          setUniteDialogOpen(false);
        }}
      />

      <SelectDialogEmballage
        open={emballageDialogOpen}
        onClose={() => setEmballageDialogOpen(false)}
        onSelect={(emballage) => {
          setFormData((prev) => ({ ...prev, emballage }));
          setEmballageDialogOpen(false);
        }}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} onClose={handleCloseAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
