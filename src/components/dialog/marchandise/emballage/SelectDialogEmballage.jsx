import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import emballageService from "../../../../service/marchandise/emballageService";
import EmballageDialog from "./EmballageDialog";

export default function SelectDialogEmballage({ open, onClose, onSelect }) {
  const [emballages, setEmballages] = useState([]);
  const [emballageDialogOpen, setEmballageDialogOpen] = useState(false);
  const [selectedEmballage, setSelectedEmballage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchEmballages = () => {
    emballageService
      .getAll()
      .then((res) => setEmballages(res.data))
      .catch((error) => {
        console.error("Error fetching emballages:", error);
        enqueueSnackbar("Erreur lors du chargement des emballages", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    if (open) {
      fetchEmballages();
    }
  }, [open]);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet emballage ?")) {
      emballageService
        .delete(id)
        .then(() => {
          enqueueSnackbar("Emballage supprimé avec succès", {
            variant: "success",
          });
          fetchEmballages();
        })
        .catch((error) => {
          console.error("Error deleting emballage:", error);
          enqueueSnackbar(
            error.response?.data?.message || "Erreur lors de la suppression",
            { variant: "error" }
          );
        });
    }
  };

  const handleEdit = (emballage) => {
    setSelectedEmballage(emballage);
    setEmballageDialogOpen(true);
  };

  const columns = [
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "capacite", headerName: "Capacite", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box>
          <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSelect(params.row)}
            sx={{ ml: 1 }}
          >
            Sélectionner
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Sélectionner un emballage
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedEmballage(null);
              setEmballageDialogOpen(true);
            }}
            sx={{ float: "right", mr: 2 }}
          >
            Ajouter
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={emballages}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <EmballageDialog
        open={emballageDialogOpen}
        onClose={() => {
          setEmballageDialogOpen(false);
          setSelectedEmballage(null);
        }}
        onSave={() => {
          fetchEmballages();
          setEmballageDialogOpen(false);
          setSelectedEmballage(null);
        }}
        emballage={selectedEmballage}
      />
    </>
  );
}
