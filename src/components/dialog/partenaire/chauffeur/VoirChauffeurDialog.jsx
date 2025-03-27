import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Button, 
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Paper,
  useTheme,
  Grid,
  Tabs,
  Tab,
  Alert,
  Collapse
} from "@mui/material";
import {
  Edit as EditIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  CalendarToday as DateIcon,
  CheckCircle as AvailableIcon,
  Cancel as UnavailableIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import chauffeurService from "../../../../service/partenaire/chaufeurService";

export default function VoirChauffeurDialog({ 
  open, 
  onClose, 
  chauffeurId,
  onEdit
}) {
  const [chauffeur, setChauffeur] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permisPhotos, setPermisPhotos] = useState({ recto: null, verso: null });
  const [tabValue, setTabValue] = useState(0);
  const [permisValidity, setPermisValidity] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (open && chauffeurId) {
      fetchChauffeurDetails();
      fetchPermisPhotos();
      checkPermisValidity();
    }
  }, [open, chauffeurId]);

  const fetchChauffeurDetails = async () => {
    try {
      setLoading(true);
      const response = await chauffeurService.getById(chauffeurId);
      setChauffeur(response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération du chauffeur:", err);
      setError("Impossible de charger les détails du chauffeur");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermisPhotos = async () => {
    try {
      const response = await chauffeurService.getPermisPhoto(chauffeurId);
      setPermisPhotos({
        recto: response.data.photoPermisRecto 
          ? `data:image/jpeg;base64,${response.data.photoPermisRecto}`
          : null,
        verso: response.data.photoPermisVerso 
          ? `data:image/jpeg;base64,${response.data.photoPermisVerso}`
          : null
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des photos du permis:", err);
    }
  };

  const checkPermisValidity = async () => {
    try {
      const response = await chauffeurService.checkPermisValidity(chauffeurId);
      setPermisValidity(response.data);
    } catch (err) {
      console.error("Erreur lors de la vérification du permis:", err);
      setPermisValidity({ isValid: false, message: "Erreur de vérification" });
    }
  };

  const handleEditClick = () => {
    onClose();
    onEdit(chauffeur);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const getExpirationInfo = () => {
    // Ne rien afficher si pas de données ou si permis valide
    if (!permisValidity || permisValidity.isValid || !chauffeur?.dateExpirationPermis) return null;
    
    return (
      <Box component="span" display="flex" alignItems="center">
        <DateIcon fontSize="small" sx={{ mr: 0.5 }} />
        Permis expire le: {new Date(chauffeur.dateExpirationPermis).toLocaleDateString()}
      </Box>
    );
  };

  const getPermisStatus = () => {
    if (permisValidity ) return null;
    
    return (
      <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 2, mt: 1 }}>
        <Typography variant="body1" fontWeight="bold">
          Permis expiré
        </Typography>
        {permisValidity.message && (
          <Typography variant="body2">
            {permisValidity.message}
          </Typography>
        )}
      </Alert>
    );
  };

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10],
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: theme.palette.primary.main, 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box display="flex" alignItems="center">
          <BadgeIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Détails du Chauffeur</Typography>
        </Box>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Box p={3} textAlign="center">
            <Typography color="error" variant="h6">{error}</Typography>
          </Box>
        ) : chauffeur ? (
          <Box>
            {/* Header avec avatar et info basique */}
            <Box 
              display="flex" 
              p={3} 
              sx={{ 
                bgcolor: theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 3,
                  fontSize: '2rem',
                  bgcolor: theme.palette.primary.main
                }}
              >
                {chauffeur.nom.charAt(0)}{chauffeur.prenom.charAt(0)}
              </Avatar>
              
              <Box flexGrow={1}>
                <Typography variant="h5" component="div">
                  {chauffeur.prenom} {chauffeur.nom}
                </Typography>
                
                <Box display="flex" alignItems="center" mt={1}>
                  <Chip
                    icon={chauffeur.disponibilite ? <AvailableIcon /> : <UnavailableIcon />}
                    label={chauffeur.disponibilite ? "Disponible" : "Non disponible"}
                    color={chauffeur.disponibilite ? "success" : "error"}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  
                  <Chip
                    icon={<WorkIcon />}
                    label={`CNSS: ${chauffeur.cnss}`}
                    color="info"
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" mt={1}>
                  <Box component="span" display="flex" alignItems="center">
                    <DateIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Recruté le: {new Date(chauffeur.dateRecrutement).toLocaleDateString()}
                  </Box>
                  {getExpirationInfo()}
                </Typography>

                {/* Affichage du statut du permis */}
                {getPermisStatus()}
              </Box>
            </Box>
            
            {/* Tabs pour navigation */}
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.grey[50]
              }}
            >
              <Tab label="Informations" icon={<BadgeIcon />} />
              <Tab label="Permis de conduire" icon={<ImageIcon />} />
            </Tabs>
            
            {/* Contenu des tabs */}
            <Box sx={{ overflowY: 'auto', maxHeight: '50vh' }}>
              {tabValue === 0 && (
                <Box p={3}>
                  <Grid container spacing={3}>
                    {/* Colonne 1 - Informations personnelles */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                          <BadgeIcon color="primary" sx={{ mr: 1 }} />
                          Informations Personnelles
                        </Typography>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box mb={2}>
                          <Typography variant="body2" color="text.secondary">
                            CNI
                          </Typography>
                          <Typography variant="body1">
                            {chauffeur.CNI}
                          </Typography>
                        </Box>
                        
                        <Box mb={2} display="flex" alignItems="center">
                          <EmailIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            {chauffeur.email}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center">
                          <PhoneIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            {chauffeur.telephone}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    {/* Colonne 2 - Adresses */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                          <LocationIcon color="primary" sx={{ mr: 1 }} />
                          Adresses
                        </Typography>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        {chauffeur.adresses && chauffeur.adresses.length > 0 ? (
                          <List disablePadding>
                            {chauffeur.adresses.map((adresse, index) => (
                              <ListItem 
                                key={index} 
                                disableGutters
                                sx={{
                                  mb: 1,
                                  p: 1,
                                  bgcolor: index % 2 === 0 ? theme.palette.grey[50] : 'transparent',
                                  borderRadius: 1
                                }}
                              >
                                <ListItemText
                                  primary={`Adresse ${index + 1}`}
                                  secondary={
                                    <>
                                      <Typography component="span" variant="body2" display="block">
                                        {adresse.rue}
                                      </Typography>
                                      <Typography component="span" variant="body2" display="block">
                                        {adresse.codePostal} {adresse.ville}
                                      </Typography>
                                      <Typography component="span" variant="body2" display="block">
                                        {adresse.pays}
                                      </Typography>
                                    </>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Aucune adresse enregistrée
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box p={3}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <ImageIcon color="primary" sx={{ mr: 1 }} />
                    Photos du permis de conduire
                  </Typography>

                  {/* Avertissement si permis expiré - seulement si invalide */}
                  {permisValidity && !permisValidity.isValid && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      <Typography fontWeight="bold">
                        Attention: Ce permis est expiré ou invalide!
                      </Typography>
                      <Typography variant="body2">
                        Veuillez renouveler le permis dès que possible.
                      </Typography>
                    </Alert>
                  )}
                  <Grid container spacing={3}>
                    {/* Photo Recto */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Recto du permis
                        </Typography>
                        {permisPhotos.recto ? (
                          <Box 
                            component="img"
                            src={permisPhotos.recto}
                            alt="Recto du permis"
                            sx={{
                              width: '100%',
                              maxHeight: 300,
                              objectFit: 'contain',
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1
                            }}
                          />
                        ) : (
                          <Box 
                            display="flex" 
                            flexDirection="column" 
                            alignItems="center" 
                            justifyContent="center" 
                            height={200}
                            sx={{ 
                              bgcolor: theme.palette.grey[100],
                              borderRadius: 1
                            }}
                          >
                            <PdfIcon fontSize="large" color="disabled" />
                            <Typography color="text.secondary" mt={1}>
                              Aucune photo disponible
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                    
                    {/* Photo Verso */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Verso du permis
                        </Typography>
                        {permisPhotos.verso ? (
                          <Box 
                            component="img"
                            src={permisPhotos.verso}
                            alt="Verso du permis"
                            sx={{
                              width: '100%',
                              maxHeight: 300,
                              objectFit: 'contain',
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1
                            }}
                          />
                        ) : (
                          <Box 
                            display="flex" 
                            flexDirection="column" 
                            alignItems="center" 
                            justifyContent="center" 
                            height={200}
                            sx={{ 
                              bgcolor: theme.palette.grey[100],
                              borderRadius: 1
                            }}
                          >
                            <PdfIcon fontSize="large" color="disabled" />
                            <Typography color="text.secondary" mt={1}>
                              Aucune photo disponible
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        ) : null}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ mr: 1 }}
        >
          Fermer
        </Button>
        <Button 
          onClick={handleEditClick} 
          variant="contained"
          startIcon={<EditIcon />}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            }
          }}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );
}