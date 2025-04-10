import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Box,
  Snackbar,
  Alert as MuiAlert,
  Chip,
  Stack,
} from "@mui/material";
import moraleService from "../../../../service/partenaire/moraleService";
import AdressDialog from "../adress/addAdress";
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";
import { LocationOn, Delete, Edit } from "@mui/icons-material";
import { 
 
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Paper
} from "@mui/material";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MoraleDialog({ open, onClose, onSave }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] =
    useState(false);
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    ice: "",
    numeroRC: "",
    abreviation: "",
    telephone: "",
    email: "",
    formeJuridique: "",
    typePartenaire: null,
    adresses: [],
  });

  const [validationError, setValidationError] = useState("");
  const [isFailedValidation, setIsFailedValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (
      (name === "nom" || name === "ice" || name === "telephone") &&
      validationError
    ) {
      setValidationError("");
    }
  };

  const handleAddAdress = (newAdresse) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      adresses: [
        ...prevFormData.adresses,
        {
          ...newAdresse,
          type: newAdresse.type || "Non spécifié",
        },
      ],
    }));
    setOpenAdress(false);
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setValidationError("Le nom est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.ice) {
      setValidationError("L'ICE est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (isNaN(formData.ice)) {
      setValidationError("L'ICE doit être un nombre valide");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.telephone) {
      setValidationError("Le téléphone est obligatoire");
      setIsFailedValidation(true);
      return false;
    }
    if (isNaN(formData.telephone)) {
      setValidationError("Le téléphone doit être un nombre valide");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.typePartenaire) {
      setValidationError("Le type de partenaire est obligatoire");
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

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccess(false);
  };

  const handleSelectTypePartenaire = (selectedType) => {
    setFormData((prevData) => ({
      ...prevData,
      typePartenaire: selectedType,
    }));
    setSelectedTypePartenaire(selectedType);
    setIsTypePartenaireModalOpen(false);
    if (validationError === "Le type de partenaire est obligatoire") {
      setValidationError("");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newMorale = {
        nom: formData.nom,
        ice: Number(formData.ice),
        numeroRC: formData.numeroRC ? Number(formData.numeroRC) : null,
        telephone: formData.telephone,
        email: formData.email || null,
        abreviation: formData.abreviation || null,
        formeJuridique: formData.formeJuridique || null,
        typePartenaire: formData.typePartenaire,
        adresses: formData.adresses,
      };

      await moraleService.create(newMorale);
      setSuccess(true);
      resetForm();
      onSave();
      onClose();
    } catch (error) {
      console.error("Error creating Morale:", error);
      setError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'ajout du partenaire moral"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      ice: "",
      numeroRC: "",
      abreviation: "",
      telephone: "",
      email: "",
      formeJuridique: "",
      typePartenaire: null,
      adresses: [],
    });
    setSelectedTypePartenaire(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ajouter un Partenaire Moral</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <TextField
            label="Nom*"
            fullWidth
            margin="normal"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            error={!!validationError && !formData.nom.trim()}
            helperText={
              validationError && !formData.nom.trim() ? validationError : ""
            }
            required
          />

          <TextField
            label="ICE*"
            fullWidth
            margin="normal"
            name="ice"
            type="number"
            value={formData.ice}
            onChange={handleInputChange}
            error={!!validationError && (!formData.ice || isNaN(formData.ice))}
            helperText={
              validationError && (!formData.ice || isNaN(formData.ice))
                ? validationError
                : ""
            }
            required
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />

          <TextField
            label="Numéro RC"
            fullWidth
            margin="normal"
            name="numeroRC"
            type="number"
            value={formData.numeroRC}
            onChange={handleInputChange}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />

          <TextField
            label="Téléphone*"
            fullWidth
            margin="normal"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            error={
              !!validationError &&
              (!formData.telephone || isNaN(formData.telephone))
            }
            helperText={
              validationError &&
              (!formData.telephone || isNaN(formData.telephone))
                ? validationError
                : ""
            }
            required
            inputProps={{
              inputMode: "tel",
              pattern: "[0-9]*",
            }}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <TextField
            label="Abréviation"
            fullWidth
            margin="normal"
            name="abreviation"
            value={formData.abreviation}
            onChange={handleInputChange}
          />

          <TextField
            label="Forme Juridique"
            fullWidth
            margin="normal"
            name="formeJuridique"
            value={formData.formeJuridique}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal">
            <Button
              variant="outlined"
              onClick={() => setIsTypePartenaireModalOpen(true)}
              sx={{ mt: 1 }}
            >
              Sélectionner un Type Partenaire*
            </Button>
            {selectedTypePartenaire && (
              <TextField
                label="Type Partenaire"
                value={selectedTypePartenaire.libelle}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
                error={!!validationError && !formData.typePartenaire}
                helperText={
                  validationError && !formData.typePartenaire
                    ? validationError
                    : ""
                }
              />
            )}
          </FormControl>
          <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Addresses
              </Typography>
              
              {formData.adresses.length > 0 ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <List dense>
                    {formData.adresses.map((adresse, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          secondaryAction={
                            <>
                              <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => handleDeleteAddress(index)}
                              >
                                <Delete fontSize="small" color="error" />
                              </IconButton>
                            </>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <LocationOn />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" component="div">
                                {adresse.rue}, {adresse.ville}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {adresse.codePostal}, {adresse.pays}
                                </Typography>
                                <Chip 
                                  label="Primary" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ ml: 1, fontSize: '0.6rem' }} 
                                />
                              </>
                            }
                          />
                        </ListItem>
                        {index < formData.adresses.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No addresses added yet
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    startIcon={<LocationOn />}
                    onClick={() => setOpenAdress(true)}
                    sx={{ mt: 1 }}
                  >
                    Add First Address
                  </Button>
                </Paper>
              )}
              
              <Button
                variant="outlined"
                startIcon={<LocationOn />}
                onClick={() => setOpenAdress(true)}
                sx={{ mt: 2 }}
              >
                {formData.adresses.length > 0 ? 'Add Another Address' : 'Add Address'}
              </Button>
            </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button onClick={() => setOpenAdress(true)} disabled={isLoading}>
          Ajouter une Adresse
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Ajouter"}
        </Button>
      </DialogActions>

      <TypePartenaireTable
        open={isTypePartenaireModalOpen}
        onClose={() => setIsTypePartenaireModalOpen(false)}
        onSelectTypePartenaire={handleSelectTypePartenaire}
      />

      <AdressDialog
        open={openAdress}
        onClose={() => setOpenAdress(false)}
        onAdd={handleAddAdress}
      />

      <Snackbar
        open={isFailedValidation}
        autoHideDuration={6000}
        onClose={handleCloseFailedValidation}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseFailedValidation}>
          {validationError || "Veuillez remplir tous les champs obligatoires"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseError}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSuccess}>
          Partenaire moral ajouté avec succès!
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
