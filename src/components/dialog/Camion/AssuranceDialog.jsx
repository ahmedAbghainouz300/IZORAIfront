import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function AssuranceDialog({ open, onClose }) {
  const [assuranceData, setAssuranceData] = React.useState({
    dateDebut: "",
    dateFin: "",
    compagnie: "",
    montant: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssuranceData({ ...assuranceData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Assurance Data:", assuranceData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter Assurance</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Numero de contrat"
          name="numContrat"
          value={assuranceData.numContrat}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Company"
          name="company"
          value={assuranceData.company}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Type de couverture"
          name="numCouverture"
          value={assuranceData.numCouverture}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Montant"
          name="montant"
          value={assuranceData.montant}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date de Début "
          name="dateDebut"
          value={assuranceData.dateDebut}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date d\'expiration"
          name="dateExpiration"
          value={assuranceData.dateExpiration}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Prime annuelle"
          name="primeAnnuelle"
          value={assuranceData.primeAnnuelle}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="numero de la carte verte"
          name="numCarteVerte"
          value={assuranceData.numCarteVerte}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="statut de la carte verte"
          name="statutCarteVerte"
          value={assuranceData.statutCarteVerte}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Montant"
          name="montant"
          value={assuranceData.montant}
          onChange={handleInputChange}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}
