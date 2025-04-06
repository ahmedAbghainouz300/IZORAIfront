import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CloudUpload, Delete, AddAPhoto } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function EditAssuranceDialog({
  open,
  onClose,
  assurance,
  onSave,
  onSuccess,
}) {
  const [formData, setFormData] = React.useState({
    numeroContrat: "",
    company: "",
    typeCouverture: "",
    montant: "",
    dateDebut: null,
    dateExpiration: null,
    primeAnnuelle: "",
    numCarteVerte: "",
    statutCarteVerte: "",
    photoAssurance: null,
  });
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Initialize form when opening or when assurance changes
  React.useEffect(() => {
    if (open && assurance) {
      setFormData({
        ...assurance,
        dateDebut: assurance.dateDebut ? new Date(assurance.dateDebut) : null,
        dateExpiration: assurance.dateExpiration
          ? new Date(assurance.dateExpiration)
          : null,
      });

      if (assurance.photoAssurance) {
        // If photo is stored as base64, set it directly
        if (typeof assurance.photoAssurance === "string") {
          setPhotoPreview(`data:image/jpeg;base64,${assurance.photoAssurance}`);
        }
      }
    }
  }, [open, assurance]);

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoAssurance: null }));
    setPhotoPreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (newValue) => {
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.match("image.*")) {
      setError("Veuillez sélectionner un fichier image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB max
      setError("La taille de l'image ne doit pas dépasser 5MB");
      return;
    }

    try {
      // Créer l'aperçu
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);

      // Convertir en base64 pour le backend
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setFormData((prev) => ({
        ...prev,
        photoAssurance: base64String,
      }));
      setError(null);
    } catch (err) {
      setError("Erreur lors du traitement de l'image");
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation des champs requis
      if (!formData.numeroContrat || !formData.company) {
        throw new Error(
          "Les champs numéro de contrat et compagnie sont obligatoires"
        );
      }

      const payload = {
        ...formData,
        dateDebut: formData.dateDebut?.toISOString(),
        dateExpiration: formData.dateExpiration?.toISOString(),
      };

      await onSave(payload);

      if (typeof onSuccess === "function") {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Erreur:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de la modification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "primary.main",
          }}
        >
          Modifier l'Assurance
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Numéro de contrat"
                name="numeroContrat"
                value={formData.numeroContrat || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                fullWidth
                label="Compagnie"
                name="company"
                value={formData.company || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                fullWidth
                label="Type de couverture"
                name="typeCouverture"
                value={formData.typeCouverture || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Montant"
                name="montant"
                value={formData.montant || ""}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prime annuelle"
                name="primeAnnuelle"
                value={formData.primeAnnuelle || ""}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Numéro de la carte verte"
                name="numCarteVerte"
                value={formData.numCarteVerte || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Statut de la carte verte"
                name="statutCarteVerte"
                value={formData.statutCarteVerte || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date de début"
                value={formData.dateDebut}
                onChange={handleDateChange("dateDebut")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date d'expiration"
                value={formData.dateExpiration}
                onChange={handleDateChange("dateExpiration")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "action.hover",
                  "&:hover": {
                    backgroundColor: "action.selected",
                  },
                }}
              >
                {photoPreview ? (
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={photoPreview}
                      variant="rounded"
                      sx={{
                        width: "100%",
                        height: 200,
                        mb: 2,
                      }}
                    />
                    <IconButton
                      onClick={handleRemovePhoto}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "error.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "error.dark",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <CloudUpload
                      fontSize="large"
                      color="action"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="subtitle1" gutterBottom>
                      Glissez-déposez la photo de l'assurance ou
                    </Typography>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<AddAPhoto />}
                      sx={{ mt: 1 }}
                    >
                      Sélectionner une image
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </Button>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Formats supportés: JPEG, PNG (Max. 5MB)
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined" disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
