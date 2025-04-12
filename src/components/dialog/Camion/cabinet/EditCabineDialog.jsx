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
  Grid,
  Typography,
  IconButton,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

import AssuranceSelect from "../../../select/AssuranceSelect";
import CarteGriseSelect from "../../../select/CarteGriseSelect";
import TypeCabineSelect from "../../../select/TypeCabineSelect";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const statusOptions = [
  { value: "EN_SERVICE", label: "En Service" },
  { value: "EN_REPARATION", label: "En Réparation" },
  { value: "EN_MISSION", label: "En Mission" },
  { value: "HORS_SERVICE", label: "Hors Service" },
];

export default function EditCabineDialog({ open, onClose, cabine, onSave }) {
  const [formData, setFormData] = useState({
    immatriculation: "",
    typeCamion: null,
    poidsMax: "",
    status: "",
    assurance: null,
    carteGrise: null,
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] = useState(false);
  const [isTypeCabineModalOpen, setIsTypeCabineModalOpen] = useState(false);
  

  useEffect(() => {
    if (open && cabine) {
      setFormData({
        immatriculation: cabine.immatriculation || "",
        typeCamion: cabine.typeCamion || null,
        poidsMax: cabine.poidsMax?.toString() || "",
        status: cabine.status || "",
        assurance: cabine.assurance || null,
        carteGrise: cabine.carteGrise || null,
      });
      setErrors({});
    }
  }, [open, cabine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.immatriculation.trim()) {
      newErrors.immatriculation = "L'immatriculation est obligatoire";
    }

    if (!formData.typeCamion) {
      newErrors.typeCamion = "Le type de camion est obligatoire";
    }

    if (!formData.poidsMax) {
      newErrors.poidsMax = "Le poids max est obligatoire";
    } else if (isNaN(formData.poidsMax)) {
      newErrors.poidsMax = "Le poids max doit être un nombre valide";
    } else if (Number(formData.poidsMax) <= 0) {
      newErrors.poidsMax = "Le poids max doit être supérieur à 0";
    } else if (Number(formData.poidsMax) > 100000) {
      newErrors.poidsMax = "Le poids max ne doit pas dépasser 100000 kg";
    }

    if (!formData.status) {
      newErrors.status = "Le statut est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      immatriculation: formData.immatriculation,
      typeCamion: formData.typeCamion,
      poidsMax: Number(formData.poidsMax),
      status: formData.status,
      assurance: formData.assurance,
      carteGrise: formData.carteGrise,
    };

    onSave(payload);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Modifier la cabine</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Immatriculation */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Immatriculation*"
                name="immatriculation"
                value={formData.immatriculation}
                onChange={handleChange}
                error={!!errors.immatriculation}
                helperText={errors.immatriculation}
                size="small"
              />
            </Grid>

            {/* Poids Max */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Poids Max (kg)*"
                name="poidsMax"
                type="number"
                value={formData.poidsMax}
                onChange={handleChange}
                error={!!errors.poidsMax}
                helperText={errors.poidsMax}
                size="small"
              />
            </Grid>

            {/* Type de Camion */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Type de Camion*"
                  value={formData.typeCamion ? formData.typeCamion.type : ""}
                  InputProps={{ readOnly: true }}
                  onClick={() => setIsTypeCabineModalOpen(true)}
                  error={!!errors.typeCamion}
                  helperText={errors.typeCamion}
                  size="small"
                />
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => setIsTypeCabineModalOpen(true)}
                  size="small"
                >
                  Sélectionner un Type de Camion
                </Button>
              </FormControl>
            </Grid>

            {/* Statut */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-label">Statut*</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Statut"
                  error={!!errors.status}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && (
                  <Typography variant="caption" color="error">
                    {errors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Assurance */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Assurance*"
                  value={
                    formData.assurance
                      ? `${formData.assurance.company} | ${formData.assurance.numeroContrat}`
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                  onClick={() => setIsAssuranceModalOpen(true)}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsAssuranceModalOpen(true)}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  Sélectionner une Assurance
                </Button>
              </FormControl>
            </Grid>

            {/* Carte Grise */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Carte Grise*"
                  value={
                    formData.carteGrise
                      ? `${formData.carteGrise.marque} | ${formData.carteGrise.numeroSerie}`
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                  onClick={() => setIsCarteGriseModalOpen(true)}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsCarteGriseModalOpen(true)}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  Sélectionner une Carte Grise
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogs de sélection */}
      <AssuranceSelect
        open={isAssuranceModalOpen}
        onClose={() => setIsAssuranceModalOpen(false)}
        onSelectAssurance={(assurance) => {
          setFormData({ ...formData, assurance });
          setIsAssuranceModalOpen(false);
        }}
      />

      <CarteGriseSelect
        open={isCarteGriseModalOpen}
        onClose={() => setIsCarteGriseModalOpen(false)}
        onSelectCarteGrise={(carteGrise) => {
          setFormData({ ...formData, carteGrise });
          setIsCarteGriseModalOpen(false);
        }}
      />

      <TypeCabineSelect
        open={isTypeCabineModalOpen}
        onClose={() => setIsTypeCabineModalOpen(false)}
        onSelect={(typeCamion) => {
          setFormData({ ...formData, typeCamion });
          setIsTypeCabineModalOpen(false);
        }}
      />

      {/* Snackbar pour erreurs de validation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Veuillez remplir tous les champs obligatoires</Alert>
      </Snackbar>
    </>
  );
}
