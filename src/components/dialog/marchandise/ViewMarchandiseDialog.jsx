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

export default function ViewMarchandiseDialog({ open, onClose, marchandise }) {
  const {
    libelle = "",
    description = "",
    codeMarchandise = "",
    categorie = { categorie: "" },
  } = marchandise || {};

  const items = [
    { label: "Libellé", children: libelle, span: 3 },
    {
      label: "Description",
      children: description ? description : "-",
      span: 3,
    },
    { label: "Code Marchandise", children: codeMarchandise, span: 3 },
    {
      label: "Catégorie",
      children: categorie.categorie ? categorie.categorie : "-",
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Marchandise</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Descriptions
            bordered
            column={{ xs: 1, sm: 2, md: 3 }}
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
