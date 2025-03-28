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
import CategorieSelect from "../../../components/select/marchandise/CategorieSelect";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MarchandiseDialog({ open, onClose, onCreate }) {
  const [isCategorieModalOpen, setIsCategorieModalOpen] = React.useState(false);
  const [marchandiseData, setMarchandiseData] = React.useState({
    libelle: "",
    description: "",
    codeMarchandise: "",
    categorie: null,
  });
  const [validationErrors, setValidationErrors] = React.useState({
    libelle: false,
    codeMarchandise: false,
  });

  const validateForm = () => {
    const errors = {
      libelle: !marchandiseData.libelle.trim(),
      codeMarchandise: !marchandiseData.codeMarchandise.trim(),
    };
    setValidationErrors(errors);
    return !errors.libelle && !errors.codeMarchandise;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarchandiseData({ ...marchandiseData, [name]: value });
    // Clear validation error when user starts typing
    if (validationErrors[name] && value.trim()) {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const handleSelectCategorie = (categorie) => {
    setMarchandiseData({ ...marchandiseData, categorie });
    setIsCategorieModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      libelle: marchandiseData.libelle,
      description: marchandiseData.description,
      codeMarchandise: marchandiseData.codeMarchandise,
      categorie: marchandiseData.categorie,
    };

    setMarchandiseData({
      libelle: "",
      description: "",
      codeMarchandise: "",
      categorie: null,
    });
    onCreate(payload);
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
            Ajout d'une Marchandise
          </Typography>
          <Button
            autoFocus
            color="inherit"
            onClick={handleSubmit}
            disabled={
              !marchandiseData.libelle.trim() ||
              !marchandiseData.codeMarchandise.trim()
            }
          >
            Enregistrer
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Libellé*"
          name="libelle"
          value={marchandiseData.libelle}
          onChange={handleInputChange}
          margin="normal"
          error={validationErrors.libelle}
          helperText={
            validationErrors.libelle ? "Ce champ est obligatoire" : ""
          }
          required
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={marchandiseData.description}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={4}
        />

        <TextField
          fullWidth
          label="Code Marchandise*"
          name="codeMarchandise"
          value={marchandiseData.codeMarchandise}
          onChange={handleInputChange}
          margin="normal"
          error={validationErrors.codeMarchandise}
          helperText={
            validationErrors.codeMarchandise ? "Ce champ est obligatoire" : ""
          }
          required
        />

        <FormControl fullWidth margin="normal">
          <TextField
            value={marchandiseData.categorie?.categorie || ""}
            InputProps={{ readOnly: true }}
            onClick={() => setIsCategorieModalOpen(true)}
            fullWidth
            label="Catégorie"
          />
          <Button
            variant="outlined"
            onClick={() => setIsCategorieModalOpen(true)}
            style={{ marginTop: "8px" }}
          >
            Sélectionner une Catégorie
          </Button>
        </FormControl>

        <CategorieSelect
          open={isCategorieModalOpen}
          onClose={() => setIsCategorieModalOpen(false)}
          onSelectCategorie={handleSelectCategorie}
        />
      </Box>
    </Dialog>
  );
}
