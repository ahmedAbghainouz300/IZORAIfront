import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AdressDialog from "./AdressDialog";
import axios from "axios"; 

const types = [
  { id: 1, nom: "Partenaire A" },
  { id: 2, nom: "Partenaire B" },
  { id: 3, nom: "Partenaire C" },
];

export default function PhysiqueDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [cni, setCni] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSubmit = async () => {
    const newPhysique = { nom, prenom, email, telephone, CNI: cni, typePartenaire: selectedType };

    try {
      await axios.post("http://localhost:8080/api/physiques", newPhysique);
      console.log("Partenaire physique ajouté :", newPhysique);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du partenaire physique :", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Partenaire Physique</DialogTitle>
      <DialogContent>
        <TextField label="Nom" fullWidth margin="normal" value={nom} onChange={(e) => setNom(e.target.value)} />
        <TextField label="Prénom" fullWidth margin="normal" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Téléphone" fullWidth margin="normal" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        <TextField label="CNI" fullWidth margin="normal" value={cni} onChange={(e) => setCni(e.target.value)} />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Type Partenaire</InputLabel>
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Ajouter</Button>
        <Button  onClick={() => setOpenAdress(true)}>
          Ajouter une Adresse
        </Button>
      </DialogActions>

      <AdressDialog open={openAdress} onClose={() => setOpenAdress(false)} />
    </Dialog>
  );
}
