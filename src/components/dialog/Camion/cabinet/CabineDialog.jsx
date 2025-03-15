import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import camionService from "../../../../service/camion/camionService";
import assuranceService from "../../../../service/camion/assuranceService";
import carteGriseService from "../../../../service/camion/carteGriseService"; // Import carteGriseService

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CabineDialog({ open, onClose }) {
  // Initialize states
  const [assuranceData, setAssuranceData] = React.useState([]); // Array of assurances
  const [carteGriseData, setCarteGriseData] = React.useState([]); // Array of carteGrise

  const [cabineData, setCabineData] = React.useState({
    immatriculation: "",
    typeCabine: "",
    poidsMax: "",
    consommation: "",
    assurance: "", // Initialize with a valid value
    carteGrise: "", // Initialize with a valid value
  });

  // Fetch data on component mount
  React.useEffect(() => {
    fetchAssurances();
    fetchCarteGrise();
  }, []);

  // Fetch assurances from the backend
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

  // Fetch carteGrise from the backend
  const fetchCarteGrise = async () => {
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCabineData({ ...cabineData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Prepare the data to match the backend's expected structure
    const payload = {
      immatriculation: cabineData.immatriculation,
      typeCabine: cabineData.typeCabine,
      poidsMax: Number(cabineData.poidsMax), // Convert to number
      consommation: Number(cabineData.consommation), // Convert to number
      assurance: cabineData.assurance, // This should already be an object
      carteGrise: cabineData.carteGrise, // This should already be an object
    };

    console.log("Payload:", payload);

    try {
      const response = await camionService.create(payload);
      console.log("Camion créé avec succès:", response.data);

      // Reset form data
      setCabineData({
        immatriculation: "",
        typeCabine: "",
        poidsMax: "",
        consommation: "",
        assurance: "",
        carteGrise: "",
      });

      onClose(); // Close the dialog
    } catch (error) {
      console.error("Erreur lors de la création de la cabine:", error);
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Ajout d'une cabine
          </Typography>

          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Immatriculation Field */}
        <TextField
          fullWidth
          label="Immatriculation"
          name="immatriculation"
          value={cabineData.immatriculation}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Type de Cabine Field */}
        <TextField
          fullWidth
          label="Type de Cabine"
          name="typeCabine"
          value={cabineData.typeCabine}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Poids Max Field */}
        <TextField
          fullWidth
          label="Poids Max"
          name="poidsMax"
          value={cabineData.poidsMax}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Consommation Field */}
        <TextField
          fullWidth
          label="Consommation"
          name="consommation"
          value={cabineData.consommation}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Assurance Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Assurance</InputLabel>
          <Select
            value={cabineData.assurance || ""} // Fallback to empty string if undefined
            onChange={(e) =>
              setCabineData({ ...cabineData, assurance: e.target.value })
            }
            label="Assurance"
          >
            {assuranceData.map((assurance) => (
              <MenuItem key={assurance.numeroContrat} value={assurance}>
                {`${assurance.company} | ${assurance.numeroContrat} | ${assurance.montant} | ${assurance.dateExpiration}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Carte Grise Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Carte Grise</InputLabel>
          <Select
            value={cabineData.carteGrise || ""} // Fallback to empty string if undefined
            onChange={(e) =>
              setCabineData({ ...cabineData, carteGrise: e.target.value })
            }
            label="Carte Grise"
          >
            {carteGriseData.map((carteGrise) => (
              <MenuItem key={carteGrise.id} value={carteGrise}>
                {`${carteGrise.marque} | ${carteGrise.genre} | ${carteGrise.numeroSerie} | ${carteGrise.dateMiseEnCirculation}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Dialog>
  );
}
