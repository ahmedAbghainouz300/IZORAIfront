import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  Button,
  TextField,
  Box,
  FormControl,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import TypeRemorqueSelect from "../../../select/TypeRemorqueSelect";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  const [isTypeRemorqueModalOpen, setIsTypeRemorqueModalOpen] =
    React.useState(false);
  const [validationError, setValidationError] = React.useState("");
  const [isFailedValidation, setIsFailedValidation] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isFailed, setIsFailed] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRemorqueData({ ...remorqueData, [name]: value });
    if (validationError) {
      setValidationError("");
    }
  };

  const handleSelectTypeRemorque = (typeRemorque) => {
    setRemorqueData({ ...remorqueData, typeRemorque });
    setIsTypeRemorqueModalOpen(false);
  };

  const validateForm = () => {
    if (!remorqueData.volumeStockage) {
      setValidationError("Le volume de stockage est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!remorqueData.poidsChargeMax) {
      setValidationError("Le poids charge max est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!remorqueData.poidsVide) {
      setValidationError("Le poids vide est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleCloseFailedValidation = (event, reason) => {
    if (reason === "clickaway") return;
    setIsFailedValidation(false);
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
        idRemorque: 0,
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
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Ajout d'une Remorque
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Type de Remorque Field */}
        <FormControl fullWidth margin="normal">
          <TextField
            value={remorqueData.typeRemorque?.type || ""}
            InputProps={{ readOnly: true }}
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

        {/* Volume de stockage Field */}
        <TextField
          fullWidth
          label="Volume de stockage (m³)*"
          name="volumeStockage"
          value={remorqueData.volumeStockage}
          onChange={handleInputChange}
          margin="normal"
          type="number"
          error={!!validationError && validationError.includes("volume")}
          helperText={validationError.includes("volume") ? validationError : ""}
          required
        />

        {/* Poids Charge Max Field */}
        <TextField
          fullWidth
          label="Poids Charge Max (kg)*"
          name="poidsChargeMax"
          value={remorqueData.poidsChargeMax}
          onChange={handleInputChange}
          margin="normal"
          type="number"
          error={!!validationError && validationError.includes("poids charge")}
          helperText={
            validationError.includes("poids charge") ? validationError : ""
          }
          required
        />

        {/* Poids Vide Field */}
        <TextField
          fullWidth
          label="Poids Vide (kg)*"
          name="poidsVide"
          value={remorqueData.poidsVide}
          onChange={handleInputChange}
          margin="normal"
          type="number"
          error={!!validationError && validationError.includes("poids vide")}
          helperText={
            validationError.includes("poids vide") ? validationError : ""
          }
          required
        />
      </Box>

      {/* TypeRemorqueSelect Modal */}
      <TypeRemorqueSelect
        open={isTypeRemorqueModalOpen}
        onClose={() => setIsTypeRemorqueModalOpen(false)}
        onSelect={handleSelectTypeRemorque}
      />

      {/* Validation Error Snackbar */}
      <Snackbar
        open={isFailedValidation}
        autoHideDuration={3000}
        onClose={handleCloseFailedValidation}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseFailedValidation} severity="error">
          {validationError}
        </Alert>
      </Snackbar>

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
    </Dialog>
  );
}
