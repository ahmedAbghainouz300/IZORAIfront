import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
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

export default function CabineDialog({ open, onClose, onSave }) {
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = React.useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] = React.useState(false);
  const [isTypeCabineModalOpen, setIsTypeCabineModalOpen] = React.useState(false);

  const [cabineData, setCabineData] = React.useState({
    immatriculation: "",
    typeCamion: null,
    poidsMax: "",
    status: "",
    assurance: null,
    carteGrise: null,
  });

  const [errors, setErrors] = React.useState({});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCabineData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cabineData.immatriculation.trim()) {
      newErrors.immatriculation = "L'immatriculation est obligatoire";
    }

    if (!cabineData.typeCamion) {
      newErrors.typeCamion = "Le type de camion est obligatoire";
    }

    if (!cabineData.poidsMax) {
      newErrors.poidsMax = "Le poids max est obligatoire";
    } else if (isNaN(cabineData.poidsMax)) {
      newErrors.poidsMax = "Le poids max doit être un nombre valide";
    } else if (Number(cabineData.poidsMax) <= 0) {
      newErrors.poidsMax = "Le poids max doit être supérieur à 0";
    } else if (Number(cabineData.poidsMax) > 100000) {
      newErrors.poidsMax = "Le poids max ne doit pas dépasser 100000 kg";
    }

    if (!cabineData.status) {
      newErrors.status = "Le statut est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      immatriculation: cabineData.immatriculation,
      typeCamion: cabineData.typeCamion,
      poidsMax: Number(cabineData.poidsMax),
      status: cabineData.status,
      assurance: cabineData.assurance,
      carteGrise: cabineData.carteGrise,
    };
    onSave(payload);

    // Reset form data
    setCabineData({
      immatriculation: "",
      typeCamion: null,
      poidsMax: "",
      status: "",
      assurance: null,
      carteGrise: null,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  const handleSelectAssurance = (assurance) => {
    setCabineData({ ...cabineData, assurance });
    setIsAssuranceModalOpen(false);
  };

  const handleSelectCarteGrise = (carteGrise) => {
    setCabineData({ ...cabineData, carteGrise });
    setIsCarteGriseModalOpen(false);
  };

  const handleSelectTypeCabine = (typeCamion) => {
    setCabineData({ ...cabineData, typeCamion });
    setIsTypeCabineModalOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Ajout d'une cabine</Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Immatriculation */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Immatriculation*"
                name="immatriculation"
                value={cabineData.immatriculation}
                onChange={handleInputChange}
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
                value={cabineData.poidsMax}
                onChange={handleInputChange}
                type="number"
                error={!!errors.poidsMax}
                helperText={errors.poidsMax}
                size="small"
              />
            </Grid>

            {/* Type de Camion */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  value={cabineData.typeCamion ? cabineData.typeCamion.type : ""}
                  InputProps={{ readOnly: true }}
                  onClick={() => {
                          setIsTypeCabineModalOpen(true);
                          setErrors(
                            (prevErrors) => (
                              { ...prevErrors, typeCamion: "" } ));
                          }}
                  fullWidth
                  error={!!errors.typeCamion}
                  helperText={errors.typeCamion}
                  label="Type de Camion*"
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={() =>{
                     setIsTypeCabineModalOpen(true);}}
                  sx={{ mt: 1 }}
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
                  id="status"
                  name="status"
                  value={cabineData.status}
                  label="Statut"
                  onChange={  handleInputChange} 
                  error={!!errors.status}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Assurance */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  value={
                    cabineData.assurance
                      ? `${cabineData.assurance.company} | ${cabineData.assurance.numeroContrat}`
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                  onClick={() => setIsAssuranceModalOpen(true)}
                  fullWidth
                  label="Assurance*"
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
                  value={
                    cabineData.carteGrise
                      ? `${cabineData.carteGrise.marque} | ${cabineData.carteGrise.numeroSerie}`
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                  onClick={() => setIsCarteGriseModalOpen(true)}
                  fullWidth
                  label="Carte Grise*"
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

      {/* Modals for Select Components */}
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

      {/* Snackbar for Validation Errors */}
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