import React, { useState,useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AdressDialog from "./AdressDialog";
import physiqueService from "../../../service/partenaire/physiqueService";
import typePartenaireService from "../../../service/partenaire/typePartenaireService";


export default function PhysiqueDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [cni, setCni] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [adresses, setAdresses] = useState([]); 
  const [types,setTypes] = useState([]);

  // Function to handle adding a new adress
  const handleAddAdress = (newAdresse) => {
    setAdresses((prevAdresses) => [...prevAdresses, newAdresse]); // Add the new adress to the list
    setOpenAdress(false); // Close the adress dialog
  };

    // Fetch types when the dialog opens
    useEffect(() => {
      if (open) {
        typePartenaireService
          .getAllByNoms()
          .then((response) => setTypes(response.data))
          .catch((error) => console.error("Erreur lors du chargement des types:", error));
      }
    }, [open]);

  // Function to handle form submission
  const handleSubmit = async () => {
    const newPhysique = {
      nom,
      prenom,
      email,
      telephone,
      cni,
      typePartenaire: selectedType,
      adresses, 
    };

    physiqueService
      .create(newPhysique)
      .then(() => {
        onClose(); // Close the dialog
        // Reset all fields
        setNom("");
        setPrenom("");
        setEmail("");
        setTelephone("");
        setCni("");
        setSelectedType("");
        setAdresses([]); // Reset adresses
      })
      .catch((error) => {
        console.error("Erreur lors de la création du partenaire physique:", error);
      });

      
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Partenaire Physique</DialogTitle>
      <DialogContent>
        <TextField
          label="Nom"
          fullWidth
          margin="normal"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <TextField
          label="Prénom"
          fullWidth
          margin="normal"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Téléphone"
          fullWidth
          margin="normal"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <TextField
          label="CNI"
          fullWidth
          margin="normal"
          value={cni}
          onChange={(e) => setCni(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Type Partenaire</InputLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.length === 0 ? (
              <MenuItem disabled>Aucun type disponible</MenuItem>
            ) : (
              types.map((type) => (
                <MenuItem key={type.id} value={type.nom}>
                  {type.nom}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        {/* Section to display adresses */}
        <div style={{ marginTop: "20px" }}>
          <h4>Adresses</h4>
          {adresses.map((adresse, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Adresse {index + 1}:</strong> {adresse.rue}, {adresse.ville}, {adresse.codePostal}, {adresse.pays}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
        <Button onClick={() => setOpenAdress(true)}>Ajouter une Adresse</Button>
      </DialogActions>

      {/* AdressDialog for adding new adresses */}
      <AdressDialog
        open={openAdress}
        onClose={() => setOpenAdress(false)}
        onSave={handleAddAdress} // Pass the function to handle saving adresses
      />
    </Dialog>
  );
}