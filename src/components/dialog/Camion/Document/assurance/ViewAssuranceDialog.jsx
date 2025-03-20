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

export default function ViewAssuranceDialog({ open, onClose, assurance }) {
  // Ensure assurance is defined and has default values to avoid runtime errors
  const {
    numeroContrat = "",
    company = "",
    typeCouverture = "",
    montant = "",
    dateDebut = "",
    dateExpiration = "",
    primeAnnuelle = "",
    numCarteVerte = "",
  } = assurance || {};

  // Convert assurance data to Descriptions items format
  const items = [
    {
      label: "Numéro de Contrat",
      children: numeroContrat,
      span: 3,
    },
    {
      label: "Compagnie",
      children: company,
      span: 3,
    },
    {
      label: "Type de Couverture",
      children: typeCouverture,
      span: 3,
    },
    {
      label: "Montant",
      children: montant,
      span: 3,
    },
    {
      label: "Date de Début",
      children: dateDebut,
      span: 3,
    },
    {
      label: "Date d'Expiration",
      children: dateExpiration,
      span: 3,
    },
    {
      label: "Prime Annuelle",
      children: primeAnnuelle,
      span: 3,
    },
    {
      label: "Numéro Carte Verte",
      children: numCarteVerte,
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de l'Assurance</DialogTitle>
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
