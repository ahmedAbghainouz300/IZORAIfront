import React, { useEffect,useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button,Avatar,Chip,Divider,List,ListItem,ListItemAvatar,ListItemText,ListItemSecondaryAction,IconButton,useTheme
} from '@mui/material';
import { Close as CloseIcon, SwapHoriz as ToggleIcon, CheckCircle as AvailableIcon, HighlightOff as UnavailableIcon
} from '@mui/icons-material';
import chauffeurService from '../../../../service/partenaire/chaufeurService';

const AvailableDriversDialog = ({  open,  onClose}) => {
  const theme = useTheme();

    const [availableDrivers, setAvailableDrivers] = useState([]);

    useEffect(() => {
        fetchAvailableDrivers();  // Fetch available drivers
    }, []);

    const onToggleAvailability = (idPartenaire) => {
        chauffeurService.toggleAvailability(idPartenaire) // Toggle driver availability status
            .then(() => { fetchAvailableDrivers(); })
            .catch((error) => { console.error("Erreur basculement disponibilité chauffeur:", error); });
    };    




  const fetchAvailableDrivers = () => {
    chauffeurService.getAvailableDrivers()
      .then((response) => {
        setAvailableDrivers(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération des chauffeurs disponibles:", error);
      });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Box display="flex" alignItems="center">
          <AvailableIcon sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography variant="h6" component="div">
            Chauffeurs Disponibles
          </Typography>
        </Box>
        <IconButton 
          edge="end" 
          onClick={onClose}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 2 }}>
        {availableDrivers.length > 0 ? (
          <List disablePadding>
            {availableDrivers.map((driver, index) => (
              <React.Fragment key={driver.idPartenaire}>
                <ListItem 
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.secondary.main,
                        width: 48,
                        height: 48
                      }}
                    >
                      {driver.nom.charAt(0)}{driver.prenom.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {driver.nom} {driver.prenom}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          icon={<AvailableIcon fontSize="small" />}
                          label="Disponible"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          component="span"
                        >
                          CNI: {driver.cni}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ToggleIcon />}
                      onClick={() => onToggleAvailability(driver.idPartenaire)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                    >
                      Rendre Indisponible
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < availableDrivers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 4 
            }}
          >
            <UnavailableIcon 
              sx={{ 
                fontSize: 60, 
                color: 'text.disabled',
                mb: 2
              }} 
            />
            <Typography 
              variant="h6" 
              color="textSecondary" 
              align="center"
              sx={{ mb: 1 }}
            >
              Aucun chauffeur disponible
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              align="center"
            >
              Tous les chauffeurs sont actuellement en mission
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          variant="text"
          color="inherit"
          startIcon={<CloseIcon />}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvailableDriversDialog;