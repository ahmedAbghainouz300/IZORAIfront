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
import typeCarburantService from "../../service/camion/TypeCarburantService";

export default function TypeCarburantSelect({ open, onClose, onSelect }) {
  const [typeCarburantData, setTypeCarburantData] = useState([]);
  const [typeCarburantFilter, setTypeCarburantFilter] = useState("");
  const [editingTypeCarburant, setEditingTypeCarburant] = useState(null);
  const [newTypeCarburant, setNewTypeCarburant] = useState("");

  // Fetch typeCarburant data when the modal opens
  useEffect(() => {
    if (open) {
      fetchTypeCarburants();
    }
  }, [open]);

  // Fetch typeCarburant data from the backend
  const fetchTypeCarburants = async () => {
    try {
      const response = await typeCarburantService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setTypeCarburantData(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des types de carburant:",
        error
      );
    }
  };

  // Handle adding a new typeCarburant
  const handleAddTypeCarburant = async () => {
    try {
      const response = await typeCarburantService.create({
        type: newTypeCarburant,
      });
      setTypeCarburantData([...typeCarburantData, response.data]);
      setNewTypeCarburant("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de carburant:", error);
    }
  };

  // Handle editing a typeCarburant
  const handleEditTypeCarburant = async () => {
    try {
      if (!editingTypeCarburant?.id) {
        console.error("ID is undefined for editingTypeCarburant");
        return;
      }

      const response = await typeCarburantService.update(
        editingTypeCarburant.id,
        {
          type: newTypeCarburant,
        }
      );
      setTypeCarburantData(
        typeCarburantData.map((item) =>
          item.id === editingTypeCarburant.id ? response.data : item
        )
      );
      setEditingTypeCarburant(null);
      setNewTypeCarburant("");
    } catch (error) {
      console.error(
        "Erreur lors de la modification du type de carburant:",
        error
      );
    }
  };

  // Handle deleting a typeCarburant
  const handleDeleteTypeCarburant = async (id) => {
    try {
      await typeCarburantService.delete(id);
      setTypeCarburantData(typeCarburantData.filter((item) => item.id !== id));
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du type de carburant:",
        error
      );
    }
  };

  // Filter typeCarburant based on the input string
  const filteredTypeCarburants = typeCarburantData.filter((typeCarburant) => {
    const searchString = typeCarburantFilter.toLowerCase();
    return typeCarburant.type?.toLowerCase().includes(searchString);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner un Type de Carburant</DialogTitle>
      <DialogContent>
        {/* Filter Input for TypeCarburant Table */}
        <TextField
          fullWidth
          label="Rechercher"
          value={typeCarburantFilter}
          onChange={(e) => setTypeCarburantFilter(e.target.value)}
          margin="normal"
        />

        {/* Add/Edit TypeCarburant Form */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Nouveau Type de Carburant"
            value={newTypeCarburant}
            onChange={(e) => setNewTypeCarburant(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={
              editingTypeCarburant
                ? handleEditTypeCarburant
                : handleAddTypeCarburant
            }
          >
            {editingTypeCarburant ? "Modifier" : "Ajouter"}
          </Button>
        </Box>

        {/* TypeCarburant Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTypeCarburants.map((typeCarburant) => (
                <TableRow key={typeCarburant.id}>
                  <TableCell>{typeCarburant.type}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditingTypeCarburant(typeCarburant);
                        setNewTypeCarburant(typeCarburant.type);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDeleteTypeCarburant(typeCarburant.id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(typeCarburant)}
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
