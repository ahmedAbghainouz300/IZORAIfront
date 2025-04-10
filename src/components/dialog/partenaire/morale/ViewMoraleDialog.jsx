import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Paper,
  useTheme
} from "@mui/material";
import {
  Business,
  Email,
  Phone,
  Badge,
  LocationOn,
  Description,
  Close,
  Edit,
  Star
} from "@mui/icons-material";
import moraleService from "../../../../service/partenaire/moraleService"; // Adjust the import path

export default function ViewMoraleDialog({ open, onClose, partenaireId }) {
  const theme = useTheme();
  const [partenaire, setPartenaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && partenaireId) {
      fetchPartenaire();
    }
  }, [open, partenaireId]);

  const fetchPartenaire = async () => {
    try {
      setLoading(true);
      const response = await moraleService.getById(partenaireId);
      setPartenaire(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching partner:", err);
      setError("Failed to load partner data");
      setPartenaire(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setPartenaire(null);
    setError(null);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden"
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          py: 2,
          position: "relative"
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: "white",
              mr: 2,
              width: 48,
              height: 48
            }}
          >
            <Business fontSize="large" color="primary" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Détails du Partenaire Moral
            </Typography>
            <Typography variant="subtitle2">
              {partenaire?.typePartenaire?.libelle || "Type inconnu"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "white"
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 3, px: 0 }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            flexDirection="column"
          >
            <Typography color="error" variant="h6" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={fetchPartenaire}
              sx={{ mt: 2 }}
            >
              Réessayer
            </Button>
          </Box>
        ) : partenaire ? (
          <Box>
            {/* Basic Info Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 0,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                Informations Générales
                <IconButton size="small">
                  <Edit fontSize="small" />
                </IconButton>
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={3}
              >
                <InfoItem
                  label="ID Partenaire"
                  value={partenaire.idPartenaire}
                  icon={<Badge color="primary" />}
                />
                <InfoItem
                  label="Nom Complet"
                  value={partenaire.nom}
                  icon={<Business color="primary" />}
                />
                <InfoItem
                  label="Abréviation"
                  value={partenaire.abreviation}
                  icon={<Description color="primary" />}
                />
              </Box>
            </Paper>

            {/* Legal Info Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 0,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" gutterBottom>
                Informations Juridiques
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={3}
              >
                <InfoItem
                  label="ICE"
                  value={partenaire.ice}
                  icon={<Badge color="primary" />}
                />
                <InfoItem
                  label="Numéro RC"
                  value={partenaire.numeroRC}
                  icon={<Description color="primary" />}
                />
                <InfoItem
                  label="Forme Juridique"
                  value={partenaire.formeJuridique}
                  icon={<Description color="primary" />}
                />
              </Box>
            </Paper>

            {/* Contact Info Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 0,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" gutterBottom>
                Informations de Contact
              </Typography>

              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={3}
              >
                <InfoItem
                  label="Email"
                  value={partenaire.email}
                  icon={<Email color="primary" />}
                />
                <InfoItem
                  label="Téléphone"
                  value={partenaire.telephone}
                  icon={<Phone color="primary" />}
                />
              </Box>
            </Paper>

            {/* Addresses Section */}
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Adresses ({partenaire.adresses?.length || 0})
              </Typography>

              {partenaire.adresses?.length > 0 ? (
                <List
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 2
                  }}
                >
                  {partenaire.adresses.map((address, index) => (
                    <AddressCard key={index} address={address} />
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary" sx={{ py: 2 }}>
                  Aucune adresse enregistrée
                </Typography>
              )}
            </Paper>
          </Box>
        ) : null}
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{
            px: 4,
            textTransform: "none",
            borderRadius: "8px"
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Reusable Info Item Component
const InfoItem = ({ label, value, icon }) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        sx={{
          bgcolor: "action.hover",
          width: 40,
          height: 40
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value || "Non spécifié"}
        </Typography>
      </Box>
    </Box>
  );
};

// Address Card Component
const AddressCard = ({ address }) => {
  const theme = useTheme();
  
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: "8px",
        "&:hover": {
          borderColor: theme.palette.primary.main
        }
      }}
    >
      <ListItem disableGutters>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "primary.light" }}>
            <LocationOn color="primary" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography fontWeight="medium">
              {address.type || "Adresse"}
              {address.isPrimary && (
                <Chip
                  label="Principale"
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                  icon={<Star fontSize="small" />}
                />
              )}
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2">
                {address.rue}, {address.ville}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {address.codePostal}, {address.pays}
              </Typography>
            </>
          }
        />
      </ListItem>
    </Paper>
  );
};