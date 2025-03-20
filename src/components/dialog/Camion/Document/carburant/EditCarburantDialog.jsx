import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import camionService from "../../../../../service/camion/camionService";
import TypeCarburantSelect from "../../../../select/TypeCarburantSelect"; // Import the reusable component

export default function EditCarburantDialog({
  open,
  onClose,
  carburant,
  onSave,
}) {
  const [formData, setFormData] = useState(carburant);

  const [camionFilter, setCamionFilter] = useState("");
  const [camionData, setCamionData] = useState([]);
  const [isCamionModalOpen, setIsCamionModalOpen] = useState(false);

  const [isTypeCarburantModalOpen, setIsTypeCarburantModalOpen] =
    useState(false);

  // Fetch camions on component mount
  useEffect(() => {
    fetchCamions();
  }, []);

  // Fetch camions from the backend
  const fetchCamions = async () => {
    try {
      const response = await camionService.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setCamionData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des camions:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle date changes
  const handleDateChange = (name) => (newValue) => {
    setFormData({ ...formData, [name]: newValue });
  };

  // Handle camion selection
  const handleSelectCamion = (camion) => {
    console.log(camion);
    setFormData({ ...formData, camion });
    setIsCamionModalOpen(false);
  };

  // Handle typeCarburant selection
  const handleSelectTypeCarburant = (typeCarburant) => {
    setFormData({ ...formData, typeCarburant });
    setIsTypeCarburantModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  // Filter camions based on the input string
  const filteredCamions = camionData.filter((camion) => {
    const searchString = camionFilter.toLowerCase();
    return (
      camion.immatriculation?.toLowerCase().includes(searchString) ||
      camion.typeCabine?.toLowerCase().includes(searchString) ||
      String(camion.kilometrageActuel)?.toLowerCase().includes(searchString)
    );
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Modifier le Carburant</DialogTitle>
        <DialogContent>
          {/* Date Picker for Date of Refill */}
          <DatePicker
            label="Date de Remplissage"
            value={formData.dateRemplissage}
            onChange={handleDateChange("dateRemplissage")}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          {/* Quantity Input */}
          <TextField
            fullWidth
            label="Quantité (Litres)"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            margin="normal"
            type="number"
          />

          {/* Price per Liter Input */}
          <TextField
            fullWidth
            label="Prix par Litre"
            name="prixParLitre"
            value={formData.prixParLitre}
            onChange={handleChange}
            margin="normal"
            type="number"
          />

          {/* Current Mileage Input */}
          <TextField
            fullWidth
            label="Kilométrage Actuel"
            name="kilometrageActuel"
            value={formData.kilometrageActuel}
            onChange={handleChange}
            margin="normal"
            type="number"
          />

          {/* TypeCarburant Selection Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              value={formData.typeCarburant ? formData.typeCarburant.type : ""}
              InputProps={{ readOnly: true }}
              label="Type de Carburant"
              onClick={() => setIsTypeCarburantModalOpen(true)}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => setIsTypeCarburantModalOpen(true)}
              style={{ marginTop: "8px" }}
            >
              Sélectionner un Type de Carburant
            </Button>
          </FormControl>

          {/* TypeCarburant Selection Modal */}
          <TypeCarburantSelect
            open={isTypeCarburantModalOpen}
            onClose={() => setIsTypeCarburantModalOpen(false)}
            onSelect={handleSelectTypeCarburant}
          />

          {/* Camion Selection Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              value={
                formData.camion
                  ? `Immatriculation : ${formData.camion.immatriculation} | type cabine : ${formData.camion.typeCamion.type}`
                  : ""
              }
              InputProps={{ readOnly: true }}
              label="Camion"
              onClick={() => setIsCamionModalOpen(true)}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => setIsCamionModalOpen(true)}
              style={{ marginTop: "8px" }}
            >
              Sélectionner un Camion
            </Button>
          </FormControl>

          {/* Camion Selection Modal */}
          <Dialog
            open={isCamionModalOpen}
            onClose={() => setIsCamionModalOpen(false)}
            maxWidth="md"
            fullWidth
          >
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
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Immatriculation</TableCell>
                      <TableCell>Marque</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Poids Max</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCamions.map((camion) => (
                      <TableRow key={camion.immatriculation}>
                        <TableCell>{camion.immatriculation}</TableCell>
                        <TableCell>{camion.typeCabine}</TableCell>
                        <TableCell>{camion.poidsMax}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSelectCamion(camion)}
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
              <Button onClick={() => setIsCamionModalOpen(false)}>
                Fermer
              </Button>
            </DialogActions>
          </Dialog>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
