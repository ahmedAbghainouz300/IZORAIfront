import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ViewCabineDialog({ open, onClose, cabine }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Cabine</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>Immatriculation :</strong> {cabine.immatriculation}
        </Typography>
        <Typography variant="body1">
          <strong>Type de Cabine :</strong> {cabine.typeCabine}
        </Typography>
        <Typography variant="body1">
          <strong>Poids Max (kg) :</strong> {cabine.poidsMax}
        </Typography>
        <Typography variant="body1">
          <strong>Consommation (L/100km) :</strong> {cabine.consommation}
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
