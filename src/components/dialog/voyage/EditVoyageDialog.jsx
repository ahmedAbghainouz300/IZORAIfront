import React, { useState, useEffect } from "react";
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
  Tooltip,
  Stack,
} from "@mui/material";
import {
  LocationOn,
  Edit,
  Delete,
  Check,
  Close,
  MoreVert,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import voyageService from "../../../service/voyage/voyageService";
import camionService from "../../../service/camion/camionService";
import remorqueService from "../../../service/camion/remorqueService";
import marchandiseService from "../../../service/marchandise/marchandiseService";
import AddAddress from "../partenaire/adress/addAdress";
import chaufeurService from "../../../service/partenaire/chaufeurService";

export default function EditVoyageDialog({ open, onClose, onSave, voyageId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    dateDepart: new Date().toISOString().split("T")[0],
    dateArrivePrevue: "",
    dateArriveReelle: "",
    lieuDepart: "",
    lieuArrive: "",
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
    const fetchVoyage = async () => {
      if (voyageId) {
        try {
          const response = await voyageService.getById(voyageId);
          const voyageData = response.data;

          setFormData({
            dateDepart:
              voyageData.dateDepart || new Date().toISOString().split("T")[0],
            dateArrivePrevue: voyageData.dateArrivePrevue || "",
            dateArriveReelle: voyageData.dateArriveReelle || "",
            lieuDepart: voyageData.lieuDepart || "",
            lieuArrive: voyageData.lieuArrive || "",
            distance: voyageData.distance || 0,
            etat: voyageData.etat || "PLANIFIE",
            estUrgent: voyageData.estUrgent || false,
            estFragile: voyageData.estFragile || false,
            chaufeur: voyageData.chaufeur || null,
            camion: voyageData.camion || null,
            remorque: voyageData.remorque || null,
            listMarchandises: voyageData.listMarchandises || [],
          });
        } catch (error) {
          enqueueSnackbar("Erreur lors du chargement du voyage", {
            variant: "error",
          });
        }
      }
    };

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

    if (open) {
      fetchVoyage();
      fetchResources();
    }
  }, [voyageId, open, enqueueSnackbar]);

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

  const handleStatusChange = async (newStatus) => {
    try {
      await voyageService.updateStatus(voyageId, newStatus);
      setFormData((prev) => ({ ...prev, etat: newStatus }));
      enqueueSnackbar(`Statut changé à ${newStatus}`, { variant: "success" });
      onSave({ ...formData, etat: newStatus });
    } catch (error) {
      enqueueSnackbar("Erreur lors du changement de statut", {
        variant: "error",
      });
      console.error("Error updating status:", error);
    }
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

      const result = await voyageService.update(voyageId, formData);
      enqueueSnackbar("Voyage mis à jour avec succès", { variant: "success" });
      onSave(result);
      onClose();
    } catch (error) {
      console.error("Error saving voyage:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Erreur lors de la mise à jour",
        { variant: "error" }
      );
    }
  };

  const formatAddress = (address) => {
    if (!address) return "Non spécifiée";
    return typeof address === "string"
      ? address
      : `${address.rue}, ${address.codePostal} ${address.ville}, ${address.pays}`;
  };

  const canEdit = formData.etat === "PLANIFIE";

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>{voyageId ? "Modifier le Voyage" : "Nouveau Voyage"}</Box>
          {voyageId && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={formData.etat}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor:
                    formData.etat === "PLANIFIE"
                      ? "#2196F3"
                      : formData.etat === "EN_COURS"
                        ? "#4CAF50"
                        : formData.etat === "TERMINE"
                          ? "#8BC34A"
                          : formData.etat === "ANNULE"
                            ? "#F44336"
                            : formData.etat === "EN_INCIDENT"
                              ? "#FF9800"
                              : "#9E9E9E",
                }}
              />
              {formData.etat === "PLANIFIE" && (
                <>
                  <Tooltip title="Démarrer le voyage">
                    <IconButton
                      onClick={() => handleStatusChange("EN_COURS")}
                      sx={{ color: "white" }}
                    >
                      <Check />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Annuler le voyage">
                    <IconButton
                      onClick={() => handleStatusChange("ANNULE")}
                      sx={{ color: "white" }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {formData.etat === "EN_COURS" && (
                <>
                  <Tooltip title="Terminer le voyage">
                    <IconButton
                      onClick={() => handleStatusChange("TERMINE")}
                      sx={{ color: "white" }}
                    >
                      <Check />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Signaler un incident">
                    <IconButton
                      onClick={() => handleStatusChange("EN_INCIDENT")}
                      sx={{ color: "white" }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {formData.etat === "EN_INCIDENT" && (
                <Tooltip title="Reprendre le voyage">
                  <IconButton
                    onClick={() => handleStatusChange("EN_COURS")}
                    sx={{ color: "white" }}
                  >
                    <Check />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )}
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
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Date de départ *"
                        name="dateDepart"
                        type="date"
                        value={formData.dateDepart}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        disabled={!canEdit}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Date d'arrivée prévue *"
                        name="dateArrivePrevue"
                        type="date"
                        value={formData.dateArrivePrevue}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        disabled={!canEdit}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Date d'arrivée réelle"
                        name="dateArriveReelle"
                        type="date"
                        value={formData.dateArriveReelle}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        disabled={formData.etat !== "TERMINE"}
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
                        disabled={!canEdit}
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
                            disabled={!canEdit}
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
                            disabled={!canEdit}
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
                        {canEdit && (
                          <>
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
                          </>
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
                        {canEdit && (
                          <>
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
                          </>
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
                            disabled={!canEdit}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        options={camions}
                        getOptionLabel={(option) =>
                          `${option.marque} ${option.modele} (${option.immatriculation})`
                        }
                        value={formData.camion}
                        onChange={(_, value) =>
                          handleResourceChange("camion", value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Camion"
                            size="small"
                            disabled={!canEdit}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        options={remorques}
                        getOptionLabel={(option) =>
                          `${option.type} (${option.immatriculation})`
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
                            disabled={!canEdit}
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
                    {canEdit && (
                      <>
                        <Grid item xs={12} md={5}>
                          <Autocomplete
                            options={marchandises}
                            getOptionLabel={(option) => option.libelle}
                            value={selectedMarchandise}
                            onChange={(_, value) =>
                              setSelectedMarchandise(value)
                            }
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
                      </>
                    )}
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
                                {item.marchandise?.libelle ||
                                  "Marchandise inconnue"}{" "}
                                - {item.quantite}{" "}
                                {item.marchandise?.unite.unite || ""}
                              </Typography>
                              {canEdit && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveMarchandise(index)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              )}
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
          {canEdit && (
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {voyageId ? "Mettre à jour" : "Créer"}
            </Button>
          )}
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
