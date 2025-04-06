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
import stationService from "../../service/camion/stationService";

export default function StationSelect({ open, onClose, onSelect }) {
  const [stationData, setStationData] = useState([]);
  const [stationFilter, setStationFilter] = useState("");
  const [editingStation, setEditingStation] = useState(null);
  const [newStation, setNewStation] = useState("");

  // Fetch stations when the modal opens
  useEffect(() => {
    if (open) {
      fetchStations();
    }
  }, [open]);

  const fetchStations = async () => {
    try {
      const response = await stationService.getAll();
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setStationData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des stations:", error);
    }
  };

  const handleAddStation = async () => {
    try {
      const response = await stationService.create({ name: newStation });
      setStationData([...stationData, response.data]);
      setNewStation("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la station:", error);
    }
  };

  const handleEditStation = async () => {
    try {
      if (!editingStation?.id) return;

      const response = await stationService.update(editingStation.id, {
        name: newStation,
      });

      setStationData(
        stationData.map((item) =>
          item.id === editingStation.id ? response.data : item
        )
      );
      setEditingStation(null);
      setNewStation("");
    } catch (error) {
      console.error("Erreur lors de la modification de la station:", error);
    }
  };

  const handleDeleteStation = async (id) => {
    try {
      await stationService.delete(id);
      setStationData(stationData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la station:", error);
    }
  };

  const filteredStations = stationData.filter((station) =>
    station.name?.toLowerCase().includes(stationFilter.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner une Station</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Rechercher"
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
          margin="normal"
        />

        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Nom de la Station"
            value={newStation}
            onChange={(e) => setNewStation(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={editingStation ? handleEditStation : handleAddStation}
          >
            {editingStation ? "Modifier" : "Ajouter"}
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell>{station.name}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditingStation(station);
                        setNewStation(station.name);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteStation(station.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(station)}
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
