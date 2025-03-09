import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import moraleService from "../../../service/partenaire/moraleService";
import AdressDialog from "./AdressDialog";





export default function MoraleDialog({ open, onClose }) {
  const [openAdress, setOpenAdress] = useState(false);  
  const [nom, setNom] = useState("");
  const [ice, setIce] = useState("");
  const [numeroRC, setNumeroRC] = useState("");
  const [abreviation, setAbreviation] = useState("");
  const [formeJuridique, setFormeJuridique] = useState("");

  const handleSubmit = () => {
    const newMorale = {
      nom,
      ice,
      numeroRC,
      abreviation,
      formeJuridique,
    };

    // moraleService.add(newMorale)
    //   .then((response) => {
    //     console.log("Partenaire moral ajouté:", response);
    //     onClose();
    //   })
    //   .catch((error) => {
    //     console.error("Erreur lors de l'ajout du partenaire moral:", error);
    //   });
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
