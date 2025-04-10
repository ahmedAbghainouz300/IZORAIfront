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
} from "@mui/material";
import AdressDialog from "../adress/addAdress";
import physiqueService from "../../../../service/partenaire/physiqueService";
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";
import { LocationOn, Delete, Edit } from "@mui/icons-material";
import { 
  Chip,
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

export default function PhysiqueDialog({ open, onClose, onAdd }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] =
    useState(false);
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    cni: "",
    email: "",
    typePartenaire: null,
    adresses: [],
  });

  const [validationError, setValidationError] = useState("");
  const [isFailedValidation, setIsFailedValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (
      (name === "nom" ||
        name === "prenom" ||
        name === "telephone" ||
        name === "cni") &&
      validationError
    ) {
      setValidationError("");
    }
  };

  const handleAddAdress = (newAdresse) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      adresses: [...prevFormData.adresses, newAdresse],
    }));
    setOpenAdress(false);
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setValidationError("Name is required");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.prenom.trim()) {
      setValidationError("First name is required");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.telephone) {
      setValidationError("Phone number is required");
      setIsFailedValidation(true);
      return false;
    }
    if (isNaN(formData.telephone)) {
      setValidationError("Phone must be a valid number");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.cni) {
      setValidationError("CNI is required");
      setIsFailedValidation(true);
      return false;
    }
   
    if (!formData.typePartenaire) {
      setValidationError("Partner type is required");
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
    setSuccess(null);
  };

  const handleSelectTypePartenaire = (selectedType) => {
    setSelectedTypePartenaire(selectedType);
    setFormData({ ...formData, typePartenaire: selectedType });
    setIsTypePartenaireModalOpen(false);
    if (validationError === "Partner type is required") {
      setValidationError("");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newPhysique = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        cni: Number(formData.cni),
        email: formData.email || null,
        typePartenaire: formData.typePartenaire,
        adresses: formData.adresses,
      };

      await physiqueService.create(newPhysique);
      setSuccess("Partner created successfully");
      resetForm();
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error creating Physique:", error);
      setError(error.response?.data?.message || "Failed to create partner");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      telephone: "",
      cni: "",
      email: "",
      typePartenaire: null,
      adresses: [],
    });
    setSelectedTypePartenaire(null);
  };

  const handleDeleteAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      adresses: prev.adresses.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Physical Partner</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              label="Name*"
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
              label="First Name*"
              fullWidth
              margin="normal"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              error={!!validationError && !formData.prenom.trim()}
              helperText={
                validationError && !formData.prenom.trim()
                  ? validationError
                  : ""
              }
              required
            />

            <TextField
              label="Phone*"
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
              inputProps={{ inputMode: "tel", pattern: "[0-9]*" }}
            />

            <TextField
              label="CNI*"
              fullWidth
              margin="normal"
              name="cni"
              value={formData.cni}
              onChange={handleInputChange}
              error={
                !!validationError && (!formData.cni || isNaN(formData.cni))
              }
              helperText={
                validationError && (!formData.cni || isNaN(formData.cni))
                  ? validationError
                  : ""
              }
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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

            <FormControl fullWidth margin="normal">
              <TextField
                label="Partner Type"
                value={selectedTypePartenaire?.libelle || ""}
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
              <Button
                variant="outlined"
                onClick={() => setIsTypePartenaireModalOpen(true)}
                sx={{ mt: 1 }}
              >
                {selectedTypePartenaire
                  ? "Change Partner Type*"
                  : "Select Partner Type*"}
              </Button>
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
            Cancel
          </Button>
          
          <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

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
          {validationError || "Please fill all required fields"}
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
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSuccess}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}
