import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ViewEntretienDialog({ open, onClose, entretien }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de l'Entretien</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>ID :</strong> {entretien.id}
        </Typography>
        <Typography variant="body1">
          <strong>Date d'Entretien :</strong> {entretien.dateEntretien}
        </Typography>
        <Typography variant="body1">
          <strong>Type d'Entretien :</strong> {entretien.typeEntretien}
        </Typography>
        <Typography variant="body1">
          <strong>Description :</strong> {entretien.description}
        </Typography>
        <Typography variant="body1">
          <strong>Coût (€) :</strong> {entretien.cout}
        </Typography>
        <Typography variant="body1">
          <strong>Date Prochain Entretien :</strong> {entretien.dateProchainEntretien}
        </Typography>
        <Typography variant="body1">
          <strong>Immatriculation Camion :</strong> {entretien.imatriculationCamion}
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