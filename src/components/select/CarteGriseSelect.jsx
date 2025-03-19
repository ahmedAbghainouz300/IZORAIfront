import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import carteGriseService from "../../service/camion/carteGriseService";

export default function CarteGriseSelect({
  open,
  onClose,
  onSelectCarteGrise,
}) {
  const [carteGriseData, setCarteGriseData] = useState([]);
  const [carteGriseFilter, setCarteGriseFilter] = useState("");

  useEffect(() => {
    fetchCartesGrises();
  }, []);

  const fetchCartesGrises = async () => {
    try {
      const response = await carteGriseService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setCarteGriseData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes grises:", error);
    }
  };

  const filteredCartesGrises = carteGriseData.filter((carte) => {
    const searchString = carteGriseFilter.toLowerCase();
    return (
      (carte.marque?.toLowerCase() || "").includes(searchString) ||
      (carte.genre?.toLowerCase() || "").includes(searchString) ||
      carte.numeroSerie?.toString().toLowerCase().includes(searchString)
    );
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner une Carte Grise</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Rechercher"
          value={carteGriseFilter}
          onChange={(e) => setCarteGriseFilter(e.target.value)}
          margin="normal"
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Marque</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Numéro de Série</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCartesGrises.map((carte) => (
                <TableRow key={carte.id}>
                  <TableCell>{carte.marque}</TableCell>
                  <TableCell>{carte.genre}</TableCell>
                  <TableCell>{carte.numeroSerie}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelectCarteGrise(carte)}
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
