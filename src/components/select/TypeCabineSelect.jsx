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
import typeCamionService from "../../service/camion/TypeCabineService"; // Ensure this service is correctly imported

export default function TypeCamionSelect({ open, onClose, onSelect }) {
  const [typeCamionData, setTypeCamionData] = useState([]);
  const [typeCamionFilter, setTypeCamionFilter] = useState("");
  const [editingTypeCamion, setEditingTypeCamion] = useState(null);
  const [newTypeCamion, setNewTypeCamion] = useState("");

  // Fetch typeCamion data when the modal opens
  useEffect(() => {
    if (open) {
      fetchTypeCamions();
    }
  }, [open]);

  // Fetch typeCamion data from the backend
  const fetchTypeCamions = async () => {
    try {
      const response = await typeCamionService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setTypeCamionData(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des types de camion:",
        error
      );
    }
  };

  // Handle adding a new typeCamion
  const handleAddTypeCamion = async () => {
    try {
      const response = await typeCamionService.create({
        type: newTypeCamion,
      });
      setTypeCamionData([...typeCamionData, response.data]);
      setNewTypeCamion("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de camion:", error);
    }
  };

  // Handle editing a typeCamion
  const handleEditTypeCamion = async () => {
    try {
      if (!editingTypeCamion?.id) {
        console.error("ID is undefined for editingTypeCamion");
        return;
      }

      const response = await typeCamionService.update(editingTypeCamion.id, {
        type: newTypeCamion,
      });
      setTypeCamionData(
        typeCamionData.map((item) =>
          item.id === editingTypeCamion.id ? response.data : item
        )
      );
      setEditingTypeCamion(null);
      setNewTypeCamion("");
    } catch (error) {
      console.error("Erreur lors de la modification du type de camion:", error);
    }
  };

  // Handle deleting a typeCamion
  const handleDeleteTypeCamion = async (id) => {
    try {
      await typeCamionService.delete(id);
      setTypeCamionData(typeCamionData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du type de camion:", error);
    }
  };

  // Filter typeCamion based on the input string
  const filteredTypeCamions = typeCamionData.filter((typeCamion) => {
    const searchString = typeCamionFilter.toLowerCase();
    return typeCamion.type?.toLowerCase().includes(searchString);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner un Type de Camion</DialogTitle>
      <DialogContent>
        {/* Filter Input for TypeCamion Table */}
        <TextField
          fullWidth
          label="Rechercher"
          value={typeCamionFilter}
          onChange={(e) => setTypeCamionFilter(e.target.value)}
          margin="normal"
        />

        {/* Add/Edit TypeCamion Form */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Nouveau Type de Camion"
            value={newTypeCamion}
            onChange={(e) => setNewTypeCamion(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={
              editingTypeCamion ? handleEditTypeCamion : handleAddTypeCamion
            }
          >
            {editingTypeCamion ? "Modifier" : "Ajouter"}
          </Button>
        </Box>

        {/* TypeCamion Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTypeCamions.map((typeCamion) => (
                <TableRow key={typeCamion.id}>
                  <TableCell>{typeCamion.type}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditingTypeCamion(typeCamion);
                        setNewTypeCamion(typeCamion.type);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTypeCamion(typeCamion.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(typeCamion)}
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
