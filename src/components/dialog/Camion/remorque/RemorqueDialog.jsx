import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Button, TextField, Box, FormControl } from "@mui/material";
import TypeRemorqueSelect from "../../../select/TypeRemorqueSelect"; // Import the TypeRemorqueSelect component

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RemorqueDialog({ open, onClose, onCreate }) {
  const [remorqueData, setRemorqueData] = React.useState({
    idRemorque: 0,
    typeRemorque: null, // Change to an object
    volumeStockage: 0,
    poidsChargeMax: 0,
    poidsVide: 0,
    disponible: true,
  });

  const [isTypeRemorqueModalOpen, setIsTypeRemorqueModalOpen] =
    React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRemorqueData({ ...remorqueData, [name]: value });
  };

  // Handler for selecting a typeRemorque
  const handleSelectTypeRemorque = (typeRemorque) => {
    setRemorqueData({ ...remorqueData, typeRemorque });
    setIsTypeRemorqueModalOpen(false);
  };

  const handleSubmit = () => {
    const payload = {
      ...remorqueData,
    };
    onCreate(payload);
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
        {/* Replace the TextField for Type de Remorque with TypeRemorqueSelect */}
        <FormControl fullWidth margin="normal">
          <TextField
            value={
              remorqueData.typeRemorque
                ? remorqueData.typeRemorque.type // Assuming `typeRemorque` has a `type` property
                : ""
            }
            InputProps={{
              readOnly: true,
            }}
            onClick={() => setIsTypeRemorqueModalOpen(true)}
            fullWidth
            label="Type de Remorque"
          />
          <Button
            variant="outlined"
            onClick={() => setIsTypeRemorqueModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner un Type de Remorque
          </Button>
        </FormControl>

        <TextField
          fullWidth
          label="Volume de stockage"
          name="volumeStockage"
          value={remorqueData.volumeStockage}
          onChange={handleInputChange}
          margin="normal"
          type="number"
        />
        <TextField
          fullWidth
          label="Poids Max"
          name="poidsChargeMax"
          value={remorqueData.poidsChargeMax}
          onChange={handleInputChange}
          margin="normal"
          type="number"
        />
        <TextField
          fullWidth
          label="Poids Vide"
          name="poidsVide"
          value={remorqueData.poidsVide}
          onChange={handleInputChange}
          margin="normal"
          type="number"
        />
      </Box>

      {/* TypeRemorqueSelect Modal */}
      <TypeRemorqueSelect
        open={isTypeRemorqueModalOpen}
        onClose={() => setIsTypeRemorqueModalOpen(false)}
        onSelect={handleSelectTypeRemorque} // Pass the handler for selection
      />
    </Dialog>
  );
}
