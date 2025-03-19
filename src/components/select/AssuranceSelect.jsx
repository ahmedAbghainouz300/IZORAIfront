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
import assuranceService from "../../service/camion/assuranceService";

export default function AssuranceSelect({ open, onClose, onSelectAssurance }) {
  const [assuranceData, setAssuranceData] = useState([]);
  const [assuranceFilter, setAssuranceFilter] = useState("");

  useEffect(() => {
    fetchAssurances();
  }, []);

  const fetchAssurances = async () => {
    try {
      const response = await assuranceService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setAssuranceData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des assurances:", error);
    }
  };

  const filteredAssurances = assuranceData.filter((assurance) => {
    const searchString = assuranceFilter.toLowerCase();
    return (
      (assurance.company?.toLowerCase() || "").includes(searchString) ||
      assurance.numeroContrat.toString().toLowerCase().includes(searchString) ||
      (assurance.montant?.toString().toLowerCase() || "").includes(
        searchString
      ) ||
      (assurance.dateExpiration?.toLowerCase() || "").includes(searchString)
    );
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner une Assurance</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Rechercher"
          value={assuranceFilter}
          onChange={(e) => setAssuranceFilter(e.target.value)}
          margin="normal"
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Numéro de Contrat</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Date d'Expiration</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssurances.map((assurance) => (
                <TableRow key={assurance.numeroContrat}>
                  <TableCell>{assurance.company}</TableCell>
                  <TableCell>{assurance.numeroContrat}</TableCell>
                  <TableCell>{assurance.montant}</TableCell>
                  <TableCell>{assurance.dateExpiration}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelectAssurance(assurance)}
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
