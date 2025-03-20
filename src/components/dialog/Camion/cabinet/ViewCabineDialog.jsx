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

export default function ViewCabineDialog({ open, onClose, cabine }) {
  // Ensure cabine is defined and has default values to avoid runtime errors
  const {
    immatriculation = "",
    typeCamion = "",
    poidsMax = "",
    consommation = "",
  } = cabine || {};

  // Convert cabine data to Descriptions items format
  const items = [
    {
      label: "Immatriculation",
      children: immatriculation,
      span: 3,
    },
    {
      label: "Type de Cabine",
      children: typeCamion.type,
      span: 3,
    },
    {
      label: "Poids Max (kg)",
      children: poidsMax,
      span: 3,
    },
    {
      label: "Consommation (L/100km)",
      children: consommation,
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Cabine</DialogTitle>
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
