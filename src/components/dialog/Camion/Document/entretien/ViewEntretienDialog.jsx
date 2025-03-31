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
import camionService from "../../../../../service/camion/camionService";

export default function ViewEntretienDialog({ open, onClose, entretien }) {
  // Ensure entretien is defined and has default values to avoid runtime errors
  const {
    id = "",
    dateEntretien = "",
    typeEntretien = "",
    description = "",
    cout = "",
    dateProchainEntretien = "",
    camion = "",
  } = entretien || {};

  // Convert entretien data to Descriptions items format
  const items = [
    {
      label: "ID",
      children: id,
      span: 3,
    },
    {
      label: "Date d'Entretien",
      children: dateEntretien,
      span: 3,
    },
    {
      label: "Type d'Entretien",
      children: typeEntretien,
      span: 3,
    },
    {
      label: "Description",
      children: description,
      span: 3,
    },
    {
      label: "Coût (€)",
      children: cout,
      span: 3,
    },
    {
      label: "Date Prochain Entretien",
      children: dateProchainEntretien,
      span: 3,
    },
    {
      label: "Immatriculation Camion",
      children: camion?.immatriculation,
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de l'Entretien</DialogTitle>
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
