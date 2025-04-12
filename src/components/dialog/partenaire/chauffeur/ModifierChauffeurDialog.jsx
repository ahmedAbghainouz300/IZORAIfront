import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import chauffeurService from "../../../../service/partenaire/chaufeurService";
import adressService from "../../../../service/partenaire/adressService";
import physiqueService from "../../../../service/partenaire/physiqueService";
import AdressTable from "../adress/AdressTable";
import AddAddressDialog from "../adress/addAdress"; // à inclure si nécessaire
import EditAdress from "../adress/editAdress";
import ViewAdress from "../adress/voirAdress";

export default function ModifierChauffeurDialog({
  open,
  onClose,
  chauffeur,
  onUpdateSuccess,
}) {
  const [adresses, setAdresses] = useState([]);
  const [isAdressModalOpen, setIsAdressModalOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
 const [isViewAddressOpen, setIsViewAddressOpen] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cni: "",
    email: "",
    telephone: "",
    cnss: "",
    dateRecrutement: "",
    dateExpirationPermis: "",
    disponibilite: "",
  });

  const [permisRecto, setPermisRecto] = useState(null);
  const [permisVerso, setPermisVerso] = useState(null);

  const validateForm = () => {
    const newErrors = {
      nom: !formData.nom.trim(),
      prenom: !formData.prenom.trim(),
      cni: !formData.cni.trim(),
      telephone: !formData.telephone.trim(),
      dateExpirationPermis: !formData.dateExpirationPermis,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const fetchAdressesById = (id) => {
    physiqueService
      .getAdressesByPartenaire(id)
      .then((response) => setAdresses(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des adresses:", error)
      );
  };

  useEffect(() => {
    if (chauffeur) {
      setFormData({
        nom: chauffeur.nom || "",
        prenom: chauffeur.prenom || "",
        cni: chauffeur.cni || "",
        email: chauffeur.email || "",
        telephone: chauffeur.telephone || "",
        cnss: chauffeur.cnss || "",
        dateExpirationPermis: chauffeur.dateExpirationPermis || "",
        dateRecrutement: chauffeur.dateRecrutement || "",
        disponibilite: chauffeur.disponibilite || "",
      });

      if (chauffeur.permisRectoUrl) setPreviewRecto(chauffeur.permisRectoUrl);
      if (chauffeur.permisVersoUrl) setPreviewVerso(chauffeur.permisVersoUrl);

      fetchAdressesById(chauffeur.idPartenaire);
    }
  }, [chauffeur]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // const handleFileChange = (event, type) => {
  //   const file = event.target.files[0];
  //   if (type === "recto") {
  //     setPermisRecto(file);
  //     setPreviewRecto(URL.createObjectURL(file));
  //   } else {
  //     setPermisVerso(file);
  //     setPreviewVerso(URL.createObjectURL(file));
  //   }
  // };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );

    if (permisRecto) data.append("permisRecto", permisRecto);
    if (permisVerso) data.append("permisVerso", permisVerso);

    try {
      await chauffeurService.update(chauffeur.idPartenaire, data);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  const openEditDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsEditAddressOpen(true);
  };

  const openViewDialog = (adresse) => {
    setSelectedAddress(adresse);
    setIsViewAddressOpen(true);
  };
    const handleAddAddress = async (newAddress) => {
      try {
         await physiqueService.addAdresse(chauffeur.idPartenaire, newAddress);
        await fetchAdressesById(chauffeur.idPartenaire);
        setIsAddAddressOpen(false);
      } catch (error) {
        console.error("Error adding address:", error);
        throw error;
      }
    };
    const handleChangeAdress = ()=>{
      fetchAdressesById(chauffeur.idPartenaire);
      console.log("address was updatet succesfelly")
    }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Modifier le Chauffeur</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2}>
          <TextField
            label="Nom *"
            name="nom"
            fullWidth
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            helperText={errors.nom && "Champ requis"}
          />
          <TextField
            label="Prénom *"
            name="prenom"
            fullWidth
            value={formData.prenom}
            onChange={handleChange}
            error={errors.prenom}
            helperText={errors.prenom && "Champ requis"}
          />
        </Box>
        <Box display="flex" gap={2} mt={2}>
          <TextField
            label="CNI *"
            name="cni"
            fullWidth
            value={formData.cni}
            onChange={handleChange}
            error={errors.cni}
            helperText={errors.cni && "Champ requis"}
          />
          <TextField
            label="Téléphone *"
            name="telephone"
            fullWidth
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            helperText={errors.telephone && "Champ requis"}
          />
        </Box>

        <TextField
          margin="dense"
          label="Date d'expiration du permis *"
          name="dateExpirationPermis"
          type="date"
          fullWidth
          value={formData.dateExpirationPermis}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={errors.dateExpirationPermis}
          helperText={errors.dateExpirationPermis && "Champ requis"}
          required
        />

        <TextField
          margin="dense"
          label="Email"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="CNSS"
          name="cnss"
          fullWidth
          value={formData.cnss}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Date de recrutement"
          name="dateRecrutement"
          type="date"
          fullWidth
          value={formData.dateRecrutement}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      <TextField
        margin="dense"
        label="Disponibilité"
        name="disponibilite"
        fullWidth
        select
        value={formData.disponibilite}
        onChange={handleChange}
      >
        <MenuItem value={true}>Disponible</MenuItem>
        <MenuItem value={false}>Non Disponible</MenuItem>
      </TextField>

        {/* <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Photos du Permis
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ border: "1px dashed grey", p: 2, textAlign: "center" }}>
              {previewRecto ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={previewRecto}
                    alt="Recto du permis"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      marginBottom: "10px",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemovePhoto("photoPermisRecto")}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Button variant="contained" component="label" fullWidth>
                    Ajouter Recto
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      ref={rectoInputRef}
                      onChange={(e) => handleFileChange(e, "photoPermisRecto")}
                    />
                  </Button>
                  <Typography variant="caption" display="block">
                    Format: JPEG, PNG (Max 5MB)
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ border: "1px dashed grey", p: 2, textAlign: "center" }}>
              {previewVerso ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={previewVerso}
                    alt="Verso du permis"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      marginBottom: "10px",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemovePhoto("photoPermisVerso")}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Button variant="contained" component="label" fullWidth>
                    Ajouter Verso
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      ref={versoInputRef}
                      onChange={(e) => handleFileChange(e, "photoPermisVerso")}
                    />
                  </Button>
                  <Typography variant="caption" display="block">
                    Format: JPEG, PNG (Max 5MB)
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid> */}

        <Button
          variant="outlined"
          onClick={() => setIsAdressModalOpen(true)}
          sx={{ mt: 2, mb: 2 }}
        >
          Gérer les adresses
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Enregistrer
        </Button>
      </DialogActions>

      <AdressTable
        adresses={adresses}
        onView={openViewDialog}
        onEdit={openEditDialog}
        onDelete={(id) =>
          adressService.delete(id).then(() => fetchAdressesById(chauffeur.idPartenaire))
        }
        open={isAdressModalOpen}
        onClose={() => setIsAdressModalOpen(false)}
        onAddAddress={() => setIsAddAddressOpen(true)}
        title="Liste des adresses"
      />

      <AddAddressDialog
        open={isAddAddressOpen}
        onClose={() => {
          setIsAddAddressOpen(false);
          setSelectedAddress(null);
          fetchAdressesById(chauffeur.idPartenaire);
        }}
        onAdd={handleAddAddress}
      />
      {/* Edit Address Dialog */}
      <EditAdress
        open={isEditAddressOpen}
        onClose={() => setIsEditAddressOpen(false)}
        adresse={selectedAddress}
        onUpdate={handleChangeAdress}
      />
      { /* View Address Dialog */}
      <ViewAdress
        open={isViewAddressOpen}
        onClose={() => setIsViewAddressOpen(false)}
        adresse={selectedAddress}
      />      
    </Dialog>
  );
}
