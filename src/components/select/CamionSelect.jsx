import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import camionService from "../../service/camion/camionService";

export default function CamionSelect({ open, onClose, onSelect }) {
  const [camionData, setCamionData] = useState([]);
  const [camionFilter, setCamionFilter] = useState("");
  const [newCamion, setNewCamion] = useState("");

  // Fetch camion data when the modal opens
  useEffect(() => {
    if (open) {
      fetchCamions();
    }
  }, [open]);

  // Fetch camion data from the backend
  const fetchCamions = async () => {
    try {
      const response = await camionService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setCamionData(data);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des camions:", error);
    }
  };

  // Filter camion based on the input string
  const filteredCamions = camionData.filter((camion) => {
    const searchString = camionFilter.toLowerCase();
    return String(camion.poidsMax)?.toLowerCase().includes(searchString);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner un Camion</DialogTitle>
      <DialogContent>
        {/* Filter Input for Camion Table */}
        <TextField
          fullWidth
          label="Rechercher"
          value={camionFilter}
          onChange={(e) => setCamionFilter(e.target.value)}
          margin="normal"
        />

        {/* Add/Edit Camion Form */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Nouveau Camion"
            value={newCamion.immatriculation}
            onChange={(e) => setNewCamion(e.target.value)}
          />
        </Box>

        {/* Camion Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Poids maximum</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCamions.map((camion) => (
                <TableRow key={camion.immatriculation}>
                  <TableCell>{camion.poidsMax}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(camion)}
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
