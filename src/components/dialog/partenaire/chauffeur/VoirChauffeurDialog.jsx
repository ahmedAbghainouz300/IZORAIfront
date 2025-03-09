import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

export default function VoirChauffeurDialog({ open, onClose, chauffeur }) {
  if (!chauffeur) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Détails du Chauffeur</DialogTitle>
      <DialogContent>
        <Typography variant="body1"><strong>Nom:</strong> {chauffeur.nom}</Typography>
        <Typography variant="body1"><strong>Prénom:</strong> {chauffeur.prenom}</Typography>
        <Typography variant="body1"><strong>CNI:</strong> {chauffeur.CNI}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {chauffeur.email}</Typography>
        <Typography variant="body1"><strong>Téléphone:</strong> {chauffeur.telephone}</Typography>
        <Typography variant="body1"><strong>CNSS:</strong> {chauffeur.cnss}</Typography>
        <Typography variant="body1"><strong>Date de Recrutement:</strong> {chauffeur.dateRecrutement}</Typography>
        <Typography variant="body1"><strong>Disponibilité:</strong> {chauffeur.disponibilite}</Typography>
        <Typography variant="body1"><strong>Adresse:</strong> {chauffeur.adresse}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
