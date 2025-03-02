import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Button, TextField, Box } from "@mui/material";
import CarburantDialog from "./CarburantDialog";
import AssuranceDialog from "./AssuranceDialog";
import EntretienDialog from "./EntretienDialog";
import KilometrageDialog from "./KilometrageDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CabineDialog({ vopen, onClose }) {
  const [openCarburant, setOpenCarburant] = React.useState(false);
  const [openAssurance, setOpenAssurance] = React.useState(false);
  const [openEntretien, setOpenEntretien] = React.useState(false);
  const [openKilometrage, setOpenKilometrage] = React.useState(false);

  const [cabineData, setCabineData] = React.useState({
    typeCabine: "",
    poidsMax: "",
    consommation: "",
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

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => setOpenCarburant(true)}
            sx={{ mr: 2 }}
          >
            Carburant
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenAssurance(true)}
            sx={{ mr: 2 }}
          >
            Assurance
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenEntretien(true)}
            sx={{ mr: 2 }}
          >
            Entretien
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenKilometrage(true)}
            sx={{ mr: 2 }}
          >
            Kilométrage
          </Button>
        </Box>
      </Box>

      {/* Sub-dialogs */}
      <CarburantDialog
        open={openCarburant}
        onClose={() => setOpenCarburant(false)}
      />
      <AssuranceDialog
        open={openAssurance}
        onClose={() => setOpenAssurance(false)}
      />
      <EntretienDialog
        open={openEntretien}
        onClose={() => setOpenEntretien(false)}
      />
      <KilometrageDialog
        open={openKilometrage}
        onClose={() => setOpenKilometrage(false)}
      />
    </Dialog>
  );
}
