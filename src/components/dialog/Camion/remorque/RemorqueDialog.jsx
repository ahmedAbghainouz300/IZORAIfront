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

export default function RemorqueDialog({ open, onClose }) {
  const [remorqueData, setRemorqueData] = React.useState({
    typeRemorque: "",
    volumeStockage: "",
    poidsMax: "",
    poidsVide: "",
    consommation: "",
    carburant: "", // Add carburant field
    assurance: "", // Add assurance field
    entretien: "", // Add entretien field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRemorqueData({ ...remorqueData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Remorque Data:", remorqueData);
    onClose();
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
            Ajout d'une Remorque
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Type de Remorque"
          name="typeRemorque"
          value={remorqueData.typeRemorque}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Volume de stockage"
          name="volumeStockage"
          value={remorqueData.volumeStockage}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Poids Max"
          name="poidsMax"
          value={remorqueData.poidsMax}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Poids Vide"
          name="poidsVide"
          value={remorqueData.poidsVide}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Consommation"
          name="consommation"
          value={remorqueData.consommation}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Carburant Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Carburant</InputLabel>
          <Select
            value={remorqueData.carburant} // Link to remorqueData.carburant
            onChange={(e) =>
              setRemorqueData({ ...remorqueData, carburant: e.target.value })
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
            value={remorqueData.assurance} // Link to remorqueData.assurance
            onChange={(e) =>
              setRemorqueData({ ...remorqueData, assurance: e.target.value })
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
            value={remorqueData.entretien} // Link to remorqueData.entretien
            onChange={(e) =>
              setRemorqueData({ ...remorqueData, entretien: e.target.value })
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
