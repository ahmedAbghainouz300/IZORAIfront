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
import PersonIcon from "@mui/icons-material/Person"; // Icône pour représenter un partenaire physique

export default function ViewPhysiqueDialog({ open, onClose, partenaire }) {
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
            <PersonIcon color="primary" />
          </Avatar>
          <Typography variant="h6">Détails du Partenaire Physique</Typography>
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
              <strong>Prénom :</strong> {partenaire.prenom}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Informations de Contact
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1">
              <strong>Email :</strong> {partenaire.email}
            </Typography>
            <Typography variant="body1">
              <strong>Téléphone :</strong> {partenaire.telephone}
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
              <strong>CNI :</strong> {partenaire.CNI}
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