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
  Grid,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import TypeRemorqueSelect from "../../../select/TypeRemorqueSelect";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RemorqueDialog({ open, onClose, onCreate }) {
  const [remorqueData, setRemorqueData] = React.useState({
    typeRemorque: null,
    volumeStockage: "",
    poidsChargeMax: "",
    poidsVide: "",
    disponible: true,
  });

  const [isTypeRemorqueModalOpen, setIsTypeRemorqueModalOpen] = React.useState(false);
  const [errors, setErrors] = React.useState({
    typeRemorque: "",
    volumeStockage: "",
    poidsChargeMax: "",
    poidsVide: "",
  });
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isFailed, setIsFailed] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRemorqueData({ ...remorqueData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when typing
  };

  const handleSelectTypeRemorque = (typeRemorque) => {
    setRemorqueData({ ...remorqueData, typeRemorque });
    setErrors({ ...errors, typeRemorque: "" }); // Clear type error when selected
    setIsTypeRemorqueModalOpen(false);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!remorqueData.typeRemorque) {
      newErrors.typeRemorque = "Le type de remorque est obligatoire";
      isValid = false;
    }

    if (!remorqueData.volumeStockage) {
      newErrors.volumeStockage = "Le volume de stockage est obligatoire";
      isValid = false;
    } else if (isNaN(remorqueData.volumeStockage) || Number(remorqueData.volumeStockage) <= 0) {
      newErrors.volumeStockage = "Veuillez entrer un nombre valide > 0";
      isValid = false;
    }

    if (!remorqueData.poidsChargeMax) {
      newErrors.poidsChargeMax = "Le poids charge max est obligatoire";
      isValid = false;
    } else if (isNaN(remorqueData.poidsChargeMax) || Number(remorqueData.poidsChargeMax) <= 0) {
      newErrors.poidsChargeMax = "Veuillez entrer un nombre valide > 0";
      isValid = false;
    }

    if (!remorqueData.poidsVide) {
      newErrors.poidsVide = "Le poids vide est obligatoire";
      isValid = false;
    } else if (isNaN(remorqueData.poidsVide) || Number(remorqueData.poidsVide) <= 0) {
      newErrors.poidsVide = "Veuillez entrer un nombre valide > 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setIsSuccess(false);
  };

  const handleCloseFailed = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailed(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...remorqueData,
        volumeStockage: Number(remorqueData.volumeStockage),
        poidsChargeMax: Number(remorqueData.poidsChargeMax),
        poidsVide: Number(remorqueData.poidsVide),
      };

      await onCreate(payload);
      setIsSuccess(true);
      setRemorqueData({
        typeRemorque: null,
        volumeStockage: "",
        poidsChargeMax: "",
        poidsVide: "",
        disponible: true,
      });
      onClose();
    } catch (error) {
      console.error("Error creating remorque:", error);
      setIsFailed(true);
    }
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
            <Typography variant="h6">Ajout d'une remorque</Typography>
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
            {/* Type de Remorque */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={remorqueData.typeRemorque?.type || ""}
                  InputProps={{ readOnly: true }}
                  onClick={() => setIsTypeRemorqueModalOpen(true)}
                  fullWidth
                  label="Type de remorque*"
                  error={!!errors.typeRemorque}
                  helperText={errors.typeRemorque}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsTypeRemorqueModalOpen(true)}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  Sélectionner un type de remorque
                </Button>
              </FormControl>
            </Grid>

            {/* Volume de stockage */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Volume de stockage (m³)*"
                name="volumeStockage"
                value={remorqueData.volumeStockage}
                onChange={handleInputChange}
                type="number"
                error={!!errors.volumeStockage}
                helperText={errors.volumeStockage}
                size="small"
              />
            </Grid>

            {/* Poids Charge Max */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Poids charge max (kg)*"
                name="poidsChargeMax"
                value={remorqueData.poidsChargeMax}
                onChange={handleInputChange}
                type="number"
                error={!!errors.poidsChargeMax}
                helperText={errors.poidsChargeMax}
                size="small"
              />
            </Grid>

            {/* Poids Vide */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Poids vide (kg)*"
                name="poidsVide"
                value={remorqueData.poidsVide}
                onChange={handleInputChange}
                type="number"
                error={!!errors.poidsVide}
                helperText={errors.poidsVide}
                size="small"
              />
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

      {/* TypeRemorqueSelect Modal */}
      <TypeRemorqueSelect
        open={isTypeRemorqueModalOpen}
        onClose={() => setIsTypeRemorqueModalOpen(false)}
        onSelect={handleSelectTypeRemorque}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Remorque créée avec succès!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={isFailed}
        autoHideDuration={3000}
        onClose={handleCloseFailed}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseFailed} severity="error">
          Échec de la création de la remorque
        </Alert>
      </Snackbar>
    </>
  );
}