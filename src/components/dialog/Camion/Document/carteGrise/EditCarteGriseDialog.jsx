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

export default function EditCarteGriseDialog({
  open,
  onClose,
  carteGrise,
  onSave,
  onSuccess,
}) {
  const [formData, setFormData] = React.useState({
    dateMiseEnCirculation: null,
    marque: "",
    genre: "",
    numeroSerie: "",
    couleur: "",
    nombrePlace: "",
    puissanceFiscale: "",
    energie: "",
    proprietaire: "",
    poidsVide: "",
    poidsAutorise: "",
    dateDelivrance: null,
    photoCarteGrise: null,
  });
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Initialize form when opening or when carteGrise changes
  React.useEffect(() => {
    if (open && carteGrise) {
      setFormData({
        ...carteGrise,
        dateMiseEnCirculation: carteGrise.dateMiseEnCirculation
          ? new Date(carteGrise.dateMiseEnCirculation)
          : null,
        dateDelivrance: carteGrise.dateDelivrance
          ? new Date(carteGrise.dateDelivrance)
          : null,
      });

      if (carteGrise.photoCarteGrise) {
        // If photo is stored as base64, set it directly
        if (typeof carteGrise.photoCarteGrise === "string") {
          setPhotoPreview(
            `data:image/jpeg;base64,${carteGrise.photoCarteGrise}`
          );
        }
      }
    }
  }, [open, carteGrise]);

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoCarteGrise: null }));
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
        photoCarteGrise: base64String,
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
      if (!formData.marque || !formData.numeroSerie) {
        throw new Error(
          "Les champs marque et numéro de série sont obligatoires"
        );
      }

      const payload = {
        ...formData,
        dateMiseEnCirculation: formData.dateMiseEnCirculation?.toISOString(),
        dateDelivrance: formData.dateDelivrance?.toISOString(),
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
          Modifier la Carte Grise
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
                label="Marque"
                name="marque"
                value={formData.marque || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={formData.genre || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Numéro de Série"
                name="numeroSerie"
                value={formData.numeroSerie || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                fullWidth
                label="Couleur"
                name="couleur"
                value={formData.couleur || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Nombre de Places"
                name="nombrePlace"
                value={formData.nombrePlace || ""}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Puissance Fiscale"
                name="puissanceFiscale"
                value={formData.puissanceFiscale || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Énergie"
                name="energie"
                value={formData.energie || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Propriétaire"
                name="proprietaire"
                value={formData.proprietaire || ""}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Poids à Vide (kg)"
                name="poidsVide"
                value={formData.poidsVide || ""}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Poids Autorisé (kg)"
                name="poidsAutorise"
                value={formData.poidsAutorise || ""}
                onChange={handleInputChange}
                margin="normal"
                type="number"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date de Mise en Circulation"
                value={formData.dateMiseEnCirculation}
                onChange={handleDateChange("dateMiseEnCirculation")}
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
                label="Date de Délivrance"
                value={formData.dateDelivrance}
                onChange={handleDateChange("dateDelivrance")}
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
                      Glissez-déposez la photo de la carte grise ou
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
