import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
  Tooltip,
  Skeleton
} from '@mui/material';
import { 
  CloudDownload, 
  Close,
  PictureAsPdf,
  Image,
  Description
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import visiteTechniqueService from '../../../../../service/camion/visiteTechniqueService';

const DocumentPreview = ({ documentData, onDownload, sx }) => {
  const isImage = documentData?.filename?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  const isPDF = documentData?.filename?.match(/\.pdf$/i);

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
        {isImage ? (
          <>
            <Image color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box 
              component="img"
              src={documentData.data} 
              sx={{ 
                maxWidth: '100%',
                maxHeight: 400,
                height: 'auto',
                width: 'auto',
                mr: 2,
                objectFit: 'contain',
                borderRadius: 1
              }}
              alt="Document preview"
            />
          </>
        ) : isPDF ? (
          <>
            <PictureAsPdf color="error" sx={{ fontSize: 40, mr: 2 }} />
            <Avatar 
              variant="rounded"
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 2,
                bgcolor: 'error.light',
                color: 'error.contrastText'
              }}
            >
              <Description sx={{ fontSize: 40 }} />
            </Avatar>
          </>
        ) : (
          <>
            <Description color="action" sx={{ fontSize: 40, mr: 2 }} />
            <Avatar 
              variant="rounded"
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 2,
                bgcolor: 'grey.300'
              }}
            />
          </>
        )}
        
        <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <Typography 
            variant="subtitle1" 
            noWrap 
            sx={{ 
              maxWidth: '100%',
              textOverflow: 'ellipsis'
            }}
          >
            {documentData.filename}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isImage ? 'Image' : isPDF ? 'PDF Document' : 'Document'}
          </Typography>
        </Box>
      </Box>
      
      <Tooltip title="Télécharger le document">
        <Button
          variant="outlined"
          startIcon={<CloudDownload />}
          onClick={onDownload}
          sx={{ ml: 2, flexShrink: 0 }}
        >
          Télécharger
        </Button>
      </Tooltip>
    </Paper>
  );
};

const InfoRow = ({ label, value, children }) => (
  <Box display="flex" justifyContent="space-between" mb={2}>
    <Typography variant="subtitle1" color="text.secondary" sx={{ minWidth: 150 }}>
      {label}:
    </Typography>
    <Box sx={{ flex: 1, textAlign: 'right' }}>
      {value && <Typography>{value}</Typography>}
      {children}
    </Box>
  </Box>
);

function ViewVisiteTechniqueDialog({ open, onClose, visiteId }) {
  const [visiteData, setVisiteData] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);

  const fetchVisiteData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setDocumentData(null);
      
      const response = await visiteTechniqueService.getById(visiteId);
      setVisiteData(response.data);
      
      if (response.data.documentUrl) {
        await fetchDocument();
      }
    } catch (err) {
      setError("Échec du chargement des données de visite");
      console.error("Fetch visite error:", err);
    } finally {
      setLoading(false);
    }
  }, [visiteId]);

  const fetchDocument = useCallback(async () => {
    try {
      setDocumentLoading(true);
      const response = await visiteTechniqueService.getDocument(visiteId);
      setDocumentData(response);
    } catch (err) {
      console.warn("Document load error:", err);
      setDocumentData(null);
    } finally {
      setDocumentLoading(false);
    }
  }, [visiteId]);

  const handleDownload = useCallback(() => {
    if (!documentData) return;
    
    const link = document.createElement('a');
    link.href = documentData.data;
    link.download = documentData.filename;
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(documentData.data);
    }, 100);
  }, [documentData]);

  const handleClose = useCallback(() => {
    if (documentData) {
      URL.revokeObjectURL(documentData.data);
    }
    onClose();
  }, [documentData, onClose]);

  useEffect(() => {
    if (open && visiteId) {
      fetchVisiteData();
    } else {
      // Reset state when closing
      setVisiteData(null);
      setDocumentData(null);
      setError(null);
    }
  }, [open, visiteId, fetchVisiteData]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Détails de la Visite Technique</Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          color="inherit"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 3 }}>
        {loading ? (
          <Box>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button 
              onClick={fetchVisiteData} 
              color="inherit" 
              size="small"
              sx={{ ml: 2 }}
            >
              Réessayer
            </Button>
          </Alert>
        ) : visiteData ? (
          <>
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}>
                Informations de la Visite
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <InfoRow 
                label="Centre de Visite" 
                value={visiteData.centreVisite} 
              />
              
              <InfoRow 
                label="Date de Visite" 
                value={format(new Date(visiteData.dateVisite), 'PPP', { locale: fr })}
              />
              
              <InfoRow 
                label="Date d'Expiration" 
                value={format(new Date(visiteData.dateExpiration), 'PPP', { locale: fr })}
              />
              
              <InfoRow label="Résultat">
                <Chip 
                  label={visiteData.resultatVisite} 
                  color={
                    visiteData.resultatVisite === 'VALIDE' ? 'success' : 
                    visiteData.resultatVisite === 'REFUSE' ? 'error' : 'warning'
                  }
                  sx={{ fontWeight: 'bold' }}
                />
              </InfoRow>
              
              <InfoRow 
                label="Camion" 
                value={`${visiteData.camion?.immatriculation} - ${visiteData.camion?.typeCabine}`}
              />
              
              {visiteData.observations && (
                <InfoRow label="Observations">
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-line',
                      fontStyle: 'italic'
                    }}
                  >
                    {visiteData.observations}
                  </Typography>
                </InfoRow>
              )}
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}>
                Document Associé
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {documentLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : documentData ? (
                <DocumentPreview 
                  documentData={documentData} 
                  onDownload={handleDownload} 
                />
              ) : (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: 'background.default'
                  }}
                >
                  <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    Aucun document disponible
                  </Typography>
                </Paper>
              )}
            </Box>
          </>
        ) : null}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Fermer
        </Button>
        {documentData && (
          <Button
            onClick={handleDownload}
            variant="contained"
            startIcon={<CloudDownload />}
          >
            Télécharger le Document
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ViewVisiteTechniqueDialog;