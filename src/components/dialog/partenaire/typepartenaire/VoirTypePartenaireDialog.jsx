import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function VoirTypePartenaireDialog({ open, onClose, typePartenaire }) {
  if (!typePartenaire) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Détails du Type de Partenaire</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1"><strong>ID :</strong> {typePartenaire.idTypePartenaire}</Typography>
        <Typography variant="subtitle1"><strong>Libellé :</strong> {typePartenaire.libelle}</Typography>
        <Typography variant="subtitle1"><strong>Définition :</strong> {typePartenaire.definition}</Typography>
        <Typography variant="subtitle1"><strong>Genre :</strong> {typePartenaire.genre}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
