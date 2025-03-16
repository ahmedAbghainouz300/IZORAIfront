import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import camionService from "../../../../service/camion/camionService";
import assuranceService from "../../../../service/camion/assuranceService";
import carteGriseService from "../../../../service/camion/carteGriseService";
import Success from "../../../results/success";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CabineDialog({ open, onClose, onSave }) {
  // Initialize states
  const [assuranceData, setAssuranceData] = React.useState([]); // Array of assurances
  const [carteGriseData, setCarteGriseData] = React.useState([]); // Array of carteGrise
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = React.useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] =
    React.useState(false);
  const [assuranceFilter, setAssuranceFilter] = React.useState(""); // Filter for assurance table
  const [carteGriseFilter, setCarteGriseFilter] = React.useState(""); // Filter for carte grise table

  const [cabineData, setCabineData] = React.useState({
    immatriculation: "",
    typeCabine: "",
    poidsMax: "",
    consommation: "",
    assurance: null, // Initialize with null
    carteGrise: null, // Initialize with null
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

  // Handle assurance selection
  const handleSelectAssurance = (assurance) => {
    setCabineData({ ...cabineData, assurance });
    setIsAssuranceModalOpen(false); // Close the modal after selection
  };

  // Handle carte grise selection
  const handleSelectCarteGrise = (carteGrise) => {
    setCabineData({ ...cabineData, carteGrise });
    setIsCarteGriseModalOpen(false); // Close the modal after selection
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

    setCabineData({
      immatriculation: "",
      typeCabine: "",
      poidsMax: "",
      consommation: "",
      assurance: null,
      carteGrise: null,
    });
    onSave(payload);
  };

  // Filter assurances based on the input string
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

  // Filter cartes grises based on the input string
  const filteredCarteGrises = carteGriseData.filter((carteGrise) => {
    const searchString = carteGriseFilter.toLowerCase();
    return (
      carteGrise.marque?.toLowerCase().includes(searchString) ||
      carteGrise.genre?.toLowerCase().includes(searchString) ||
      carteGrise.numeroSerie?.toLowerCase().includes(searchString) ||
      carteGrise.dateMiseEnCirculation?.toLowerCase().includes(searchString)
    );
  });

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
          type="number"
        />

        {/* Consommation Field */}
        <TextField
          fullWidth
          label="Consommation"
          name="consommation"
          value={cabineData.consommation}
          onChange={handleInputChange}
          margin="normal"
          type="number"
        />

        {/* Assurance Field */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Assurance</InputLabel>
          <TextField
            value={
              cabineData.assurance
                ? `${cabineData.assurance.company} | ${cabineData.assurance.numeroContrat}`
                : ""
            }
            InputProps={{
              readOnly: true, // Make the field read-only
            }}
            onClick={() => setIsAssuranceModalOpen(true)} // Open the modal on click
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={() => setIsAssuranceModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner une Assurance
          </Button>
        </FormControl>

        {/* Assurance Selection Modal */}
        <Dialog
          open={isAssuranceModalOpen}
          onClose={() => setIsAssuranceModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Sélectionner une Assurance</DialogTitle>
          <DialogContent>
            {/* Filter Input for Assurance Table */}
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
                          onClick={() => handleSelectAssurance(assurance)}
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
            <Button onClick={() => setIsAssuranceModalOpen(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Carte Grise Field */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Carte Grise</InputLabel>
          <TextField
            value={
              cabineData.carteGrise
                ? `${cabineData.carteGrise.marque} | ${cabineData.carteGrise.numeroSerie}`
                : ""
            }
            InputProps={{
              readOnly: true, // Make the field read-only
            }}
            onClick={() => setIsCarteGriseModalOpen(true)} // Open the modal on click
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={() => setIsCarteGriseModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner une Carte Grise
          </Button>
        </FormControl>

        {/* Carte Grise Selection Modal */}
        <Dialog
          open={isCarteGriseModalOpen}
          onClose={() => setIsCarteGriseModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Sélectionner une Carte Grise</DialogTitle>
          <DialogContent>
            {/* Filter Input for Carte Grise Table */}
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
                    <TableCell>Date de Mise en Circulation</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCarteGrises.map((carteGrise) => (
                    <TableRow key={carteGrise.id}>
                      <TableCell>{carteGrise.marque}</TableCell>
                      <TableCell>{carteGrise.genre}</TableCell>
                      <TableCell>{carteGrise.numeroSerie}</TableCell>
                      <TableCell>{carteGrise.dateMiseEnCirculation}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSelectCarteGrise(carteGrise)}
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
            <Button onClick={() => setIsCarteGriseModalOpen(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Dialog>
  );
}
