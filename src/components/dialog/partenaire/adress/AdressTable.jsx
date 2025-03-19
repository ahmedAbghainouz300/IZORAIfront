import React from "react";
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
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function AdressTable({
  adresses,
  onView,
  onEdit,
  onDelete,
  open,
  onClose,
  onAddAddress,
  title = "Gérer les Adresses"
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      {onAddAddress && (
        <Button
          variant="contained"
          color="success"
          onClick={onAddAddress}
          style={{ margin: "16px" }}
        >
          Ajouter une Adresse
        </Button>
      )}
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rue</TableCell>
                <TableCell>Ville</TableCell>
                <TableCell>Code Postal</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adresses.map((adresse) => (
                <TableRow key={adresse.idAdress}>
                  <TableCell>{adresse.rue}</TableCell>
                  <TableCell>{adresse.ville}</TableCell>
                  <TableCell>{adresse.codePostal}</TableCell>
                  <TableCell>{adresse.pays}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => onView(adresse)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => onEdit(adresse)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(adresse.idAdress)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
