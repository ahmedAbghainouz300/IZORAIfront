import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CamionSelect from "../../../../select/CamionSelect";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export default function EditEntretienDialog({
  open,
  onClose,
  entretien,
  onSave,
}) {
  const [formData, setFormData] = useState(entretien);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Modifier l'Entretien
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
          <DatePicker
            label="Date d'Entretien*"
            value={formData?.dateEntretien || null}
            onChange={(newValue) => {
              setFormData({ ...formData, dateEntretien: newValue });
              setErrors({ ...errors, dateEntretien: false });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={errors.dateEntretien}
                helperText={
                  errors.dateEntretien ? "Ce champ est obligatoire" : ""
                }
                required
              />
            )}
          />

          <TextField
            name="typeEntretien"
            label="Type d'Entretien*"
            value={formData?.typeEntretien || ""}
            onChange={(e) => {
              handleChange(e);
              setErrors({ ...errors, typeEntretien: false });
            }}
            fullWidth
            margin="normal"
            error={errors.typeEntretien}
            helperText={errors.typeEntretien ? "Ce champ est obligatoire" : ""}
            required
          />

          <TextField
            name="description"
            label="Description"
            value={formData?.description || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="cout"
            label="Coût (€)*"
            value={formData?.cout || ""}
            onChange={(e) => {
              handleChange(e);
              setErrors({ ...errors, cout: false });
            }}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            error={errors.cout}
            helperText={errors.cout ? "Veuillez entrer un montant valide" : ""}
            required
          />

          <DatePicker
            label="Prochain Entretien"
            value={formData?.dateProchainEntretien || null}
            onChange={(newValue) =>
              setFormData({ ...formData, dateProchainEntretien: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          <FormControl fullWidth margin="normal">
            <TextField
              value={
                formData?.camion
                  ? `Camion: ${formData.camion.immatriculation}`
                  : ""
              }
              InputProps={{ readOnly: true }}
              onClick={() => setIsCamionModalOpen(true)}
              fullWidth
              label="Camion"
            />
            <Button
              variant="outlined"
              onClick={() => setIsCamionModalOpen(true)}
              sx={{ mt: 1 }}
            >
              Sélectionner un Camion
            </Button>
          </FormControl>
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
      </Dialog>

      <CamionSelect
        open={isCamionModalOpen}
        onClose={() => setIsCamionModalOpen(false)}
        onSelect={handleSelectCamion}
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
    </LocalizationProvider>
  );
}
