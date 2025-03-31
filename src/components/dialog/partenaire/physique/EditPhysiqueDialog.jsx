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
import AddAdress from "../adress/addAdress";
import EditAdress from "../adress/editAdress";
import ViewAdress from "../adress/voirAdress";
import physiqueService from "../../../../service/partenaire/physiqueService";
import TypePartenaireTable from "../typepartenaire/typePartenaieTable";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditPhysiqueDialog({
  open,
  onClose,
  partenaire,
  onSave,
}) {
  // Main form state
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    cni: "",
    email: "",
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
        prenom: partenaire.prenom || "",
        telephone: partenaire.telephone || "",
        cni: partenaire.cni?.toString() || "",
        email: partenaire.email || "",
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
    physiqueService
      .getAdressesByPartenaire(id)
      .then((response) => {
        setFormData((prev) => ({ ...prev, adresses: response.data || [] }));
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
        setError("Failed to load addresses");
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (e) => {
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
    if (isNaN(formData.cni)) {
      setValidationError("CNI must be a valid number");
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

  const handleSelectTypePartenaire = (selectedType) => {
    setSelectedTypePartenaire(selectedType);
    setFormData({ ...formData, typePartenaire: selectedType });
    setIsTypePartenaireModalOpen(false);
    if (validationError === "Partner type is required") {
      setValidationError("");
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedData = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        cni: Number(formData.cni),
        email: formData.email || null,
        typePartenaire: formData.typePartenaire,
      };

      await physiqueService.update(partenaire.idPartenaire, updatedData);
      setSuccess("Partner updated successfully");
      onSave();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Failed to update partner");
    } finally {
      setIsLoading(false);
    }
  };

  // Address operations
  const handleAddAddress = async (newAddress) => {
    try {
      setIsLoading(true);
      await physiqueService.addAdresse(partenaire.idPartenaire, newAddress);
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("Address added successfully");
      setIsAddAddressOpen(false);
    } catch (error) {
      console.error("Add address error:", error);
      setError("Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (updatedAddress) => {
    try {
      setIsLoading(true);
      await physiqueService.updateAdresse(
        updatedAddress.idAdresse,
        updatedAddress
      );
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("Address updated successfully");
      setIsEditAddressOpen(false);
    } catch (error) {
      console.error("Update address error:", error);
      setError("Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdresse = async (id) => {
    try {
      setIsLoading(true);
      await physiqueService.deleteAdresse(id);
      await fetchAdressesById(partenaire.idPartenaire);
      setSuccess("Address deleted successfully");
    } catch (error) {
      console.error("Delete address error:", error);
      setError("Failed to delete address");
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
        <DialogTitle>Edit Physical Partner</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              label="Name*"
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
              label="First Name*"
              fullWidth
              margin="normal"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
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
              label="CNI*"
              fullWidth
              margin="normal"
              name="cni"
              value={formData.cni}
              onChange={handleChange}
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
              onChange={handleChange}
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
            Cancel
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
      <AddAdress
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
