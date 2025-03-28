import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CategorieSelect from "../../../components/select/marchandise/CategorieSelect";

export default function EditMarchandiseDialog({
  open,
  onClose,
  marchandise,
  onSave,
}) {
  const [formData, setFormData] = useState(marchandise);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(marchandise);
    }
  }, [open, marchandise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectCategorie = (categorie) => {
    setFormData({ ...formData, categorie });
    setIsCategorieModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la Marchandise</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              name="libelle"
              label="Libellé"
              value={formData.libelle || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />

            <TextField
              name="codeMarchandise"
              label="Code Marchandise"
              value={formData.codeMarchandise || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <TextField
                value={formData.categorie?.categorie || ""}
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
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          Enregistrer
        </Button>
      </DialogActions>

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
