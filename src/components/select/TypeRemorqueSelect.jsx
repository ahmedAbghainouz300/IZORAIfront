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
import typeRemorqueService from "../../service/camion/TypeRemorqueService"; // Ensure this service is correctly imported

export default function TypeRemorqueSelect({ open, onClose, onSelect }) {
  const [typeRemorqueData, setTypeRemorqueData] = useState([]);
  const [typeRemorqueFilter, setTypeRemorqueFilter] = useState("");
  const [editingTypeRemorque, setEditingTypeRemorque] = useState(null);
  const [newTypeRemorque, setNewTypeRemorque] = useState("");

  // Fetch typeRemorque data when the modal opens
  useEffect(() => {
    if (open) {
      fetchTypeRemorques();
    }
  }, [open]);

  // Fetch typeRemorque data from the backend
  const fetchTypeRemorques = async () => {
    try {
      const response = await typeRemorqueService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setTypeRemorqueData(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des types de remorque:",
        error
      );
    }
  };

  // Handle adding a new typeRemorque
  const handleAddTypeRemorque = async () => {
    try {
      const response = await typeRemorqueService.create({
        type: newTypeRemorque,
      });
      setTypeRemorqueData([...typeRemorqueData, response.data]);
      setNewTypeRemorque("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de remorque:", error);
    }
  };

  // Handle editing a typeRemorque
  const handleEditTypeRemorque = async () => {
    try {
      if (!editingTypeRemorque?.id) {
        console.error("ID is undefined for editingTypeRemorque");
        return;
      }

      const response = await typeRemorqueService.update(
        editingTypeRemorque.id,
        {
          type: newTypeRemorque,
        }
      );
      setTypeRemorqueData(
        typeRemorqueData.map((item) =>
          item.id === editingTypeRemorque.id ? response.data : item
        )
      );
      setEditingTypeRemorque(null);
      setNewTypeRemorque("");
    } catch (error) {
      console.error(
        "Erreur lors de la modification du type de remorque:",
        error
      );
    }
  };

  // Handle deleting a typeRemorque
  const handleDeleteTypeRemorque = async (id) => {
    try {
      await typeRemorqueService.delete(id);
      setTypeRemorqueData(typeRemorqueData.filter((item) => item.id !== id));
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du type de remorque:",
        error
      );
    }
  };

  // Filter typeRemorque based on the input string
  const filteredTypeRemorques = typeRemorqueData.filter((typeRemorque) => {
    const searchString = typeRemorqueFilter.toLowerCase();
    return typeRemorque.type?.toLowerCase().includes(searchString);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sélectionner un Type de Remorque</DialogTitle>
      <DialogContent>
        {/* Filter Input for TypeRemorque Table */}
        <TextField
          fullWidth
          label="Rechercher"
          value={typeRemorqueFilter}
          onChange={(e) => setTypeRemorqueFilter(e.target.value)}
          margin="normal"
        />

        {/* Add/Edit TypeRemorque Form */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Nouveau Type de Remorque"
            value={newTypeRemorque}
            onChange={(e) => setNewTypeRemorque(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={
              editingTypeRemorque
                ? handleEditTypeRemorque
                : handleAddTypeRemorque
            }
          >
            {editingTypeRemorque ? "Modifier" : "Ajouter"}
          </Button>
        </Box>

        {/* TypeRemorque Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTypeRemorques.map((typeRemorque) => (
                <TableRow key={typeRemorque.id}>
                  <TableCell>{typeRemorque.type}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setEditingTypeRemorque(typeRemorque);
                        setNewTypeRemorque(typeRemorque.type);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTypeRemorque(typeRemorque.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(typeRemorque)}
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
