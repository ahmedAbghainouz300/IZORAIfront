import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ViewCarteGriseDialog({ open, onClose, carteGrise }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Carte Grise</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>Marque :</strong> {carteGrise.marque}
        </Typography>
        <Typography variant="body1">
          <strong>Genre :</strong> {carteGrise.genre}
        </Typography>
        <Typography variant="body1">
          <strong>Numéro de Série :</strong> {carteGrise.numeroSerie}
        </Typography>
        <Typography variant="body1">
          <strong>Couleur :</strong> {carteGrise.couleur}
        </Typography>
        <Typography variant="body1">
          <strong>Nombre de Places :</strong> {carteGrise.nombrePlace}
        </Typography>
        <Typography variant="body1">
          <strong>Puissance Fiscale :</strong> {carteGrise.puissanceFiscale}
        </Typography>
        <Typography variant="body1">
          <strong>Énergie :</strong> {carteGrise.energie}
        </Typography>
        <Typography variant="body1">
          <strong>Propriétaire :</strong> {carteGrise.proprietaire}
        </Typography>
        <Typography variant="body1">
          <strong>Poids à Vide (kg) :</strong> {carteGrise.poidsVide}
        </Typography>
        <Typography variant="body1">
          <strong>Poids Autorisé (kg) :</strong> {carteGrise.poidsAutorise}
        </Typography>
        <Typography variant="body1">
          <strong>Date de Mise en Circulation :</strong>{" "}
          {carteGrise.dateMiseEnCirculation}
        </Typography>
        <Typography variant="body1">
          <strong>Date de Délivrance :</strong> {carteGrise.dateDelivrance}
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
