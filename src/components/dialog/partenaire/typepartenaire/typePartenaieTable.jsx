import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import typePartenaireService from "../../../../service/partenaire/typePartenaireService";

export default function TypePartenaireTable({ open, onClose, onSelectTypePartenaire }) {
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      typePartenaireService
        .getAllByNoms()
        .then((response) => {
          setTypes(response.data);
          setError(null); // Réinitialiser l'erreur en cas de succès
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des types:", error);
          setError("Impossible de charger les types partenaires.");
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner un Type Partenaire</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Libellé</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.idTypePartenaire}>
                  <TableCell>{type.libelle}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onSelectTypePartenaire(type); // Envoi de tout l'objet `type`
                        onClose();
                      }}
                      aria-label={`Sélectionner ${type.libelle}`}
                    >
                      Sélectionner
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
