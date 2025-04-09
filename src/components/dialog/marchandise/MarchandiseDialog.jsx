import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useSnackbar } from "notistack";
import marchandiseService from "../../../service/marchandise/marchandiseService";
import SelectDialogCategorie from "./categorie/SelectDialogCategorie";
import SelectDialogUnite from "./unite/SelectDialogUnite";
import SelectDialogEmballage from "./emballage/SelectDialogEmballage";

export default function MarchandiseDialog({
  open,
  onClose,
  marchandise,
  onSave,
}) {
  const [formData, setFormData] = useState({
    libelle: "",
    description: "",
    codeMarchandise: "",
    categorie: null,
    unite: null,
    emballage: null,
  });
  const [categorieDialogOpen, setCategorieDialogOpen] = useState(false);
  const [uniteDialogOpen, setUniteDialogOpen] = useState(false);
  const [emballageDialogOpen, setEmballageDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      if (marchandise) {
        setFormData({
          libelle: marchandise.libelle || "",
          description: marchandise.description || "",
          codeMarchandise: marchandise.codeMarchandise || "",
          categorie: marchandise.categorie || null,
          unite: marchandise.unite || null,
          emballage: marchandise.emballage || null,
        });
      } else {
        setFormData({
          libelle: "",
          description: "",
          codeMarchandise: "",
          categorie: null,
          unite: null,
          emballage: null,
        });
      }
    }
  }, [open, marchandise]);

  const handleSubmit = async () => {
    if (!formData.libelle.trim()) {
      enqueueSnackbar("Le libellé est obligatoire", { variant: "warning" });
      return;
    }

    if (!formData.categorie) {
      enqueueSnackbar("Veuillez sélectionner une catégorie", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const marchandiseData = {
        libelle: formData.libelle.trim(),
        description: formData.description.trim(),
        codeMarchandise: formData.codeMarchandise.trim(),
        categorie: { id: formData.categorie.id },
        unite: formData.unite ? { id: formData.unite.id } : null,
        emballage: formData.emballage ? { id: formData.emballage.id } : null,
      };

      if (marchandise) {
        await marchandiseService.update(marchandise.id, marchandiseData);
        enqueueSnackbar("Marchandise mise à jour avec succès", {
          variant: "success",
        });
      } else {
        console.log("Creating new marchandise:", marchandiseData);
        await marchandiseService.create(marchandiseData);
        enqueueSnackbar("Marchandise créée avec succès", {
          variant: "success",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving marchandise:", error);
      const errorMessage =
        error.response?.data?.message ||
        `Erreur lors de ${marchandise ? "la modification" : "la création"}`;
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {marchandise
            ? "Modifier la marchandise"
            : "Ajouter une nouvelle marchandise"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="libelle"
            label="Libellé *"
            fullWidth
            value={formData.libelle}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
            disabled={loading}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
          />
          <TextField
            name="codeMarchandise"
            label="Code Marchandise"
            fullWidth
            value={formData.codeMarchandise}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Catégorie *"
            fullWidth
            value={formData.categorie?.libelle || "N/A"}
            onClick={() => setCategorieDialogOpen(true)}
            InputProps={{ readOnly: true }}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            label="Unité"
            fullWidth
            value={formData.unite?.unite || ""}
            onClick={() => setUniteDialogOpen(true)}
            InputProps={{ readOnly: true }}
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Emballage"
            fullWidth
            value={formData.emballage?.nom || ""}
            onClick={() => setEmballageDialogOpen(true)}
            InputProps={{ readOnly: true }}
            margin="normal"
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "En cours..." : marchandise ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>

      <SelectDialogCategorie
        open={categorieDialogOpen}
        onClose={() => setCategorieDialogOpen(false)}
        onSelect={(categorie) => {
          setFormData((prev) => ({ ...prev, categorie }));
          setCategorieDialogOpen(false);
        }}
      />

      <SelectDialogUnite
        open={uniteDialogOpen}
        onClose={() => setUniteDialogOpen(false)}
        onSelect={(unite) => {
          setFormData((prev) => ({ ...prev, unite }));
          setUniteDialogOpen(false);
        }}
      />

      <SelectDialogEmballage
        open={emballageDialogOpen}
        onClose={() => setEmballageDialogOpen(false)}
        onSelect={(emballage) => {
          setFormData((prev) => ({ ...prev, emballage }));
          setEmballageDialogOpen(false);
        }}
      />
    </>
  );
}
