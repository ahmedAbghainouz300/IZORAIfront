import React, { useState, useEffect } from "react";
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
import AdressTable from "../adress/AdressTable";
import EditAdress from "../adress/editAdress";
import ViewAdress from "../adress/voirAdress";
import moraleService from "../../../../service/partenaire/moraleService";
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";
import AdressDialog from "../adress/addAdress";
import adressService from "../../../../service/partenaire/adressService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditMoraleDialog({
  open,
  onClose,
  partenaire,
  onSave,
}) {
  // Main form state
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

  // UI state
  const [validationError, setValidationError] = useState("");
  const [isFailedValidation, setIsFailedValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Address management
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isViewAddressOpen, setIsViewAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Type partenaire management
  const [isTypePartenaireModalOpen, setIsTypePartenaireModalOpen] =
    useState(false);
  const [selectedTypePartenaire, setSelectedTypePartenaire] = useState(null);

  // Initialize form data when dialog opens or partenaire changes
  useEffect(() => {
    if (open && partenaire) {
      setFormData({
        nom: partenaire.nom || "",
        ice: partenaire.ice?.toString() || "",
        numeroRC: partenaire.numeroRC?.toString() || "",
        abreviation: partenaire.abreviation || "",
        telephone: partenaire.telephone || "",
        email: partenaire.email || "",
        formeJuridique: partenaire.formeJuridique || "",
        typePartenaire: partenaire.typePartenaire || null,
        adresses: partenaire.adresses || [],
      });
      setSelectedTypePartenaire(partenaire.typePartenaire || null);

      if (partenaire.idPartenaire) {
        fetchAdressesById(partenaire.idPartenaire);
      }
    }
  }, [open, partenaire]);

  const fetchAdressesById = (id) => {
    setIsLoading(true);
    moraleService
      .getAdressesByPartenaire(id)
      .then((response) => {
        setFormData((prev) => ({ ...prev, adresses: response.data || [] }));
      })
      .catch((error) => {
        console.error("echec de recuperer les addresses:", error);
        setError("Echec de recuperer les adresses");
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (
      (name === "nom" || name === "ice" || name === "telephone") &&
      validationError
    ) {
      setValidationError("");
    }
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setValidationError("Nom est requis");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.ice) {
      setValidationError("ICE est requis");
      setIsFailedValidation(true);
      return false;
    }
    if (isNaN(formData.ice)) {
      setValidationError("ICE doit être un nombre valide");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.telephone) {
      setValidationError("numéro de téléphone est requis");
      setIsFailedValidation(true);
      return false;
    }
    if (isNaN(formData.telephone)) {
      setValidationError("numéro de téléphone doit être un nombre valide");
      setIsFailedValidation(true);
      return false;
    }
    if (!formData.typePartenaire) {
      setValidationError("type de partenaire est requis");
      setIsFailedValidation(true);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSelectTypePartenaire = (selectedType) => {
    setSelectedTypePartenaire(selectedType);
    setFormData({ ...formData, typePartenaire: selectedType });
    setIsTypePartenaireModalOpen(false);
    if (validationError === "type de partenaire est requis") {
      setValidationError("");
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedData = {
        nom: formData.nom,
        ice: Number(formData.ice),
        numeroRC: formData.numeroRC ? Number(formData.numeroRC) : null,
        telephone: formData.telephone,
        email: formData.email || null,
        abreviation: formData.abreviation || null,
        formeJuridique: formData.formeJuridique || null,
        typePartenaire: formData.typePartenaire,
      };

      await moraleService.update(partenaire.idPartenaire, updatedData);
      setSuccess("partenaire mis à jour avec succès");
      onSave();
      onClose();
    } catch (error) {
      console.error("echec de mise a jour:", error);
      setError(error.response?.data?.message || "echec de mise a jour");
    } finally {
      setIsLoading(false);
    }
  };

  // Address operations
  const handleAddAddress = async (newAddress) => {
    try {
      setIsLoading(true);
      await moraleService.addAdresse(partenaire.idPartenaire, newAddress);
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("addresses est ajoutée avec succès");
      setIsAddAddressOpen(false);
    } catch (error) {
      console.error("Add address error:", error);
      setError("echec de l'ajout de l'adresse");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (updatedAddress) => {
    try {
      setIsLoading(true);
      await moraleService.updateAdresse(
        updatedAddress.idAdresse,
        updatedAddress
      );
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("addresses sont mises à jour avec succès");
      setIsEditAddressOpen(false);
    } catch (error) {
      console.error("Update address error:", error);
      setError("echec de mise à jour de l'adresse");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdresse = async (id) => {
    try {
      setIsLoading(true);
      await adressService.delete(id);
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("Adresse supprimée avec succès");
    } catch (error) {
      console.error("Delete address error:", error);
      setError("echec de suppression de l'adresse");
    } finally {
      setIsLoading(false);
    }
  };

  // Dialog handlers
  const openEditDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsEditAddressOpen(true);
  };

  const openViewDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsViewAddressOpen(true);
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

  return (
    <>
      {/* Main Edit Dialog */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Moral Partner</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              label="Nom*"
              fullWidth
              margin="normal"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
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
              onChange={handleChange}
              error={
                !!validationError && (!formData.ice || isNaN(formData.ice))
              }
              helperText={
                validationError && (!formData.ice || isNaN(formData.ice))
                  ? validationError
                  : ""
              }
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />

            <TextField
              label="numero RC"
              fullWidth
              margin="normal"
              name="numeroRC"
              type="number"
              value={formData.numeroRC}
              onChange={handleChange}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />

            <TextField
              label="télèphone*"
              fullWidth
              margin="normal"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
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
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              label="Abbreviation"
              fullWidth
              margin="normal"
              name="abreviation"
              value={formData.abreviation}
              onChange={handleChange}
            />

            <TextField
              label="Legal Form"
              fullWidth
              margin="normal"
              name="formeJuridique"
              value={formData.formeJuridique}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal">
              <TextField
                label="type de partenaire*"
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
                  ? "changer Type Partenaire*"
                  : "Selectionner Type Partenaire*"}
              </Button>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setIsAdressModalOpen(true)}
                sx={{ mb: 2 }}
              >
                Manage Addresses ({formData.adresses.length})
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            annuler
          </Button>
          <Button
            onClick={handleSubmitEdit}
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address Table Dialog */}
      <AdressTable
        adresses={formData.adresses}
        onView={openViewDialog}
        onEdit={openEditDialog}
        onDelete={handleDeleteAdresse}
        open={isAdressModalOpen}
        onClose={() => setIsAdressModalOpen(false)}
        onAddAddress={() => setIsAddAddressOpen(true)}
        title="Address List"
      />

      {/* Partner Type Selection Dialog */}
      <TypePartenaireTable
        open={isTypePartenaireModalOpen}
        onClose={() => setIsTypePartenaireModalOpen(false)}
        onSelectTypePartenaire={handleSelectTypePartenaire}
      />

      {/* Add Address Dialog */}
      <AdressDialog
        open={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onAdd={handleAddAddress}
      />

      {/* Edit Address Dialog */}
      <EditAdress
        open={isEditAddressOpen}
        onClose={() => setIsEditAddressOpen(false)}
        adresse={selectedAddress}
        onUpdate={handleUpdateAddress}
      />

      {/* View Address Dialog */}
      <ViewAdress
        open={isViewAddressOpen}
        onClose={() => setIsViewAddressOpen(false)}
        adresse={selectedAddress}
      />

      {/* Notification Snackbars */}
      <Snackbar
        open={isFailedValidation}
        autoHideDuration={6000}
        onClose={handleCloseFailedValidation}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseFailedValidation}>
          {validationError || "Veuillez remplir tous les champs requis."}
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
