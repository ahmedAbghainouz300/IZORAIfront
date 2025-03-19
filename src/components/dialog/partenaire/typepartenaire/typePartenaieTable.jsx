
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
} from "@mui/material";
import typePartenaireService from "../../../../service/partenaire/typePartenaireService";

export default function TypePartenaireTable({ open, onClose, onSelectIdTypePartenaire }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (open) {
      typePartenaireService
        .getAllByNoms()
        .then((response) => setTypes(response.data))
        .catch((error) => console.error("Erreur lors du chargement des types:", error));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner un Type Partenaire</DialogTitle>
      <DialogContent>
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
                        onSelectIdTypePartenaire(type.idTypePartenaire);
                        onClose();
                      }}
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