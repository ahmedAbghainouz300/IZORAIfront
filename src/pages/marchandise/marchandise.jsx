import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Avatar,
  Paper,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  LocalShipping,
  Edit,
  Delete,
  Visibility,
  Category,
  Scale,
  Inventory,
  Inventory2,
} from "@mui/icons-material";
import MarchandiseDialog from "../../components/dialog/marchandise/MarchandiseDialog";
import marchandiseService from "../../service/marchandise/marchandiseService";
import ViewMarchandiseDialog from "../../components/dialog/marchandise/ViewMarchandiseDialog";
import { useSnackbar } from "notistack";

export default function Marchandise() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMarchandise, setSelectedMarchandise] = useState(null);
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchAllMarchandises = () => {
    marchandiseService
      .getAll()
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        enqueueSnackbar("Erreur lors du chargement des marchandises", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    fetchAllMarchandises();
  }, []);

  const handleOpenDialog = () => {
    setSelectedMarchandise(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleView = (marchandise) => {
    setSelectedMarchandise(marchandise);
    setViewDialogOpen(true);
  };

  const handleEdit = (marchandise) => {
    setSelectedMarchandise(marchandise);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette marchandise ?")
    ) {
      marchandiseService
        .delete(id)
        .then(() => {
          enqueueSnackbar("Marchandise supprimée avec succès", {
            variant: "success",
          });
          fetchAllMarchandises();
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression:", error);
          enqueueSnackbar(
            error.response?.data?.message || "Erreur lors de la suppression",
            { variant: "error" }
          );
        });
    }
  };

  const getCategoryColor = (category) => {
    // You can customize these colors based on your categories
    const colors = {
      FRAGILE: { bg: "#FFEBEE", text: "#C62828" },
      DANGEREUSE: { bg: "#FFF3E0", text: "#E65100" },
      PERISHABLE: { bg: "#E8F5E9", text: "#2E7D32" },
      default: { bg: "#E3F2FD", text: "#1565C0" },
    };
    return colors[category?.toUpperCase()] || colors.default;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Inventory2 fontSize="large" />
            Gestion des Marchandises
          </Typography>

          <Button
            variant="contained"
            onClick={handleOpenDialog}
            startIcon={<MarchandiseDialog />}
            sx={{
              px: 3,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Ajouter une Marchandise
          </Button>
        </Box>

        <MarchandiseDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          marchandise={selectedMarchandise}
          onSave={fetchAllMarchandises}
        />

        {rows.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 10,
              textAlign: "center",
            }}
          >
            <LocalShipping
              sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Aucune marchandise trouvée
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre première marchandise
            </Typography>
            <Button variant="outlined" onClick={handleOpenDialog}>
              Ajouter une marchandise
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {rows.map((marchandise) => {
              const categoryColor = getCategoryColor(
                marchandise.categorie?.categorie
              );
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={marchandise.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: categoryColor.bg,
                            color: categoryColor.text,
                            width: 40,
                            height: 40,
                          }}
                        >
                          <Inventory />
                        </Avatar>

                        <Chip
                          label={
                            marchandise.categorie?.categorie || "Non catégorisé"
                          }
                          size="small"
                          sx={{
                            backgroundColor: categoryColor.bg,
                            color: categoryColor.text,
                            fontWeight: 600,
                            px: 1,
                          }}
                        />
                      </Box>

                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {marchandise.libelle}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {marchandise.description || "Aucune description"}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip
                          icon={<Category fontSize="small" />}
                          label={marchandise.codeMarchandise}
                          size="small"
                          variant="outlined"
                        />
                        {marchandise.unite && (
                          <Chip
                            icon={<Scale fontSize="small" />}
                            label={marchandise.unite.unite}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>

                      {marchandise.emballage && (
                        <Typography variant="caption" color="text.secondary">
                          Emballage: {marchandise.emballage.nom}
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          ID: {marchandise.id}
                        </Typography>

                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Voir détails">
                            <IconButton
                              size="small"
                              onClick={() => handleView(marchandise)}
                              color="primary"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(marchandise)}
                              color="secondary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(marchandise.id)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      {viewDialogOpen && (
        <ViewMarchandiseDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          marchandiseId={selectedMarchandise?.id}
        />
      )}
    </Box>
  );
}
