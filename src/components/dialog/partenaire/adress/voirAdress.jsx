import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  useTheme,
  Box,
  Chip,
  Avatar,
  Divider
} from "@mui/material";
import { Slide } from "@mui/material";
import {
  LocationOn,
  Close,
  ContentCopy,
  Edit,
  Home,
  Work,
  Star
} from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddressViewer({ open, onClose, adresse }) {
  const theme = useTheme();

  if (!adresse) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Vous pourriez utiliser un snackbar au lieu d'une alerte
  };

  const addressTypeIcon = () => {
    switch(adresse.type) {
      case 'home': return <Home color="primary" />;
      case 'work': return <Work color="secondary" />;
      default: return <Star color="action" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          background: theme.palette.background.paper,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
            <LocationOn sx={{ color: theme.palette.primary.main }} />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Détails de l'adresse
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Address Type */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            gap: 1
          }}>
            {addressTypeIcon()}
            <Typography variant="subtitle1" color="text.secondary">
              {adresse.type === 'home' ? 'Adresse personnelle' : 
               adresse.type === 'work' ? 'Adresse professionnelle' : 'Autre adresse'}
            </Typography>
            {adresse.isPrimary && (
              <Chip 
                label="Principale" 
                size="small" 
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          {/* Address Card */}
          <Box
            sx={{
              p: 3,
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              mb: 3
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {adresse.nom || 'Mon adresse'}
              <IconButton size="small" onClick={() => {}}>
                <Edit fontSize="small" />
              </IconButton>
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Rue', value: adresse.rue },
                { label: 'Ville', value: adresse.ville },
                { label: 'Code postal', value: adresse.codePostal },
                { label: 'Pays', value: adresse.pays }
              ].map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {item.label}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {item.value || 'Non spécifié'}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(item.value)}
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Full Address */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Adresse complète
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: '8px',
                backgroundColor: theme.palette.action.hover,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1">
                {`${adresse.rue}, ${adresse.ville}, ${adresse.codePostal}, ${adresse.pays}`}
              </Typography>
              <IconButton onClick={() => handleCopy(
                `${adresse.rue}, ${adresse.ville}, ${adresse.codePostal}, ${adresse.pays}`
              )}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Actions */}
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '8px',
              py: 1.5,
              textTransform: 'none'
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}