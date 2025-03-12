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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CabineDialog({ vopen, onClose }) {
  const [openCarburant, setOpenCarburant] = React.useState(false);
  const [openAssurance, setOpenAssurance] = React.useState(false);
  const [openEntretien, setOpenEntretien] = React.useState(false);

  const [cabineData, setCabineData] = React.useState({
    immatriculation: "",
    typeCabine: "",
    poidsMax: "",
    consommation: "",
    carburant: "", // Add carburant field
    assurance: "", // Add assurance field
    entretien: "", // Add entretien field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCabineData({ ...cabineData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Cabine Data:", cabineData);
    onClose();
  };

  return (
    <Dialog
      fullScreen
      open={vopen}
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
        <TextField
          fullWidth
          label="Type de Cabine"
          name="typeCabine"
          value={cabineData.typeCabine}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Poids Max"
          name="poidsMax"
          value={cabineData.poidsMax}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Consommation"
          name="consommation"
          value={cabineData.consommation}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Carburant Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Carburant</InputLabel>
          <Select
            value={cabineData.carburant} // Link to cabineData.carburant
            onChange={(e) =>
              setCabineData({ ...cabineData, carburant: e.target.value })
            }
            label="Carburant"
          >
            <MenuItem value="Essence">Essence</MenuItem>
            <MenuItem value="Diesel">Diesel</MenuItem>
            <MenuItem value="Electrique">Electrique</MenuItem>
          </Select>
        </FormControl>

        {/* Assurance Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Assurance</InputLabel>
          <Select
            value={cabineData.assurance} // Link to cabineData.assurance
            onChange={(e) =>
              setCabineData({ ...cabineData, assurance: e.target.value })
            }
            label="Assurance"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Expirée">Expirée</MenuItem>
            <MenuItem value="En attente">En attente</MenuItem>
          </Select>
        </FormControl>

        {/* Entretien Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Entretien</InputLabel>
          <Select
            value={cabineData.entretien} // Link to cabineData.entretien
            onChange={(e) =>
              setCabineData({ ...cabineData, entretien: e.target.value })
            }
            label="Entretien"
          >
            <MenuItem value="A jour">A jour</MenuItem>
            <MenuItem value="En retard">En retard</MenuItem>
            <MenuItem value="Planifié">Planifié</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Dialog>
  );
}
