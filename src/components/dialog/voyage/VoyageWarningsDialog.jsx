import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

const warningIcons = {
  high: <ErrorIcon color="error" />,
  medium: <WarningIcon color="warning" />,
  low: <InfoIcon color="info" />,
};

export default function VoyageWarningsDialog({ open, onClose, warnings }) {
  const getWarningSeverity = (warning) => {
    if (warning.includes("expires") || warning.includes("exceeds")) {
      return "high";
    }
    return "medium";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography color="warning.main" variant="h6">
          <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Voyage Warnings
        </Typography>
      </DialogTitle>
      <DialogContent>
        {warnings?.length > 0 ? (
          <List>
            {warnings.map((warning, index) => {
              const severity = getWarningSeverity(warning);
              return (
                <ListItem key={index}>
                  <ListItemIcon>{warningIcons[severity]}</ListItemIcon>
                  <ListItemText
                    primary={warning}
                    primaryTypographyProps={{
                      color: severity === "high" ? "error" : "textPrimary",
                    }}
                  />
                  <Chip
                    label={severity.toUpperCase()}
                    size="small"
                    color={severity}
                    variant="outlined"
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography>No warnings for this voyage</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
