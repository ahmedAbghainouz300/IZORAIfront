import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  IconButton,
  Snackbar,
  Alert as MuiAlert,
  CircularProgress,
} from "@mui/material";
import CategorieSelect from "../../../components/select/marchandise/CategorieSelect";
import CloseIcon from "@mui/icons-material/Close";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export default function MarchandiseDialog({ open, onClose, onCreate }) {
  const [isCategorieModalOpen, setIsCategorieModalOpen] = React.useState(false);
  const [marchandiseData, setMarchandiseData] = React.useState({
    libelle: "",
    description: "",
    codeMarchandise: "",
    categorie: null,
  });
  const [validationErrors, setValidationErrors] = React.useState({
    libelle: false,
    codeMarchandise: false,
  });
  const [alert, setAlert] = React.useState({
    message: null,
    severity: "success",
  });
  const [loading, setLoading] = React.useState(false);

  const validateForm = () => {
    const errors = {
      libelle: !marchandiseData.libelle.trim(),
      codeMarchandise: !marchandiseData.codeMarchandise.trim(),
    };
    setValidationErrors(errors);
    return !errors.libelle && !errors.codeMarchandise;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarchandiseData({ ...marchandiseData, [name]: value });
    if (validationErrors[name] && value.trim()) {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const handleSelectCategorie = (categorie) => {
    setMarchandiseData({ ...marchandiseData, categorie });
    setIsCategorieModalOpen(false);
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: "success" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        libelle: marchandiseData.libelle,
        description: marchandiseData.description,
        codeMarchandise: marchandiseData.codeMarchandise,
        categorie: marchandiseData.categorie,
      };

      await onCreate(payload);
      setMarchandiseData({
        libelle: "",
        description: "",
        codeMarchandise: "",
        categorie: null,
      });
      setAlert({
        message: "Marchandise ajoutée avec succès",
        severity: "success",
      });
      onClose();
    } catch (error) {
      setAlert({
        message: "Erreur lors de l'ajout de la marchandise",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Ajout d'une Marchandise
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
            fullWidth
            label="Libellé*"
            name="libelle"
            value={marchandiseData.libelle}
            onChange={handleInputChange}
            margin="normal"
            error={validationErrors.libelle}
            helperText={
              validationErrors.libelle ? "Ce champ est obligatoire" : ""
            }
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={marchandiseData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Code Marchandise*"
            name="codeMarchandise"
            value={marchandiseData.codeMarchandise}
            onChange={handleInputChange}
            margin="normal"
            error={validationErrors.codeMarchandise}
            helperText={
              validationErrors.codeMarchandise ? "Ce champ est obligatoire" : ""
            }
            required
          />

          <FormControl fullWidth margin="normal">
            <TextField
              value={marchandiseData.categorie?.categorie || ""}
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
