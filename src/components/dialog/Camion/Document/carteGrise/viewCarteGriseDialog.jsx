import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { Descriptions } from "antd";
import carteGriseService from "../../../../../service/camion/carteGriseService";
import { Grid, Paper, Typography } from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export default function ViewCarteGriseDialog({ open, onClose, carteGrise }) {
  // Ensure carteGrise is defined and has default values to avoid runtime errors
  const {
    marque = "",
    genre = "",
    numeroSerie = "",
    couleur = "",
    nombrePlace = "",
    puissanceFiscale = "",
    energie = "",
    proprietaire = "",
    poidsVide = "",
    poidsAutorise = "",
    dateMiseEnCirculation = "",
    dateDelivrance = "",
    photoCarteGrise = null, 
  } = carteGrise || {};


  // const [carteGriseData , setCarteGriseData] = useState(null);
    const [photoCarburant1, setPhotoCarburant1] = useState(null);
  

  const fetchCarteGrisesById = async (id) => {
    try {
      const response = await carteGriseService.getById(id);
      setPhotoCarburant1(response.data.photoCarteGrise ? `data:image/jpeg;base64,${response.data.photoCarteGrise}` : null);
    } catch (error) {
      console.error("Erreur lors de la récupération des cartes grises:", error);
    }
  }

  useEffect(() => { 
    if (open && carteGrise) {
      fetchCarteGrisesById(carteGrise.id);
    }
  }
  , [carteGrise]);



  // Convert carteGrise data to Descriptions items format
  const items = [
    {
      label: "Marque",
      children: marque,
      span: 3,
    },
    {
      label: "Genre",
      children: genre,
      span: 3,
    },
    {
      label: "Numéro de Série",
      children: numeroSerie,
      span: 3,
    },
    {
      label: "Couleur",
      children: couleur,
      span: 3,
    },
    {
      label: "Nombre de Places",
      children: nombrePlace,
      span: 3,
    },
    {
      label: "Puissance Fiscale",
      children: puissanceFiscale,
      span: 3,
    },
    {
      label: "Énergie",
      children: energie,
      span: 3,
    },
    {
      label: "Propriétaire",
      children: proprietaire,
      span: 3,
    },
    {
      label: "Poids à Vide (kg)",
      children: poidsVide,
      span: 3,
    },
    {
      label: "Poids Autorisé (kg)",
      children: poidsAutorise,
      span: 3,
    },
    {
      label: "Date de Mise en Circulation",
      children: dateMiseEnCirculation,
      span: 3,
    },
    {
      label: "Date de Délivrance",
      children: dateDelivrance,
      span: 3,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Carte Grise</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Descriptions
            bordered
            column={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            items={items}
          />
        </Box>

        {/* Right Column - Photo */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Photo du ticket de carburant
            </Typography>
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              my: 2 
            }}>
              {photoCarburant1 ? (
                <Card sx={{ width: '100%', maxHeight: '400px', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={photoCarburant1}
                    alt="Ticket de carburant"
                    sx={{ 
                      width: '100%',
                      objectFit: 'contain',
                      maxHeight: '400px'
                    }}
                  />
                </Card>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  color: 'text.secondary',
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                  p: 4,
                  width: '100%'
                }}>
                  <ImageNotSupportedIcon sx={{ fontSize: 60, mb: 2, opacity: 0.6 }} />
                  <Typography variant="body1">
                    Aucune photo disponible
                  </Typography>
                </Box>
              )}
            </Box>
            {photoCarburant1 && (
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => window.open(photoCarburant1, '_blank')}
                sx={{ mt: 'auto' }}
              >
                Voir en plein écran
              </Button>
            )}
          </Paper>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
