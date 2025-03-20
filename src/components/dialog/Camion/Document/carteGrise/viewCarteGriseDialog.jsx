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

export default function ViewCarteGriseDialog({ open, onClose, carteGrise }) {
  // Ensure carteGrise is defined and has default values to avoid runtime errors
  const {
    marque = "",
    genre = "",
    numeroSerie = "",
    couleur = "",
    nombrePlace = "",
    puissanceFiscale = "",
    energie = "",
    proprietaire = "",
    poidsVide = "",
    poidsAutorise = "",
    dateMiseEnCirculation = "",
    dateDelivrance = "",
  } = carteGrise || {};

  // Convert carteGrise data to Descriptions items format
  const items = [
    {
      label: "Marque",
      children: marque,
      span: 3,
    },
    {
      label: "Genre",
      children: genre,
      span: 3,
    },
    {
      label: "Numéro de Série",
      children: numeroSerie,
      span: 3,
    },
    {
      label: "Couleur",
      children: couleur,
      span: 3,
    },
    {
      label: "Nombre de Places",
      children: nombrePlace,
      span: 3,
    },
    {
      label: "Puissance Fiscale",
      children: puissanceFiscale,
      span: 3,
    },
    {
      label: "Énergie",
      children: energie,
      span: 3,
    },
    {
      label: "Propriétaire",
      children: proprietaire,
      span: 3,
    },
    {
      label: "Poids à Vide (kg)",
      children: poidsVide,
      span: 3,
    },
    {
      label: "Poids Autorisé (kg)",
      children: poidsAutorise,
      span: 3,
    },
    {
      label: "Date de Mise en Circulation",
      children: dateMiseEnCirculation,
      span: 3,
    },
    {
      label: "Date de Délivrance",
      children: dateDelivrance,
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Carte Grise</DialogTitle>
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
