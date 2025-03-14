import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import BusinessIcon from "@mui/icons-material/Business"; // Icône pour représenter un partenaire moral

export default function ViewMoraleDialog({ open, onClose, partenaire }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          textAlign: "center",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Avatar sx={{ bgcolor: "white", mr: 2 }}>
            <BusinessIcon color="primary" />
          </Avatar>
          <Typography variant="h6">Détails du Partenaire Moral</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Informations Générales
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1">
              <strong>ID :</strong> {partenaire.idPartenaire}
            </Typography>
            <Typography variant="body1">
              <strong>Nom :</strong> {partenaire.nom}
            </Typography>
            <Typography variant="body1">
              <strong>Abréviation :</strong> {partenaire.abreviation}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Informations Juridiques
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1">
              <strong>ICE :</strong> {partenaire.ice}
            </Typography>
            <Typography variant="body1">
              <strong>Numéro RC :</strong> {partenaire.numeroRC}
            </Typography>
            <Typography variant="body1">
              <strong>Forme Juridique :</strong> {partenaire.formeJuridique}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}