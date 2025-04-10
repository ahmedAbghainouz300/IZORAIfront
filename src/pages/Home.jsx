import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import voyageService from "../service/voyage/voyageService";
import DemandeStats from "../components/statistics/DemandeStats";
import demandeCotationService from "../service/demande/demandeCotationService";
import VoyageStats from "../components/statistics/VoyageStats";

const Home = () => {
  const [voyageStats, setVoyageStats] = useState({});
  const [demandeStats, setDemandeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [voyageResponse, demandeResponse] = await Promise.all([
        voyageService.getStatistics(),
        demandeCotationService.getStatistics(),
      ]);
      setVoyageStats(voyageResponse.data);
      setDemandeStats(demandeResponse.data);
    } catch (error) {
      enqueueSnackbar("Erreur lors du chargement des statistiques", {
        variant: "error",
      });
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Tableau de Bord
      </Typography>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <VoyageStats stats={voyageStats} loading={loading} />
          <DemandeStats stats={demandeStats} loading={loading} />
        </>
      )}
    </Box>
  );
};

export default Home;
