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
        ) : (
          <>
            <Typography variant="body1">
              <strong>Libellé :</strong> {marchandise.libelle}
            </Typography>
            <Typography variant="body1">
              <strong>Description :</strong> {marchandise.description}
            </Typography>
            <Typography variant="body1">
              <strong>Code Marchandise :</strong> {marchandise.codeMarchandise}
            </Typography>
            <Typography variant="body1">
              <strong>Catégorie :</strong>{" "}
              {marchandise.categorie?.libelle || "Aucune"}
            </Typography>
          </>
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
