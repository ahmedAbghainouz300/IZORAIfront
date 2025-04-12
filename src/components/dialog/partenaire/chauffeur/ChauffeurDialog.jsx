import React, { useState, useRef } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  FormControl,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import chauffeurService from "../../../../service/partenaire/chaufeurService";
import AdressDialog from "../adress/addAdress";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocationOn, Delete, Edit } from "@mui/icons-material";
import { 
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper
} from "@mui/material";
export default function ChauffeurDialog({ open, onClose,onSuccess }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cni: "",
    dateExpirationPermis: "",
    email: "",
    telephone: "",
    cnss: "",
    dateRecrutement:  new Date().toISOString().split("T")[0],
    disponibilite: false,
    adresses: [],
    photoPermisRecto: null,
    photoPermisVerso: null,
  });
  const [errors, setErrors] = useState({
    nom: false,
    prenom: false,
    cni: false,
    telephone: false,
    dateExpirationPermis: false,
  });

  const rectoInputRef = useRef(null);
  const versoInputRef = useRef(null);
  const [previewRecto, setPreviewRecto] = useState(null);
  const [previewVerso, setPreviewVerso] = useState(null);

  const validateForm = () => {
    const newErrors = {
      nom: formData.nom.trim() === "",
      prenom: formData.prenom.trim() === "",
      cni: formData.cni.trim() === "",
      telephone: formData.telephone.trim() === "",
      dateExpirationPermis: formData.dateExpirationPermis.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      const previewReader = new FileReader();
      previewReader.onload = (event) => {
        if (side === "photoPermisRecto") {
          setPreviewRecto(event.target.result);
        } else {
          setPreviewVerso(event.target.result);
        }
      };
      previewReader.readAsDataURL(file);

      const binaryReader = new FileReader();
      binaryReader.onloadend = () => {
        const arrayBuffer = binaryReader.result;
        setFormData((prev) => ({
          ...prev,
          [side]: arrayBuffer,
        }));
      };
      binaryReader.readAsArrayBuffer(file);
    }
  };

  const handleRemovePhoto = (side) => {
    setFormData((prev) => ({
      ...prev,
      [side]: null,
    }));
    if (side === "photoPermisRecto") {
      setPreviewRecto(null);
    } else {
      setPreviewVerso(null);
    }
  };

  const handleChangeDisponible = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value === "true",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleAddAdress = (newAdresse) => {
    setFormData((prevData) => ({
      ...prevData,
      adresses: [...prevData.adresses, newAdresse],
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const chauffeurData = {
        ...formData,
        photoPermisRecto: formData.photoPermisRecto
          ? Array.from(new Uint8Array(formData.photoPermisRecto))
          : null,
        photoPermisVerso: formData.photoPermisVerso
          ? Array.from(new Uint8Array(formData.photoPermisVerso))
          : null,
      };
      console.log(chauffeurData);
      await chauffeurService.create(chauffeurData);
      onClose();
      setFormData({
        nom: "",
        prenom: "",
        cni: "",
        email: "",
        telephone: "",
        cnss: "",
        dateExpirationPermis: "",
        dateRecrutement: "",
        disponibilite: false,
        adresses: [],
        photoPermisRecto: null,
        photoPermisVerso: null,
      });
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création du chauffeur:", error);
    }
  };

  const handleDeleteAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      adresses: prev.adresses.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Ajouter un Chauffeur</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nom *"
              name="nom"
              fullWidth
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              helperText={errors.nom ? "Ce champ est obligatoire" : ""}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Prénom *"
              name="prenom"
              fullWidth
              value={formData.prenom}
              onChange={handleChange}
              error={errors.prenom}
              helperText={errors.prenom ? "Ce champ est obligatoire" : ""}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CNI *"
              name="cni"
              fullWidth
              value={formData.cni}
              onChange={handleChange}
              error={errors.cni}
              helperText={errors.cni ? "Ce champ est obligatoire" : ""}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Téléphone *"
              name="telephone"
              fullWidth
              value={formData.telephone}
              onChange={handleChange}
              error={errors.telephone}
              helperText={errors.telephone ? "Ce champ est obligatoire" : ""}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CNSS"
              name="cnss"
              fullWidth
              value={formData.cnss}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date de Recrutement"
              name="dateRecrutement"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.dateRecrutement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date d'expiration du permis *"
              name="dateExpirationPermis"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.dateExpirationPermis}
              onChange={handleChange}
              error={errors.dateExpirationPermis}
              helperText={
                errors.dateExpirationPermis ? "Ce champ est obligatoire" : ""
              }
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Disponibilité</InputLabel>
              <Select
                label="Disponibilité"
                name="disponibilite"
                value={formData.disponibilite.toString()}
                onChange={handleChangeDisponible}
              >
                <MenuItem value="true">Disponible</MenuItem>
                <MenuItem value="false">Non disponible</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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
        </Grid>
       
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
        {/* <Button
          color="primary"
          onClick={() => setOpenAdress(true)}
          sx={{ mr: 2 }}
        >
          Ajouter une Adresse
        </Button> */}
      </DialogActions>

      <AdressDialog
        open={openAdress}
        onClose={() => setOpenAdress(false)}
        onAdd={handleAddAdress}
      />
    </Dialog>
  );
}
