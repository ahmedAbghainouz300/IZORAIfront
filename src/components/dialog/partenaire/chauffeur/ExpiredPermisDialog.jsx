import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box
} from "@mui/material";
import {
  Warning as WarningIcon,
  ErrorOutline as ErrorOutlineIcon,
  Close as CloseIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  DateRange as DateRangeIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const ExpiredPermisDialog = ({ 
  open, 
  onClose, 
  drivers,
  onViewDriver 
}) => {
  const getExpirationStatus = (expirationDate) => {
    if (!expirationDate) return 'Statut permis inconnu';
    
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffDays = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `Expire dans ${diffDays} jour(s)`;
    return 'Permis expiré';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: 'warning.light',
        color: 'warning.contrastText',
        display: 'flex',
        alignItems: 'center',
        py: 2
      }}>
        <Box display="flex" alignItems="center">
          <WarningIcon sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography variant="h6" component="div">
            Chauffeurs avec permis expiré
          </Typography>
        </Box>
      </DialogTitle>
  
      <DialogContent sx={{ py: 3 }}>
        <List disablePadding>
          {drivers.map(driver => (
            <ListItem 
              key={driver.idPartenaire}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              secondaryAction={
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<VisibilityIcon />}
                  onClick={() => onViewDriver(driver)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  Voir fiche complète
                </Button>
              }
            >
              <ListItemAvatar sx={{ minWidth: 56 }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48,
                    bgcolor: 'primary.main',
                    fontSize: '1.2rem'
                  }}
                >
                  {driver.nom?.charAt(0)}{driver.prenom?.charAt(0)}
                </Avatar>
              </ListItemAvatar>
  
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {driver.nom} {driver.prenom}
                  </Typography>
                }
                secondary={
                  <Box component="div" mt={1}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <BadgeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        CNI: {driver.cni || 'Non renseignée'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Tél: {driver.telephone || 'Non renseigné'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <DateRangeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Date expiration: {driver.dateExpirationPermis ? 
                          new Date(driver.dateExpirationPermis).toLocaleDateString() : 
                          'Inconnue'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <ErrorOutlineIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="error.main" fontWeight="medium">
                        {getExpirationStatus(driver.dateExpirationPermis)}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
  
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
          startIcon={<CloseIcon />}
          sx={{ mr: 1 }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpiredPermisDialog;