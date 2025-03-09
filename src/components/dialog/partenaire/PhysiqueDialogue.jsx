import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Button, TextField, Box,FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import AdressDialog from "./AdressDialog";
import axios from "axios"; // Pour envoyer les données au backend
import TypePartenaireDialog from "./typepartenaire/TypePartenaireDialog"
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const types = [
    { id: 1, nom: "Partenaire A" },
    { id: 2, nom: "Partenaire B" },
    { id: 3, nom: "Partenaire C" },
  ];

export default function PhysiqueDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [openTypePartenaire, setOpenTypePartenaire] = useState(false);
  const [selectedType, setSelectedType] = useState(null);  // Stocker le type sélectionné


  const [physiqueData, setPhysiqueData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    CNI: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhysiqueData({ ...physiqueData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/physiques", physiqueData); // Remplace avec ton endpoint
      console.log("Physique ajouté :", physiqueData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du partenaire physique :", error);
    }
  };

   const handleSelectType = (typeId) => {
    setSelectedType(typeId);  // Mettre à jour le type sélectionné
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Ajout d'un Partenaire Physique
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Nom"
          name="nom"
          value={physiqueData.nom}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Prénom"
          name="prenom"
          value={physiqueData.prenom}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={physiqueData.email}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Téléphone"
          name="telephone"
          value={physiqueData.telephone}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="CNI"
          name="CNI"
          value={physiqueData.CNI}
          onChange={handleInputChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type Partenaire</InputLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            label="Type Partenaire"
          >
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        


        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => setOpenAdress(true)} sx={{ mr: 2 }}>
            Ajouter une Adresse
          </Button>
         
        </Box>
        
      </Box>

      {/* Sous-dialog pour l'adresse */}
      <AdressDialog open={openAdress} onClose={() => setOpenAdress(false)} />

    </Dialog>
  );
}
