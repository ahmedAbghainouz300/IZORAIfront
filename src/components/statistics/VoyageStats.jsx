import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  LinearProgress,
  Avatar,
} from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ConstructionOutlined from "@mui/icons-material/ConstructionOutlined";

const VoyageStats = ({ stats, loading }) => {
  const safeStats = stats || {};
  const total = Object.values(safeStats).reduce((sum, count) => sum + count, 0);

  const statuses = [
    {
      status: "PLANIFIE",
      label: "Planifiés",
      icon: <HourglassTopIcon color="info" />,
      color: "#BBDEFB", // Light blue (unchanged)
    },
    {
      status: "EN_COURS",
      label: "En cours",
      icon: <DirectionsCarIcon color="primary" />,
      color: "#FFCC80", // Changed to orange (was #B3E5FC)
    },
    {
      status: "TERMINE",
      label: "Terminés",
      icon: <CheckCircleIcon color="success" />,
      color: "#C8E6C9", // Light green (unchanged)
    },
    {
      status: "ANNULE",
      label: "Annulés",
      icon: <CancelIcon color="error" />,
      color: "#FFCDD2", // Light red (unchanged)
    },
    {
      status: "EN_INCIDENT",
      label: "Incidents",
      icon: <ConstructionOutlined color="warning" />,
      color: "#FFECB3", // Light yellow (unchanged)
    },
  ];

  // Calculate angles for the pie chart
  const calculateAngles = () => {
    let currentAngle = 0;
    return statuses.map(({ status }) => {
      const percentage = total > 0 ? (safeStats[status] || 0) / total : 0;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      return { status, angle, startAngle };
    });
  };

  const angles = calculateAngles();

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        📊 Statistiques des voyages
      </Typography>

      {loading ? (
        <LinearProgress />
      ) : total === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Aucune donnée statistique disponible
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {statuses.map(({ status, label, icon, color }) => {
              const count = safeStats[status] || 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <Grid item xs={12} sm={4} md={2.4} key={status}>
                  <Paper
                    elevation={1}
                    sx={{ p: 2, borderRadius: 2, backgroundColor: color }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "white" }}>{icon}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                          {count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {percent}%
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                position: "relative",
                background:
                  "conic-gradient(" +
                  angles
                    .map(({ status, angle, startAngle }, index) => {
                      const color =
                        statuses.find((s) => s.status === status)?.color ||
                        "#ccc";
                      return `${color} ${startAngle}deg ${startAngle + angle}deg`;
                    })
                    .join(", ") +
                  ")",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60%",
                  height: "60%",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {total} voyages
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {statuses.map(({ status, label, color }) => (
              <Box key={status} sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: color,
                    mr: 1,
                  }}
                />
                <Typography variant="body2">{label}</Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default VoyageStats;
