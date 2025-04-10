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
import uniteService from "../../../../service/marchandise/uniteService";
import UniteDialog from "./UniteDialog";

export default function SelectDialogUnite({ open, onClose, onSelect }) {
  const [unites, setUnites] = useState([]);
  const [uniteDialogOpen, setUniteDialogOpen] = useState(false);
  const [selectedUnite, setSelectedUnite] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchUnites = () => {
    uniteService
      .getAll()
      .then((res) => setUnites(res.data))
      .catch((error) => {
        console.error("Error fetching units:", error);
        enqueueSnackbar("Erreur lors du chargement des unités", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    if (open) {
      fetchUnites();
    }
  }, [open]);

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette unité ?")) {
      uniteService
        .delete(id)
        .then(() => {
          enqueueSnackbar("Unité supprimée avec succès", {
            variant: "success",
          });
          fetchUnites();
        })
        .catch((error) => {
          console.error("Error deleting unit:", error);
          enqueueSnackbar(
            error.response?.data?.message || "Erreur lors de la suppression",
            { variant: "error" }
          );
        });
    }
  };

  const handleEdit = (unite) => {
    setSelectedUnite(unite);
    setUniteDialogOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "unite", headerName: "Unite", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => onSelect(params.row)}>
            <VisibilityIcon />
          </IconButton>
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
          Sélectionner une unité
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUnite(null);
              setUniteDialogOpen(true);
            }}
            sx={{ float: "right", mr: 2 }}
          >
            Ajouter
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={unites}
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

      <UniteDialog
        open={uniteDialogOpen}
        onClose={() => {
          setUniteDialogOpen(false);
          setSelectedUnite(null);
        }}
        onSave={() => {
          fetchUnites();
          setUniteDialogOpen(false);
          setSelectedUnite(null);
        }}
        unite={selectedUnite}
      />
    </>
  );
}
