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
import { Button, TextField, Box, FormControl } from "@mui/material";
import AssuranceSelect from "../../../select/AssuranceSelect";
import CarteGriseSelect from "../../../select/CarteGriseSelect";
import TypeCabineSelect from "../../../select/TypeCabineSelect"; // Import the TypeCabineSelect component

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CabineDialog({ open, onClose, onSave }) {
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = React.useState(false);
  const [isCarteGriseModalOpen, setIsCarteGriseModalOpen] =
    React.useState(false);
  const [isTypeCabineModalOpen, setIsTypeCabineModalOpen] =
    React.useState(false); // State for TypeCabine modal

  const [cabineData, setCabineData] = React.useState({
    immatriculation: "",
    typeCabine: null, // Use typeCabine instead of typeCamion
    poidsMax: "",
    consommation: "",
    assurance: null,
    carteGrise: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCabineData({ ...cabineData, [name]: value });
  };

  const handleSelectAssurance = (assurance) => {
    setCabineData({ ...cabineData, assurance });
    setIsAssuranceModalOpen(false);
  };

  const handleSelectCarteGrise = (carteGrise) => {
    setCabineData({ ...cabineData, carteGrise });
    setIsCarteGriseModalOpen(false);
  };

  // Handler for selecting a TypeCabine
  const handleSelectTypeCabine = (typeCabine) => {
    setCabineData({ ...cabineData, typeCabine }); // Update typeCabine field
    setIsTypeCabineModalOpen(false); // Close the modal
  };

  const handleSubmit = async () => {
    const payload = {
      immatriculation: cabineData.immatriculation,
      typeCabine: cabineData.typeCabine, // Use typeCabine
      poidsMax: Number(cabineData.poidsMax),
      consommation: Number(cabineData.consommation),
      assurance: cabineData.assurance,
      carteGrise: cabineData.carteGrise,
    };

    setCabineData({
      immatriculation: "",
      typeCabine: null, // Reset to null
      poidsMax: "",
      consommation: "",
      assurance: null,
      carteGrise: null,
    });
    onSave(payload);
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
        <TextField
          fullWidth
          label="Immatriculation"
          name="immatriculation"
          value={cabineData.immatriculation}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Replace the TextField for Type de Cabine with TypeCabineSelect */}
        <FormControl fullWidth margin="normal">
          <TextField
            value={
              cabineData.typeCabine
                ? cabineData.typeCabine.type // Assuming `typeCabine` has a `type` property
                : ""
            }
            InputProps={{
              readOnly: true,
            }}
            onClick={() => setIsTypeCabineModalOpen(true)}
            fullWidth
            label="Type de Cabine"
          />
          <Button
            variant="outlined"
            onClick={() => setIsTypeCabineModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner un Type de Cabine
          </Button>
        </FormControl>

        <TextField
          fullWidth
          label="Poids Max"
          name="poidsMax"
          value={cabineData.poidsMax}
          onChange={handleInputChange}
          margin="normal"
          type="number"
        />

        <TextField
          fullWidth
          label="Consommation"
          name="consommation"
          value={cabineData.consommation}
          onChange={handleInputChange}
          margin="normal"
          type="number"
        />

        <FormControl fullWidth margin="normal">
          <TextField
            value={
              cabineData.assurance
                ? `${cabineData.assurance.company} | ${cabineData.assurance.numeroContrat}`
                : ""
            }
            InputProps={{
              readOnly: true,
            }}
            onClick={() => setIsAssuranceModalOpen(true)}
            fullWidth
            label="Assurance"
          />
          <Button
            variant="outlined"
            onClick={() => setIsAssuranceModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner une Assurance
          </Button>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            value={
              cabineData.carteGrise
                ? `${cabineData.carteGrise.marque} | ${cabineData.carteGrise.numeroSerie}`
                : ""
            }
            InputProps={{
              readOnly: true,
            }}
            onClick={() => setIsCarteGriseModalOpen(true)}
            fullWidth
            label="Carte Grise"
          />
          <Button
            variant="outlined"
            onClick={() => setIsCarteGriseModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner une Carte Grise
          </Button>
        </FormControl>

        {/* Modals for Select Components */}
        <AssuranceSelect
          open={isAssuranceModalOpen}
          onClose={() => setIsAssuranceModalOpen(false)}
          onSelectAssurance={handleSelectAssurance}
        />

        <CarteGriseSelect
          open={isCarteGriseModalOpen}
          onClose={() => setIsCarteGriseModalOpen(false)}
          onSelectCarteGrise={handleSelectCarteGrise}
        />

        {/* TypeCabineSelect Modal */}
        <TypeCabineSelect
          open={isTypeCabineModalOpen}
          onClose={() => setIsTypeCabineModalOpen(false)}
          onSelect={handleSelectTypeCabine} // Pass the handler for selection
        />
      </Box>
    </Dialog>
  );
}
