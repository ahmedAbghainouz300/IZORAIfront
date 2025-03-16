import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import assuranceService from "../../../../service/camion/assuranceService";
import carteGriseService from "../../../../service/camion/carteGriseService";
import camionService from "../../../../service/camion/camionService";
import Success from "../../../results/success";

export default function EditCabineDialog({ open, onClose, cabine, onSave }) {
  const [formData, setFormData] = useState(cabine);
  const [assuranceData, setAssuranceData] = useState([]);
  const [carteGriseData, setCarteGriseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] = useState(false);
  const [assuranceFilter, setAssuranceFilter] = useState(""); // Filter for assurance table
  const [carteGriseFilter, setCarteGriseFilter] = useState(""); // Filter for carte grise table

  useEffect(() => {
    if (open) {
      setFormData(cabine);
      fetchData();
    }
  }, [open, cabine]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch assurances
      const assuranceResponse = await assuranceService.getAll();
      const assurances = Array.isArray(assuranceResponse.data)
        ? assuranceResponse.data
        : [assuranceResponse.data];
      setAssuranceData(assurances);

      // Fetch cartes grises
      const carteGriseResponse = await carteGriseService.getAll();
      const cartesGrises = Array.isArray(carteGriseResponse.data)
        ? carteGriseResponse.data
        : [carteGriseResponse.data];
      setCarteGriseData(cartesGrises);
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError(
        "Erreur lors de la récupération des données. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectAssurance = (assurance) => {
    setFormData({ ...formData, assurance });
    setIsAssuranceModalOpen(false); // Close the modal after selection
  };

  const handleSelectCarteGrise = (carteGrise) => {
    setFormData({ ...formData, carteGrise });
    setIsCarteGriseModalOpen(false); // Close the modal after selection
  };

  const handleSubmit = async () => {
    // Prepare the data to match the backend's expected structure
    const payload = {
      immatriculation: formData.immatriculation,
      typeCabine: formData.typeCabine,
      poidsMax: Number(formData.poidsMax), // Convert to number
      consommation: Number(formData.consommation), // Convert to number
      assurance: formData.assurance, // This should already be an object
      carteGrise: formData.carteGrise, // This should already be an object
    };
    setFormData({
      immatriculation: "",
      typeCabine: "",
      poidsMax: 0,
      consommation: 0,
      assurance: null,
      carteGrise: null,
    });
    onSave(payload);

    onClose();
  };

  // Filter assurances based on the input string
  const filteredAssurances = assuranceData.filter((assurance) => {
    const searchString = assuranceFilter.toLowerCase();

    // Convert numeroContrat to a string and then to lowercase
    const numeroContratString =
      assurance.numeroContrat !== null && assurance.numeroContrat !== undefined
        ? assurance.numeroContrat.toString().toLowerCase()
        : "";

    return (
      (assurance.company?.toLowerCase() || "").includes(searchString) ||
      numeroContratString.includes(searchString) ||
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
      (carteGrise.marque?.toLowerCase() || "").includes(searchString) ||
      (carteGrise.genre?.toLowerCase() || "").includes(searchString) ||
      (carteGrise.numeroSerie?.toLowerCase() || "").includes(searchString) ||
      (carteGrise.dateMiseEnCirculation?.toLowerCase() || "").includes(
        searchString
      )
    );
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Cabine</DialogTitle>
      <DialogContent>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Immatriculation Field */}
            <TextField
              name="immatriculation"
              label="Immatriculation"
              value={formData.immatriculation || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            {/* Type de Cabine Field */}
            <TextField
              name="typeCabine"
              label="Type de Cabine"
              value={formData.typeCabine || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            {/* Poids Max Field */}
            <TextField
              name="poidsMax"
              label="Poids Max (kg)"
              value={formData.poidsMax || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />

            {/* Consommation Field */}
            <TextField
              name="consommation"
              label="Consommation (L/100km)"
              value={formData.consommation || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />

            {/* Assurance Field */}
            <FormControl fullWidth margin="normal">
              <TextField
                value={
                  formData.assurance
                    ? `${formData.assurance.company} | ${formData.assurance.numeroContrat}`
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
              <TextField
                value={
                  formData.carteGrise
                    ? `${formData.carteGrise.marque} | ${formData.carteGrise.numeroSerie}`
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
                          <TableCell>
                            {carteGrise.dateMiseEnCirculation}
                          </TableCell>
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
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          Enregistrer
        </Button>
      </DialogActions>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
