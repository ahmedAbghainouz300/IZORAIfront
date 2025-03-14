import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ViewCarburantDialog({ open, onClose, carburant }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails du Carburant</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>ID :</strong> {carburant.id}
        </Typography>
        <Typography variant="body1">
          <strong>Date de Remplissage :</strong> {carburant.dateRemplissage}
        </Typography>
        <Typography variant="body1">
          <strong>Quantité (L) :</strong> {carburant.quantity}
        </Typography>
        <Typography variant="body1">
          <strong>Prix par Litre (€) :</strong> {carburant.prixParLitre}
        </Typography>
        <Typography variant="body1">
          <strong>Kilométrage Actuel :</strong> {carburant.kilometrageActuel}
        </Typography>
        <Typography variant="body1">
          <strong>Type de Carburant :</strong> {carburant.typeCarburant}
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