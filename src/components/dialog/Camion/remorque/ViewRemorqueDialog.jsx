import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { Descriptions } from "antd";

export default function ViewRemorqueDialog({ open, onClose, remorque }) {
  // Ensure remorque is defined and has default values to avoid runtime errors
  const {
    idRemorque = "",
    immatriculation = "",
    typeRemorque = "",
    volumeStockage = "",
    poidsVide = "",
    poidsChargeMax = "",
  } = remorque || {};

  // Convert remorque data to Descriptions items format
  const items = [
    {
      label: "Type de Remorque",
      children: typeRemorque.type,
      span: 3,
    },
    {
      label: "Volume de Stockage (m³)",
      children: volumeStockage + " m³",
      span: 3,
    },
    {
      label: "Poids à Vide (kg)",
      children: poidsVide + " Kgs",
      span: 3,
    },
    {
      label: "Poids Charge Max (kg)",
      children: poidsChargeMax + " Kgs",
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Remorque</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Descriptions
            bordered
            column={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            items={items}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
