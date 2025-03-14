import React, { useState,useEffect } from "react";
import { Dialog,  InputLabel,
  Select,
  MenuItem, FormControl , DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import moraleService from "../../../service/partenaire/moraleService";
import AdressDialog from "./AdressDialog";
import typePartenaireService from "../../../service/partenaire/typePartenaireService";





export default function MoraleDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);  
  const [nom, setNom] = useState("");
  const [ice, setIce] = useState("");
  const [numeroRC, setNumeroRC] = useState("");
  const [abreviation, setAbreviation] = useState("");
  const [formeJuridique, setFormeJuridique] = useState("");
  const [adresses, setAdresses] = useState([]); // État pour les adresses
  const [types,setTypes] = useState([]);


  const handleSubmit = () => {
    const newMorale = {
      nom,
      ice,
      numeroRC,
      abreviation,
      formeJuridique,
      adresses,
    };

    useEffect(() => {
      if (open) {
        typePartenaireService
          .getAllByNoms()
          .then((response) => setTypes(response.data))
          .catch((error) => console.error("Erreur lors du chargement des types:", error));
      }
    }, [open]);


    const handleAddAdress = (newAdresse) => {
      setAdresses((prevAdresses) => [...prevAdresses, newAdresse]); // Ajouter la nouvelle adresse
      setOpenAdress(false); // Fermer le dialogue d'ajout d'adresse
    };
  

     moraleService.add(newMorale)
       .then((response) => {
         console.log("Partenaire moral ajouté:", response);
         setNom("");
         setIce("");
         setNumeroRC("");
         setAbreviation("");
         setFormeJuridique("");
         setAdresses([]);
         onClose();
       })
       .catch((error) => {
         console.error("Erreur lors de l'ajout du partenaire moral:", error);
       });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Partenaire Moral</DialogTitle>
      <DialogContent>
        <TextField
          label="Nom"
          fullWidth
          margin="normal"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <TextField
          label="ICE"
          fullWidth
          margin="normal"
          value={ice}
          onChange={(e) => setIce(e.target.value)}
        />
        <TextField
          label="Numéro RC"
          fullWidth
          margin="normal"
          value={numeroRC}
          onChange={(e) => setNumeroRC(e.target.value)}
        />
        <TextField
          label="Abreviation"
          fullWidth
          margin="normal"
          value={abreviation}
          onChange={(e) => setAbreviation(e.target.value)}
        />
        <TextField
          label="Forme Juridique"
          fullWidth
          margin="normal"
          value={formeJuridique}
          onChange={(e) => setFormeJuridique(e.target.value)}
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


        {/* Section pour afficher les adresses */}
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
        <Button  onClick={() => setOpenAdress(true)}>
          Ajouter une Adresse
        </Button>
      </DialogActions>
      <AdressDialog open={openAdress} onClose={() => setOpenAdress(false)} />
    </Dialog>
  );
}
