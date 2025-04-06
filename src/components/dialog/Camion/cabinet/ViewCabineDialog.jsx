// import React, { useState, useEffect, useCallback } from "react";

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
//   Paper,
//   Grid,
//   Divider,
//   Chip,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Tooltip,
//   Snackbar,
//   Alert,
//   useMediaQuery,
//   useTheme
// } from "@mui/material";
// import {
//   ExpandMore as ExpandMoreIcon,
//   Print as PrintIcon,
//   PictureAsPdf as PdfIcon,
//   Close as CloseIcon,
//   Refresh as RefreshIcon
// } from "@mui/icons-material";
// import { useReactToPrint } from 'react-to-print';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

// import camionService from './../../../../service/camion/camionService';
// const ViewCabineDialog = React.forwardRef(({ open, onClose, immatriculation }, ref) => {
//   const [camion, setCamion] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

//   const fetchCamionData = useCallback(async () => {
//     if (!immatriculation) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await camionService.getById(immatriculation);
//       setCamion(response.data);
//     } catch (err) {
//       setError("Échec du chargement des détails du camion");
//       console.error("Error fetching camion:", err);
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   }, [immatriculation]);

//   useEffect(() => {
//     if (open) {
//       fetchCamionData();
//     } else {
//       // Reset on close
//       setCamion(null);
//       setError(null);
//     }
//   }, [open, fetchCamionData]);

