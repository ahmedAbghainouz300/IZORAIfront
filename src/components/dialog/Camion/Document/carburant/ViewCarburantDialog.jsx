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

const ViewCarburantDialog = ({ open, onClose, carburant }) => {
  // Ensure carburant is defined and has default values to avoid runtime errors
  const {
    id = "",
    dateRemplissage = "",
    quantity = "",
    prixParLitre = "",
    kilometrageActuel = "",
    typeCarburant = null,
    camion = null,
  } = carburant || {};

  // Convert carburant data to Descriptions items format
  const items = [
    {
      label: "Date de Remplissage",
      children: dateRemplissage,
      span: 3,
    },
    {
      label: "Quantité (L)",
      children: quantity,
      span: 3,
    },
    {
      label: "Prix par Litre (€)",
      children: prixParLitre,
      span: 3,
    },
    {
      label: "Kilométrage Actuel",
      children: kilometrageActuel,
      span: 3,
    },
    {
      label: "Type de Carburant",
      children: typeCarburant ? typeCarburant.type : "N/A",
      span: 3,
    },
    {
      label: "Type de camion",
      children:
        camion != null && camion.typeCamion != null
          ? camion.typeCamion.type
          : "N/A",
      span: 3,
    },
    {
      label: "immatriculation",
      children: camion && camion.typeCamion ? camion.immatriculation : "N/A",
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Détails du Carburant</DialogTitle>
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
};

export default ViewCarburantDialog;
