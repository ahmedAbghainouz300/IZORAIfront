import * as React from "react";
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
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import camionService from "../../../../../service/camion/camionService";
import TypeCarburantSelect from "../../../../select/TypeCarburantSelect"; // Import the TypeCarburantSelect component

export default function CarburantDialog({ open, onClose, onCreate }) {
  // State for the Carburant form fields
  const [carburantData, setCarburantData] = React.useState({
    dateRemplissage: null, // Date of refill
    quantity: "", // Quantity in liters
    prixParLitre: "", // Price per liter
    kilometrageActuel: "", // Current mileage
    typeCarburant: null, // Selected type of fuel
    camion: null, // Selected truck
  });

  // State for Camion selection
  const [camionFilter, setCamionFilter] = React.useState("");
  const [camionData, setCamionData] = React.useState([]);
  const [isCamionModalOpen, setIsCamionModalOpen] = React.useState(false);

  // State for TypeCarburant selection
  const [isTypeCarburantModalOpen, setIsTypeCarburantModalOpen] =
    React.useState(false);

  // Fetch camions on component mount
  React.useEffect(() => {
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

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarburantData({ ...carburantData, [name]: value });
  };

  // Handle date changes for the DatePicker
  const handleDateChange = (name) => (newValue) => {
    setCarburantData({ ...carburantData, [name]: newValue });
  };

  // Handle camion selection
  const handleSelectCamion = (camion) => {
    setCarburantData({ ...carburantData, camion });
    setIsCamionModalOpen(false);
  };

  // Handle typeCarburant selection
  const handleSelectTypeCarburant = (typeCarburant) => {
    setCarburantData({ ...carburantData, typeCarburant });
    setIsTypeCarburantModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    const payload = {
      ...carburantData,
    };
    onCreate(payload);
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
        <DialogTitle>Ajouter Carburant</DialogTitle>
        <DialogContent>
          {/* Date Picker for Date of Refill */}
          <DatePicker
            label="Date de Remplissage"
            value={carburantData.dateRemplissage}
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
            value={carburantData.quantity}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />

          {/* Price per Liter Input */}
          <TextField
            fullWidth
            label="Prix par Litre"
            name="prixParLitre"
            value={carburantData.prixParLitre}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />

          {/* Current Mileage Input */}
          <TextField
            fullWidth
            label="Kilométrage Actuel"
            name="kilometrageActuel"
            value={carburantData.kilometrageActuel}
            onChange={handleInputChange}
            margin="normal"
            type="number"
          />

          {/* TypeCarburant Selection Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              value={
                carburantData.typeCarburant
                  ? carburantData.typeCarburant.type
                  : ""
              }
              InputProps={{
                readOnly: true,
              }}
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
                carburantData.camion
                  ? `Immatriculation : ${carburantData.camion.immatriculation} | Marque : ${carburantData.camion.typeCabine}`
                  : ""
              }
              InputProps={{
                readOnly: true,
              }}
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
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
