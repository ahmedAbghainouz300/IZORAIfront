import React, { useState,useRef } from "react";
import {
  InputLabel,Select,MenuItem,Dialog,
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
import chauffeurService from "../../../../service/partenaire/chaufeurService"; // Assurez-vous que le chemin est correct
import AdressDialog from "../AdressDialog";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ChauffeurDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    CNI: "",
    dateExpirationPermis: "",
    email: "",
    telephone: "",
    cnss: "",
    dateRecrutement: "",
    disponibilite: false, // Valeur par défaut
    adresses: [], // Tableau pour stocker les adresses
    photoPermisRecto: null,
    photoPermisVerso: null,
  });
  const rectoInputRef = useRef(null);
  const versoInputRef = useRef(null);
  const [previewRecto, setPreviewRecto] = useState(null);
  const [previewVerso, setPreviewVerso] = useState(null);

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      // Créer un aperçu pour l'affichage
      const previewReader = new FileReader();
      previewReader.onload = (event) => {
        if (side === 'photoPermisRecto') {
          setPreviewRecto(event.target.result);
        } else {
          setPreviewVerso(event.target.result);
        }
      };
      previewReader.readAsDataURL(file);
  
      // Stocker les données binaires pour l'envoi au backend
      const binaryReader = new FileReader();
      binaryReader.onloadend = () => {
        const arrayBuffer = binaryReader.result;
        setFormData(prev => ({
          ...prev,
          [side]: arrayBuffer,
        }));
      };
      binaryReader.readAsArrayBuffer(file);
    }
  };

  const handleRemovePhoto = (side) => {
    setFormData(prev => ({
      ...prev,
      [side]: null,
    }));
    if (side === 'photoPermisRecto') {
      setPreviewRecto(null);
    } else {
      setPreviewVerso(null);
    }
  };
 

  const handleChangeDisponible = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value === "true", // Convertir la chaîne en booléen
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddAdress = (newAdresse) => {
    setFormData((prevData) => ({
      ...prevData,
      adresses: [...prevData.adresses, newAdresse], // Ajouter la nouvelle adresse
    }));
  };

  // const handleSubmit = () => {
  //   // Créer un nouveau chauffeur
  //   console.log("Chauffeur Data:", formData);
  //   chauffeurService
  //     .create(formData)
  //     .then(() => {
  //       onClose(); // Fermer le dialogue après la création
  //       setFormData({
  //         // Réinitialiser le formulaire
  //         nom: "",
  //         prenom: "",
  //         CNI: "",
  //         email: "",
  //         telephone: "",
  //         cnss: "",
  //         dateExpirationPermis: "",
  //         dateRecrutement: "",
  //         disponibilite: "",
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de la création du chauffeur:", error);
  //     });
  // };
  const handleSubmit = async () => {
    try {
      // Convertir les ArrayBuffer en Uint8Array pour le backend
      const chauffeurData = {
        ...formData,
        photoPermisRecto: formData.photoPermisRecto 
          ? Array.from(new Uint8Array(formData.photoPermisRecto))
          : null,
        photoPermisVerso: formData.photoPermisVerso 
          ? Array.from(new Uint8Array(formData.photoPermisVerso))
          : null,
      };

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
    } catch (error) {
      console.error("Erreur lors de la création du chauffeur:", error);
    }
  };  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Chauffeur</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nom"
              name="nom"
              fullWidth
              value={formData.nom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Prénom"
              name="prenom"
              fullWidth
              value={formData.prenom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CNI"
              name="CNI"
              fullWidth
              value={formData.CNI}
              onChange={handleChange}
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
              label="Téléphone"
              name="telephone"
              fullWidth
              value={formData.telephone}
              onChange={handleChange}
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
              label="dateExpirationPermis"
              name="dateExpirationPermis"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.dateExpirationPermis}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Disponibilité</InputLabel>
              <Select
                label="Disponibilité"
                name="disponibilite"
                value={formData.disponibilite.toString()} // Convertir le booléen en chaîne
                onChange={handleChangeDisponible}
              >
                <MenuItem value="true">Disponible</MenuItem>
                <MenuItem value="false">Non disponible</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Section pour les photos de permis */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Photos du Permis
            </Typography>
          </Grid>

          {/* Photo Recto */}
          <Grid item xs={6}>
            <Box sx={{ border: '1px dashed grey', p: 2, textAlign: 'center' }}>
              {previewRecto ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src={previewRecto} 
                    alt="Recto du permis"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '150px',
                      marginBottom: '10px'
                    }}
                  />
                  <IconButton onClick={() => handleRemovePhoto('photoPermisRecto')}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    Ajouter Recto
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      ref={rectoInputRef}
                      onChange={(e) => handleFileChange(e, 'photoPermisRecto')}
                    />
                  </Button>
                  <Typography variant="caption" display="block">
                    Format: JPEG, PNG (Max 5MB)
                  </Typography>
                </>
              )}
            </Box>
          </Grid>

          {/* Photo Verso */}
          <Grid item xs={6}>
            <Box sx={{ border: '1px dashed grey', p: 2, textAlign: 'center' }}>
              {previewVerso ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src={previewVerso} 
                    alt="Verso du permis"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '150px',
                      marginBottom: '10px'
                    }}
                  />
                  <IconButton onClick={() => handleRemovePhoto('photoPermisVerso')}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box> ) : (
                <>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                >
                  Ajouter Verso
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={versoInputRef}
                    onChange={(e) => handleFileChange(e, 'photoPermisVerso')}
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

        {/* Section pour afficher les adresses */}
        <div style={{ marginTop: "20px" }}>
          <h4>Adresses</h4>
          {formData.adresses.map((adresse, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Adresse {index + 1}:</strong> {adresse.rue},{" "}
                {adresse.ville}, {adresse.codePostal}, {adresse.pays}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
        <Button
          color="primary"
          onClick={() => setOpenAdress(true)}
          sx={{ mr: 2 }}
        >
          Ajouter une Adresse
        </Button>
      </DialogActions>

      <AdressDialog
        open={openAdress}
        onClose={() => setOpenAdress(false)}
        onSave={handleAddAdress}
      />
    </Dialog>
  );
}
