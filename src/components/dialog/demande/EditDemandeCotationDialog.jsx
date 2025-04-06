import React, { useState, useEffect } from 'react'; // Corrigé l'import de useEffect
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
  IconButton
} from '@mui/material';
import { LocationOn, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import demandeCotationService from '../../../service/demande/demandeCotationService';
import AddAdress from '../partenaire/adress/addAdress';

const typeRemorqueOptions = [
  'FRIGORIFIQUE',
  'PLATEAU',
  'BENNE',
  'CITERNE',
  'REFRIGEREE'
];

const typeMarchandiseOptions = [
  'ALIMENTAIRE',
  'MATERIAUX_CONSTRUCTION',
  'PRODUITS_CHIMIQUES',
  'EQUIPEMENTS_INDUSTRIELS'
];

export default function EditDemandeCotationDialog({ open, onClose, onSave, demandeId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    typeRemorque: '',
    typeMarchandise: '',
    exigencesParticulieres: '',
    transitEtranger: false,
    dateDemande: new Date().toISOString().split('T')[0],
    periodeTransport: '',
    statut: 'EN_ATTENTE',
    adresseChargement: null,
    adresseDechargement: null,
    physique: null
  });

  const [openAdress, setOpenAdress] = useState(false);
  const [currentAddressType, setCurrentAddressType] = useState(null);
  const [editAddress, setEditAddress] = useState(null); // Nouvel état pour l'adresse en édition

  useEffect(() => {
    const fetchDemande = async () => {
      if (demandeId) {
        try {
          const response = await demandeCotationService.getById(demandeId);
          setFormData({
            typeRemorque: response.data.typeRemorque || '',
            typeMarchandise: response.data.typeMarchandise || '',
            exigencesParticulieres: response.data.exigencesParticulieres || '',
            transitEtranger: response.data.transitEtranger || false,
            dateDemande: response.data.dateDemande || new Date().toISOString().split('T')[0],
            periodeTransport: response.data.periodeTransport || '',
            statut: response.data.statut || 'EN_ATTENTE',
            adresseChargement: response.data.adresseChargement || null,
            adresseDechargement: response.data.adresseDechargement || null,
            physique: response.data.physique || null
          });
        } catch (error) {
          enqueueSnackbar('Erreur lors du chargement de la demande', { variant: 'error' });
        }
      }
    };

    if (open) {
      fetchDemande();
    }
  }, [demandeId, open, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenAddressDialog = (type, address = null) => {
    setCurrentAddressType(type);
    setEditAddress(address);
    setOpenAdress(true);
  };

  const handleAddAdress = (newAddress) => {
    if (currentAddressType === 'chargement') {
      setFormData(prev => ({
        ...prev,
        adresseChargement: newAddress
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        adresseDechargement: newAddress
      }));
    }
    setOpenAdress(false);
    enqueueSnackbar('Adresse enregistrée avec succès', { variant: 'success' });
  };

  const handleRemoveAddress = (type) => {
    if (type === 'chargement') {
      setFormData(prev => ({
        ...prev,
        adresseChargement: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        adresseDechargement: null
      }));
    }
    enqueueSnackbar('Adresse supprimée', { variant: 'info' });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.typeMarchandise || !formData.typeRemorque) {
        enqueueSnackbar('Les champs Type Marchandise et Type Remorque sont obligatoires', { variant: 'warning' });
        return;
      }

      let result;
      if (demandeId) {
        result = await demandeCotationService.update(demandeId, formData);
        enqueueSnackbar('Demande mise à jour avec succès', { variant: 'success' });
      } else {
        result = await demandeCotationService.create(formData);
        enqueueSnackbar('Demande créée avec succès', { variant: 'success' });
      }
      
      onSave(result);
      onClose();
    } catch (error) {
      console.error('Error saving demande:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Erreur lors de la sauvegarde', 
        { variant: 'error' }
      );
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'Non spécifiée';
    return `${address.rue}, ${address.codePostal} ${address.ville}, ${address.pays}`;
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {demandeId ? 'Modifier la Demande' : 'Nouvelle Demande de Cotation'}
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
                        select
                        fullWidth
                        label="Type Marchandise *"
                        name="typeMarchandise"
                        value={formData.typeMarchandise}
                        onChange={handleChange}
                        size="small"
                      >
                        {typeMarchandiseOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Type Remorque *"
                        name="typeRemorque"
                        value={formData.typeRemorque}
                        onChange={handleChange}
                        size="small"
                      >
                        {typeRemorqueOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date Demande"
                        name="dateDemande"
                        type="date"
                        value={formData.dateDemande}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.transitEtranger}
                            onChange={handleChange}
                            name="transitEtranger"
                            color="primary"
                          />
                        }
                        label="Transit à l'étranger"
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
                    Adresses
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Adresse de Chargement
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={<LocationOn />}
                          label={formatAddress(formData.adresseChargement)}
                          color={formData.adresseChargement ? 'primary' : 'default'}
                          sx={{ flexGrow: 1, justifyContent: 'flex-start' }}
                        />
                        <IconButton 
                          color="primary"
                          onClick={() => handleOpenAddressDialog('chargement', formData.adresseChargement)}
                        >
                          <Edit />
                        </IconButton>
                        {formData.adresseChargement && (
                          <IconButton 
                            color="error"
                            onClick={() => handleRemoveAddress('chargement')}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Adresse de Déchargement
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={<LocationOn />}
                          label={formatAddress(formData.adresseDechargement)}
                          color={formData.adresseDechargement ? 'primary' : 'default'}
                          sx={{ flexGrow: 1, justifyContent: 'flex-start' }}
                        />
                        <IconButton 
                          color="primary"
                          onClick={() => handleOpenAddressDialog('dechargement', formData.adresseDechargement)}
                        >
                          <Edit />
                        </IconButton>
                        {formData.adresseDechargement && (
                          <IconButton 
                            color="error"
                            onClick={() => handleRemoveAddress('dechargement')}
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

            {/* Additional Details */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Détails supplémentaires
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Période de Transport"
                        name="periodeTransport"
                        value={formData.periodeTransport}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Exigences Particulières"
                        name="exigencesParticulieres"
                        value={formData.exigencesParticulieres}
                        onChange={handleChange}
                        size="small"
                      />
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
            {demandeId ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>

      <AddAdress
        open={openAdress}
        onClose={() => setOpenAdress(false)}
        onAdd={handleAddAdress}
        address={editAddress} // Passer l'adresse à éditer si elle existe
      />
    </>
  );
}