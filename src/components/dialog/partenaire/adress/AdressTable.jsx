import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Typography,
  Box
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";

// Alert component for notifications
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdressTable({
  adresses = [],
  onView,
  onEdit,
  onDelete,
  open,
  onClose,
  onAddAddress,
  onRefresh,
  title = "Gérer les Adresses",
  isLoading = false
}) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDeleteClick = (id) => {
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(addressToDelete);
      setSuccess("Adresse supprimée avec succès");
      setDeleteConfirmOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      setError("Échec de la suppression de l'adresse");
    }
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") return;
    setSuccess(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{title}</Typography>
            <Box>
              {onRefresh && (
                <Tooltip title="Rafraîchir">
                  <IconButton onClick={onRefresh} color="primary" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {onAddAddress && (
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={onAddAddress}
              sx={{ mb: 2 }}
            >
              Ajouter une Adresse
            </Button>
          )}

          <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rue</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ville</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Code Postal</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Pays</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : adresses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucune adresse trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  adresses.map((adresse) => (
                    <TableRow key={adresse.idAdress} hover>
                      <TableCell>{adresse.rue}</TableCell>
                      <TableCell>{adresse.ville}</TableCell>
                      <TableCell>{adresse.codePostal}</TableCell>
                      <TableCell>{adresse.pays}</TableCell>
                      <TableCell>
                        <Tooltip title="Voir les détails">
                          <IconButton color="info" onClick={() => onView(adresse)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton color="primary" onClick={() => onEdit(adresse)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteClick(adresse.idAdress)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette adresse ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseError}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSuccess}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}