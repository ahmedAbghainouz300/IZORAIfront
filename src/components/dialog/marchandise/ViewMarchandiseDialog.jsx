import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import marchandiseService from "../../../service/marchandise/marchandiseService";

export default function ViewMarchandiseDialog({
  open,
  onClose,
  marchandiseId,
}) {
  const [marchandise, setMarchandise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && marchandiseId) {
      setLoading(true);
      marchandiseService
        .getById(marchandiseId)
        .then((res) => {
          setMarchandise(res.data);
        })
        .catch((err) => {
          console.error("Error fetching marchandise:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, marchandiseId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Détails de la Marchandise</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : marchandise ? (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>ID :</strong> {marchandise.id}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Libellé :</strong> {marchandise.libelle}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Description :</strong> {marchandise.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Code Marchandise :</strong> {marchandise.codeMarchandise}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Catégorie :</strong>{" "}
              {marchandise.categorie?.categorie || "Aucune"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Unité :</strong> {marchandise.unite?.unite || "Aucune"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Emballage :</strong>{" "}
              {marchandise.emballage?.nom || "Aucun"}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">Aucune donnée disponible</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
