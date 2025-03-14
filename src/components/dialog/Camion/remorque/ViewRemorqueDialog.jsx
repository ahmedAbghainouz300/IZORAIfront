import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ViewRemorqueDialog({ open, onClose, remorque }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Remorque</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>ID :</strong> {remorque.id}
        </Typography>
        <Typography variant="body1">
          <strong>Immatriculation :</strong> {remorque.immatriculation}
        </Typography>
        <Typography variant="body1">
          <strong>Type de Remorque :</strong> {remorque.typeRemorque}
        </Typography>
        <Typography variant="body1">
          <strong>Volume de Stockage (m³) :</strong> {remorque.volumesStockage}
        </Typography>
        <Typography variant="body1">
          <strong>Poids à Vide (kg) :</strong> {remorque.poidsVide}
        </Typography>
        <Typography variant="body1">
          <strong>Poids Charge Max (kg) :</strong> {remorque.poidsChargeMax}
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