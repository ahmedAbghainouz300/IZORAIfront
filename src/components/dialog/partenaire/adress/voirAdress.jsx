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
} from "@mui/material";
import { Slide } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VoirAdress({ open, onClose, adresse }) {
  const theme = useTheme();

  if (!adresse) {
    return null; // Évite le rendu si adresse est null ou undefined
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Texte copié dans le presse-papiers !");
    });
  };

  const fullAddress = `${adresse.rue || "N/A"}, ${adresse.ville || "N/A"}, ${adresse.codePostal || "N/A"}, ${adresse.pays || "N/A"}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: theme.shadows[20],
        },
      }}
    >
      {/* Titre */}
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: `2px solid ${theme.palette.primary.dark}`,
          py: 2,
        }}
      >
        Détails de l'Adresse
      </DialogTitle>

      {/* Contenu */}
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: 3,
        }}
      >
        {/* Adresse complète */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.secondary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Adresse complète
          <IconButton
            size="small"
            onClick={() => handleCopyToClipboard(fullAddress)}
            sx={{ ml: 1 }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Typography>
        <Typography variant="body1">{fullAddress}</Typography>

        {/* Rue */}
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              color: theme.palette.primary.main,
              cursor: "pointer",
            },
          }}
        >
          <strong>Rue:</strong> {adresse.rue || "N/A"}
          <IconButton
            size="small"
            onClick={() => handleCopyToClipboard(adresse.rue || "")}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Typography>

        {/* Ville */}
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              color: theme.palette.primary.main,
              cursor: "pointer",
            },
          }}
        >
          <strong>Ville:</strong> {adresse.ville || "N/A"}
          <IconButton
            size="small"
            onClick={() => handleCopyToClipboard(adresse.ville || "")}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Typography>

        {/* Code Postal */}
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              color: theme.palette.primary.main,
              cursor: "pointer",
            },
          }}
        >
          <strong>Code Postal:</strong> {adresse.codePostal || "N/A"}
          <IconButton
            size="small"
            onClick={() => handleCopyToClipboard(adresse.codePostal || "")}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Typography>

        {/* Pays */}
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              color: theme.palette.primary.main,
              cursor: "pointer",
            },
          }}
        >
          <strong>Pays:</strong> {adresse.pays || "N/A"}
          <IconButton
            size="small"
            onClick={() => handleCopyToClipboard(adresse.pays || "")}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Typography>

        {/* Informations supplémentaires */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          <InfoOutlinedIcon sx={{ color: theme.palette.info.main }} />
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Vous pouvez cliquer sur chaque élément pour le copier.
          </Typography>
        </div>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 2,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "24px",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}