import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ViewAssuranceDialog({ open, onClose, assurance }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de l'Assurance</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>Numéro de Contrat :</strong> {assurance.numeroContrat}
        </Typography>
        <Typography variant="body1">
          <strong>Compagnie :</strong> {assurance.company}
        </Typography>
        <Typography variant="body1">
          <strong>Type de Couverture :</strong> {assurance.typeCouverture}
        </Typography>
        <Typography variant="body1">
          <strong>Montant :</strong> {assurance.montant}
        </Typography>
        <Typography variant="body1">
          <strong>Date de Début :</strong> {assurance.dateDebut}
        </Typography>
        <Typography variant="body1">
          <strong>Date d'Expiration :</strong> {assurance.dateExpiration}
        </Typography>
        <Typography variant="body1">
          <strong>Prime Annuelle :</strong> {assurance.primeAnnuelle}
        </Typography>
        <Typography variant="body1">
          <strong>Numéro Carte Verte :</strong> {assurance.numCarteVerte}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}