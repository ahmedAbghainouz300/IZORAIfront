import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
  Box,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { LocationOn, Edit, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import AddAddress from "../partenaire/adress/addAdress";
import camionService from "../../../service/camion/camionService";
import remorqueService from "../../../service/camion/remorqueService";
import marchandiseService from "../../../service/marchandise/marchandiseService";
import chaufeurService from "../../../service/partenaire/chaufeurService";
import voyageService from "../../../service/voyage/voyageService";
import contientService from "../../../service/contient/contientService";
import adressService from "../../../service/partenaire/adressService";

export default function VoyageDialog({ open, onClose, onSave }) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    dateDepart: "",
    dateArrivePrevue: "",
    dateArriveReelle: "",
    lieuDepart: "",
    lieuArrive: null,
    distance: 0,
    etat: "PLANIFIE",
    estUrgent: false,
    estFragile: false,
    chaufeur: null,
    camion: null,
    remorque: null,
    listMarchandises: [],
  });

  const [chauffeurs, setChauffeurs] = useState([]);
  const [camions, setCamions] = useState([]);
  const [remorques, setRemorques] = useState([]);
  const [marchandises, setMarchandises] = useState([]);
  const [openAddress, setOpenAddress] = useState(false);
  const [currentAddressType, setCurrentAddressType] = useState(null);
  const [selectedMarchandise, setSelectedMarchandise] = useState(null);
  const [qteMarchandise, setQteMarchandise] = useState("");

  useEffect(() => {
    if (open) {
      const fetchResources = async () => {
        try {
          const [chauffeursRes, camionsRes, remorquesRes, marchandisesRes] =
            await Promise.all([
              chaufeurService.getAll(),
              camionService.getAll(),
              remorqueService.getAll(),
              marchandiseService.getAll(),
            ]);
          setChauffeurs(chauffeursRes.data);
          setCamions(camionsRes.data);
          setRemorques(remorquesRes.data);
          setMarchandises(marchandisesRes.data);
        } catch (error) {
          enqueueSnackbar("Erreur lors du chargement des ressources", {
            variant: "error",
          });
          console.error("Error fetching resources:", error);
        }
      };

      fetchResources();
    }
  }, [open, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleResourceChange = (resourceType, value) => {
    setFormData((prev) => ({
      ...prev,
      [resourceType]: value,
    }));
  };

  const handleOpenAddressDialog = (type) => {
    setCurrentAddressType(type);
    setOpenAddress(true);
  };

  const handleAddAddress = (address) => {
    if (currentAddressType === "depart") {
      setFormData((prev) => ({
        ...prev,
        lieuDepart: address,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lieuArrive: address,
      }));
    }
    setOpenAddress(false);
    enqueueSnackbar("Adresse enregistrée avec succès", { variant: "success" });
  };

  const handleRemoveAddress = (type) => {
    if (type === "depart") {
      setFormData((prev) => ({
        ...prev,
        lieuDepart: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lieuArrive: "",
      }));
    }
    enqueueSnackbar("Adresse supprimée", { variant: "info" });
  };

  const handleAddMarchandise = () => {
    if (!selectedMarchandise || !qteMarchandise) {
      enqueueSnackbar("Veuillez sélectionner une marchandise et une quantité", {
        variant: "warning",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      listMarchandises: [
        ...prev.listMarchandises,
        {
          marchandise: selectedMarchandise,
          quantite: parseInt(qteMarchandise),
          unite: selectedMarchandise.unite, // Add the unit from the selected merchandise
        },
      ],
    }));

    setSelectedMarchandise(null);
    setQteMarchandise("");
  };

  const handleRemoveMarchandise = (index) => {
    setFormData((prev) => ({
      ...prev,
      listMarchandises: prev.listMarchandises.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !formData.lieuDepart ||
        !formData.lieuArrive ||
        !formData.dateDepart
      ) {
        enqueueSnackbar(
          "Les champs Lieu de départ, Lieu d'arrivée et Date de départ sont obligatoires",
          { variant: "warning" }
        );
        return;
      }
      console.log("Form data before submission:", formData);
      // Prepare the voyage data with proper date formatting
      const voyageData = {
        ...formData,
        // Convert dates to ISO format with time
        dateDepart: formData.dateDepart
          ? `${formData.dateDepart}T00:00:00`
          : null,
        dateArrivePrevue: formData.dateArrivePrevue
          ? `${formData.dateArrivePrevue}T00:00:00`
          : null,
        // Keep full address objects (they'll be cascaded in backend)
        lieuDepart: formData.lieuDepart,
        lieuArrive: formData.lieuArrive,
        // Simplify nested objects to just their references
        chaufeur: formData.chaufeur,
        camion: formData.camion,
        remorque: formData.remorque,
      };

      // Remove empty dateArriveReelle if not set
      if (!formData.dateArriveReelle) {
        delete voyageData.dateArriveReelle;
      }

      console.log("Submitting voyage data:", voyageData);

      // 1. First create the voyage (addresses will be cascaded)
      const voyageResponse = await voyageService.create(voyageData);
      const voyageId = voyageResponse.data.id;

      // 2. Create merchandise associations if any
      if (formData.listMarchandises.length > 0) {
        const contientPromises = formData.listMarchandises.map((item) => {
          const contientData = {
            voyage: { id: voyageId },
            marchandise: { id: item.marchandise.id },
            quantite: item.quantite,
            unite: item.unite ? { id: item.unite.id } : null,
          };
          return contientService.create(contientData);
        });

        await Promise.all(contientPromises);
      }

      enqueueSnackbar("Voyage créé avec succès", { variant: "success" });
      onSave(voyageResponse.data);
      onClose();
    } catch (error) {
      console.error("Error saving voyage:", error);

      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 400) {
          // Bad request - likely validation error
          const errorMsg =
            error.response.data.message ||
            "Données invalides, veuillez vérifier les champs";
          enqueueSnackbar(errorMsg, { variant: "error" });
        } else {
          enqueueSnackbar("Erreur lors de la création du voyage", {
            variant: "error",
          });
        }
      } else {
        enqueueSnackbar("Erreur réseau ou serveur indisponible", {
          variant: "error",
        });
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return "Non spécifiée";
    return typeof address === "string"
      ? address
      : `${address.rue}, ${address.codePostal} ${address.ville}, ${address.pays}`;
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Planifier un Nouveau Voyage
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 2 }}>
            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informations de base
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date de départ *"
                        name="dateDepart"
                        type="date"
                        value={formData.dateDepart}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date d'arrivée prévue *"
                        name="dateArrivePrevue"
                        type="date"
                        value={formData.dateArrivePrevue}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Distance (km)"
                        name="distance"
                        type="number"
                        value={formData.distance}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.estUrgent}
                            onChange={handleChange}
                            name="estUrgent"
                            color="primary"
                          />
                        }
                        label="Urgent"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.estFragile}
                            onChange={handleChange}
                            name="estFragile"
                            color="primary"
                          />
                        }
                        label="Marchandise fragile"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Section */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Itinéraire
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Lieu de départ *
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          icon={<LocationOn />}
                          label={formatAddress(formData.lieuDepart)}
                          color={formData.lieuDepart ? "primary" : "default"}
                          sx={{ flexGrow: 1, justifyContent: "flex-start" }}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenAddressDialog("depart")}
                        >
                          <Edit />
                        </IconButton>
                        {formData.lieuDepart && (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveAddress("depart")}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Lieu d'arrivée *
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          icon={<LocationOn />}
                          label={formatAddress(formData.lieuArrive)}
                          color={formData.lieuArrive ? "primary" : "default"}
                          sx={{ flexGrow: 1, justifyContent: "flex-start" }}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenAddressDialog("arrivee")}
                        >
                          <Edit />
                        </IconButton>
                        {formData.lieuArrive && (
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveAddress("arrivee")}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Resources Section */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ressources
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        options={chauffeurs}
                        getOptionLabel={(option) =>
                          `${option.nom} ${option.prenom}`
                        }
                        value={formData.chaufeur}
                        onChange={(_, value) =>
                          handleResourceChange("chaufeur", value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Chauffeur"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        options={camions}
                        getOptionLabel={(option) =>
                          `${option.immatriculation} (${option.poidsMax} kg)`
                        }
                        value={formData.camion}
                        onChange={(_, value) =>
                          handleResourceChange("camion", value)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Camion" size="small" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        options={remorques}
                        getOptionLabel={(option) =>
                          `${option.typeRemorque.type} (${option.poidsChargeMax} kg)`
                        }
                        value={formData.remorque}
                        onChange={(_, value) =>
                          handleResourceChange("remorque", value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Remorque"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Marchandises Section */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Marchandises
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                      <Autocomplete
                        options={marchandises}
                        getOptionLabel={(option) =>
                          `${option.libelle} (${option.categorie.categorie})`
                        }
                        value={selectedMarchandise}
                        onChange={(_, value) => setSelectedMarchandise(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Sélectionner une marchandise"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Quantité"
                        value={qteMarchandise}
                        onChange={(e) => setQteMarchandise(e.target.value)}
                        size="small"
                        type="number"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={4}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleAddMarchandise}
                        sx={{ height: "40px" }}
                      >
                        Ajouter
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      {formData.listMarchandises.length > 0 ? (
                        <Box
                          sx={{
                            border: "1px solid #ddd",
                            borderRadius: 1,
                            p: 1,
                            maxHeight: "200px",
                            overflow: "auto",
                          }}
                        >
                          {formData.listMarchandises.map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 1,
                                borderBottom:
                                  index < formData.listMarchandises.length - 1
                                    ? "1px solid #eee"
                                    : "none",
                              }}
                            >
                              <Typography>
                                {item.marchandise.libelle} - {item.quantite}{" "}
                                {item.unite?.libelle || ""}
                              </Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveMarchandise(index)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Aucune marchandise ajoutée
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      <AddAddress
        open={openAddress}
        onClose={() => setOpenAddress(false)}
        onAdd={handleAddAddress}
      />
    </>
  );
}
