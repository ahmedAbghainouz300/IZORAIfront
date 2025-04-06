import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { LocationOn, Edit } from '@mui/icons-material';
import demandeCotationService from '../../../service/demande/demandeCotationService';
import { useSnackbar } from 'notistack';
import EditDemandeCotationDialog from './EditDemandeCotationDialog'; // Make sure this import path is correct

const statusColors = {
  BROUILLON: 'default',
  EN_ATTENTE: 'warning',
  VALIDEE: 'success',
  REJETEE: 'error'
};

const typeRemorqueLabels = {
  FRIGORIFIQUE: 'Frigorifique',
  PLATEAU: 'Plateau',
  BENNE: 'Benne',
  CITERNE: 'Citerne',
  REFRIGEREE: 'Réfrigérée'
};

const typeMarchandiseLabels = {
  ALIMENTAIRE: 'Alimentaire',
  MATERIAUX_CONSTRUCTION: 'Matériaux de construction',
  PRODUITS_CHIMIQUES: 'Produits chimiques',
  EQUIPEMENTS_INDUSTRIELS: 'Équipements industriels'
};

export default function ViewDemandeCotationDialog({ open, onClose, demandeId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (open && demandeId) {
      const fetchDemande = async () => {
        try {
          setLoading(true);
          const response = await demandeCotationService.getById(demandeId);
          setDemande(response.data);
        } catch (error) {
          enqueueSnackbar('Erreur lors du chargement de la demande', { variant: 'error' });
          console.error('Error fetching demande:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDemande();
    }
  }, [open, demandeId, enqueueSnackbar]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatAddress = (address) => {
    if (!address) return 'Non spécifiée';
    return `${address.rue}, ${address.codePostal} ${address.ville}, ${address.pays}`;
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleSaveSuccess = (updatedDemande) => {
    setDemande(updatedDemande);
    enqueueSnackbar('Demande mise à jour avec succès', { variant: 'success' });
    setEditDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Détails de la Demande de Cotation
            {demande && (
              <Chip 
                label={demande.statut} 
                color={statusColors[demande.statut] || 'default'}
                sx={{ ml: 2, color: 'white', fontWeight: 'bold' }}
              />
            )}
          </Box>
          
          {demande && demande.statut === 'EN_ATTENTE' && (
            <Tooltip title="Modifier cette demande">
              <IconButton 
                onClick={handleEditClick}
                sx={{ color: 'white' }}
                size="large"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </DialogTitle>
        
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography>Chargement en cours...</Typography>
            </Box>
          ) : demande ? (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Informations Générales
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>ID</TableCell>
                            <TableCell>{demande.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Type de Marchandise</TableCell>
                            <TableCell>
                              {typeMarchandiseLabels[demande.typeMarchandise] || demande.typeMarchandise}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Type de Remorque</TableCell>
                            <TableCell>
                              {typeRemorqueLabels[demande.typeRemorque] || demande.typeRemorque}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date de Demande</TableCell>
                            <TableCell>{formatDate(demande.dateDemande)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Période de Transport</TableCell>
                            <TableCell>{demande.periodeTransport || 'Non spécifiée'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Transit à l'étranger</TableCell>
                            <TableCell>
                              {demande.transitEtranger ? 'Oui' : 'Non'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Exigences Particulières</TableCell>
                            <TableCell>
                              {demande.exigencesParticulieres || 'Aucune'}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Addresses Section */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Adresse de Chargement
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" alignItems="center">
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography>
                        {formatAddress(demande.adresseChargement)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Adresse de Déchargement
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" alignItems="center">
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography>
                        {formatAddress(demande.adresseDechargement)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Additional Details */}
              {demande.physique && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations Physiques
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableBody>
                            {Object.entries(demande.physique).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                                  {key}
                                </TableCell>
                                <TableCell>{value || 'Non spécifié'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography>Aucune donnée disponible</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      {demande && (
        <EditDemandeCotationDialog
          open={editDialogOpen}
          onClose={handleEditClose}
          demandeId={demande.id}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  );
}