//   const handleRefresh = () => {
//     fetchCamionData();
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   const handlePrint = useReactToPrint({
//     content: () => ref.current,
//     pageStyle: `
//       @page { size: auto; margin: 10mm; }
//       @media print {
//         body { -webkit-print-color-adjust: exact; }
//         .no-print { display: none !important; }
//         .MuiAccordion-root { box-shadow: none !important; }
//         .MuiAccordionDetails-root { display: block !important; }
//       }import camionService from './../../../../service/camion/camionService';

//     `,
//   });

//   const handleExportPDF = () => {
//     const doc = new jsPDF();

//     // Add title
//     doc.setFontSize(18);
//     doc.text(`Détails du Camion: ${immatriculation}`, 14, 20);

//     // Add basic info
//     doc.setFontSize(12);
//     let yPosition = 30;

//     if (camion) {
//       doc.text(`Immatriculation: ${camion.immatriculation}`, 14, yPosition);
//       yPosition += 7;
//       doc.text(`Poids Max: ${camion.poidsMax} kg`, 14, yPosition);
//       yPosition += 7;
//       doc.text(`Statut: ${camion.status}`, 14, yPosition);
//       yPosition += 7;
//       doc.text(`Type: ${camion.typeCamion?.type || 'N/A'}`, 14, yPosition);
//       yPosition += 15;

//       // Add other sections similarly...
//     }

//     doc.save(`camion_${immatriculation}.pdf`);
//   };

//   const renderStatusChip = (status) => {
//     const statusMap = {
//       ACTIVE: { color: 'success', label: 'Actif' },
//       INACTIVE: { color: 'error', label: 'Inactif' },
//       MAINTENANCE: { color: 'warning', label: 'Maintenance' },
//     };

//     const { color, label } = statusMap[status] || { color: 'default', label: status };
//     return <Chip label={label} color={color} variant="outlined" size="small" />;
//   };

//   const renderBasicInfo = () => (
//     <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="h6" gutterBottom>Informations de Base</Typography>
//         <Box className="no-print">
//           <Tooltip title="Actualiser">
//             <IconButton onClick={handleRefresh} size="small">
//               <RefreshIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={4}>
//           <Typography variant="body2"><strong>Immatriculation:</strong></Typography>
//           <Typography>{camion.immatriculation}</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <Typography variant="body2"><strong>Poids Max:</strong></Typography>
//           <Typography>{camion.poidsMax} kg</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <Typography variant="body2"><strong>Statut:</strong></Typography>
//           {renderStatusChip(camion.status)}
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <Typography variant="body2"><strong>Type:</strong></Typography>
//           <Typography>{camion.typeCamion?.type || 'N/A'}</Typography>
//         </Grid>
//       </Grid>
//     </Paper>
//   );

//   const renderSection = (title, content, defaultMessage = "Aucune information disponible") => (
//     <Accordion defaultExpanded sx={{ mb: 2 }}>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography>{title}</Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//         {content || (
//           <Typography variant="body2" color="textSecondary">
//             {defaultMessage}
//           </Typography>
//         )}
//       </AccordionDetails>
//     </Accordion>
//   );

//   const renderDocumentsSection = () => (
//     <>
//       {renderSection(
//         "Carte Grise",
//         camion.carteGrise && (
//           <Grid container spacing={2}>
//             {Object.entries(camion.carteGrise).map(([key, value]) => (
//               <Grid item xs={12} sm={6} key={key}>
//                 <Typography variant="body2"><strong>{key}:</strong></Typography>
//                 <Typography>{value || 'N/A'}</Typography>
//               </Grid>
//             ))}
//           </Grid>
//         )
//       )}

//       {renderSection(
//         "Assurance",
//         camion.assurance && (
//           <Grid container spacing={2}>
//             {Object.entries(camion.assurance).map(([key, value]) => (
//               <Grid item xs={12} sm={6} key={key}>
//                 <Typography variant="body2"><strong>{key}:</strong></Typography>
//                 <Typography>{value || 'N/A'}</Typography>
//               </Grid>
//             ))}
//           </Grid>
//         )
//       )}
//     </>
//   );

//   const renderHistorySection = () => (
//     <>
//       {renderSection(
//         `Historique des Entretiens (${camion.entretiens?.length || 0})`,
//         camion.entretiens?.length > 0 && (
//           <TableContainer component={Paper}>
//             <Table size="small" aria-label="entretiens table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Type</TableCell>
//                   <TableCell>Coût</TableCell>
//                   <TableCell>Description</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {camion.entretiens.map((entretien, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{entretien.date || 'N/A'}</TableCell>
//                     <TableCell>{entretien.type || 'N/A'}</TableCell>
//                     <TableCell>{entretien.cout ? `${entretien.cout} €` : 'N/A'}</TableCell>
//                     <TableCell>{entretien.description || 'N/A'}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )
//       )}

//       {renderSection(
//         `Historique des Carburants (${camion.carburants?.length || 0})`,
//         camion.carburants?.length > 0 && (
//           <TableContainer component={Paper}>
//             <Table size="small" aria-label="carburants table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Type</TableCell>
//                   <TableCell>Quantité (L)</TableCell>
//                   <TableCell>Prix Unitaire</TableCell>
//                   <TableCell>Total</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {camion.carburants.map((carburant, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{carburant.date || 'N/A'}</TableCell>
//                     <TableCell>{carburant.type || 'N/A'}</TableCell>
//                     <TableCell>{carburant.quantite || 'N/A'}</TableCell>
//                     <TableCell>{carburant.prixUnitaire ? `${carburant.prixUnitaire} €` : 'N/A'}</TableCell>
//                     <TableCell>{carburant.montantTotal ? `${carburant.montantTotal} €` : 'N/A'}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )
//       )}
//     </>
//   );

//   return (
//     <>
//       <Dialog
//         fullScreen={fullScreen}
//         open={open}
//         onClose={onClose}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3, height: fullScreen ? '100vh' : '80vh' } }}
//         aria-labelledby="camion-details-dialog"
//       >
//         <DialogTitle sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6" component="div" id="camion-details-dialog">
//               Détails du Camion: {immatriculation}
//             </Typography>
//             <Box className="no-print">
//               <Tooltip title="Fermer">
//                 <IconButton edge="end" onClick={onClose} aria-label="close">
//                   <CloseIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>
//         </DialogTitle>

//         <DialogContent dividers ref={ref} sx={{ overflowY: 'auto' }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" p={4}>
//               <CircularProgress aria-label="Chargement" />
//             </Box>
//           ) : error ? (
//             <Box display="flex" justifyContent="center" p={4}>
//               <Typography color="error">{error}</Typography>
//             </Box>
//           ) : camion ? (
//             <>
//               {renderBasicInfo()}
//               <Divider sx={{ my: 2 }} />
//               {renderDocumentsSection()}
//               <Divider sx={{ my: 2 }} />
//               {renderHistorySection()}
//             </>
//           ) : (
//             <Typography variant="body1">Aucune donnée disponible pour ce camion</Typography>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }} className="no-print">
//           <Box flexGrow={1}>
//             <Tooltip title="Imprimer">
//               <IconButton onClick={handlePrint} aria-label="imprimer">
//                 <PrintIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Exporter en PDF">
//               <IconButton onClick={handleExportPDF} aria-label="exporter en pdf">
//                 <PdfIcon />
//               </IconButton>
//             </Tooltip>
//           </Box>
//           <Button
//             onClick={onClose}
//             color="primary"
//             variant="contained"
//             sx={{ borderRadius: 2 }}
//             aria-label="fermer"
//           >
//             Fermer
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
//           {error}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// });

// export default ViewCabineDialog;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Paper,
  Grid,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Descriptions } from "antd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import camionService from "./../../../../service/camion/camionService";

export default function ViewCabineDialog({ open, onClose, immatriculation }) {
  const [camion, setCamion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && immatriculation) {
      setLoading(true);
      camionService
        .getById(immatriculation)
        .then((response) => {
          setCamion(response.data);
          setError(null);
        })
        .catch((err) => {
          setError("Failed to load truck details");
          console.error("Error fetching camion:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [open, immatriculation]);

  const renderStatusChip = (status) => {
    let color;
    switch (status) {
      case "ACTIVE":
        color = "success";
        break;
      case "INACTIVE":
        color = "error";
        break;
      case "MAINTENANCE":
        color = "warning";
        break;
      default:
        color = "default";
    }
    return <Chip label={status} color={color} variant="outlined" />;
  };

  const renderBasicInfo = () => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Immatriculation:</strong> {camion.immatriculation}
          </Typography>
          <Typography>
            <strong>Poids Max:</strong> {camion.poidsMax} kg
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Status:</strong> {renderStatusChip(camion.status)}
          </Typography>
          <Typography>
            <strong>Type:</strong> {camion.typeCamion?.type || "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
  const renderCarteGrise = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Carte Grise</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {camion.carteGrise ? (
          <>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Numéro de Série</strong>
                    </TableCell>
                    <TableCell>
                      {camion.carteGrise.numeroSerie || "N/A"}
                    </TableCell>
                    <TableCell>
                      <strong>Date Mise en Circulation</strong>
                    </TableCell>
                    <TableCell>
                      {camion.carteGrise.dateMiseEnCirculation || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Marque</strong>
                    </TableCell>
                    <TableCell>{camion.carteGrise.marque || "N/A"}</TableCell>
                    <TableCell>
                      <strong>Genre</strong>
                    </TableCell>
                    <TableCell>{camion.carteGrise.genre || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Nombre de Places</strong>
                    </TableCell>
                    <TableCell>
                      {camion.carteGrise.nombrePlace || "N/A"}
                    </TableCell>
                    <TableCell>
                      <strong>Puissance Fiscale</strong>
                    </TableCell>
                    <TableCell>
                      {camion.carteGrise.puissanceFiscale || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Énergie</strong>
                    </TableCell>
                    <TableCell>{camion.carteGrise.energie || "N/A"}</TableCell>
                    <TableCell>
                      <strong>Propriétaire</strong>
                    </TableCell>
                    <TableCell>
                      {camion.carteGrise.proprietaire || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Poids à Vide</strong>
                    </TableCell>
                    <TableCell>
                      {camion.carteGrise.poidsVide || "N/A"} kg
                    </TableCell>
                    <TableCell>
                      <strong>Poids Autorisé</strong>
                    </TableCell>
                    <TableCell>
                      {camion.carteGrise.poidsAutorise || "N/A"} kg
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Date de Délivrance</strong>
                    </TableCell>
                    <TableCell colSpan={3}>
                      {camion.carteGrise.dateDelivrance || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Photo centrée en dessous */}
            {camion.carteGrise.photoCarteGrise && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={`data:image/jpeg;base64,${camion.carteGrise.photoCarteGrise}`}
                  alt="Carte Grise"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No Carte Grise information available
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderAssurance = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Assurance</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {camion.assurance ? (
          <>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Compagnie</strong>
                    </TableCell>
                    <TableCell>{camion.assurance.company || "N/A"}</TableCell>
                    <TableCell>
                      <strong>Numéro Contrat</strong>
                    </TableCell>
                    <TableCell>
                      {camion.assurance.numeroContrat || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Type Couverture</strong>
                    </TableCell>
                    <TableCell>
                      {camion.assurance.typeCouverture || "N/A"}
                    </TableCell>
                    <TableCell>
                      <strong>Montant</strong>
                    </TableCell>
                    <TableCell>
                      {camion.assurance.montant || "N/A"} DH
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Prime Annuelle</strong>
                    </TableCell>
                    <TableCell>
                      {camion.assurance.primeAnnuelle || "N/A"} DH
                    </TableCell>
                    <TableCell>
                      <strong>Numéro Carte Verte</strong>
                    </TableCell>
                    <TableCell>
                      {camion.assurance.numCarteVerte || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Date Début</strong>
                    </TableCell>
                    <TableCell>{camion.assurance.dateDebut || "N/A"}</TableCell>
                    <TableCell>
                      <strong>Date Expiration</strong>
                    </TableCell>
                    <TableCell>
                      {camion.assurance.dateExpiration || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Active</strong>
                    </TableCell>
                    <TableCell colSpan={3}>
                      {camion.assurance.active ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Inactive" color="default" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Photo affichée en dessous */}
            {camion.assurance.photoAssurance && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={`data:image/jpeg;base64,${camion.assurance.photoAssurance}`}
                  alt="Assurance"
                  style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
                />
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No assurance information available
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderEntretiens = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Entretiens ({camion.entretiens?.length || 0})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {camion.entretiens?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Coût</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date Prochain Entretien</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {camion.entretiens.map((entretien, index) => (
                  <TableRow key={index}>
                    <TableCell>{entretien.dateEntretien || "N/A"}</TableCell>
                    <TableCell>{entretien.typeEntretien || "N/A"}</TableCell>
                    <TableCell>
                      {entretien.cout ? `${entretien.cout} DH` : "N/A"}
                    </TableCell>
                    <TableCell>{entretien.description || "N/A"}</TableCell>
                    <TableCell>
                      {entretien.dateProchainEntretien || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entretien.statusEntretien}
                        color={
                          entretien.statusEntretien === "PROGRAMME"
                            ? "primary"
                            : entretien.statusEntretien === "REALISE"
                              ? "success"
                              : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No maintenance records available
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderCarburants = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Carburants ({camion.carburants?.length || 0})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {camion.carburants?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Quantité (L)</TableCell>
                  <TableCell>Prix/Litre</TableCell>
                  <TableCell>Montant Total</TableCell>
                  <TableCell>Kilométrage</TableCell>
                  <TableCell>Consommation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {camion.carburants.map((carburant, index) => (
                  <TableRow key={index}>
                    <TableCell>{carburant.dateRemplissage || "N/A"}</TableCell>
                    <TableCell>
                      {carburant.typeCarburant?.type || "N/A"}
                    </TableCell>
                    <TableCell>{carburant.quantiteLitres || "N/A"}</TableCell>
                    <TableCell>
                      {carburant.prixParLitre
                        ? `${carburant.prixParLitre} DH`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {carburant.montantActuel
                        ? `${carburant.montantActuel} DH`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {carburant.kilometrageActuel || "N/A"}
                    </TableCell>
                    <TableCell>{carburant.consommation || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No fuel records available
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, height: "80vh" } }}
    >
      <DialogTitle
        sx={{ bgcolor: "#f5f5f5", borderBottom: 1, borderColor: "divider" }}
      >
        <Typography variant="h6" component="div">
          Détails du Camion {immatriculation}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, overflowY: "auto" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : camion ? (
          <>
            {renderBasicInfo()}
            {renderCarteGrise()}
            {renderAssurance()}
            {renderEntretiens()}
            {renderCarburants()}
          </>
        ) : (
          <Typography variant="body1">No truck data available</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          sx={{ borderRadius: 2 }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
