import React, { useState, useEffect, useCallback } from 'react';
import trajectService from '../service/traject/trajectService';
import { Container, Typography, Grid, Paper, Box, CircularProgress, Alert, Chip, Divider, IconButton, Tooltip, List, ListItem, ListItemText, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Refresh, LocationOn, Person, History } from '@mui/icons-material';
import LiveMap from './MapView';

const Traject = () => {
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverHistory, setDriverHistory] = useState([]);
  const [loading, setLoading] = useState({ drivers: false, history: false });
  const [error, setError] = useState(null);
  const [realTimeLocation, setRealTimeLocation] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // New state for history toggle
  const [mapCenter, setMapCenter] = useState(null); // New state to control map center
  
  // Get current position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(pos);
          setMapCenter(pos); // Set initial map center to current position
        },
        (error) => {
          console.error("Error getting current position:", error);
          const fallback = { lat: 33.5731, lng: -7.5898 }; // Casablanca fallback
          setCurrentPosition(fallback);
          setMapCenter(fallback);
        }
      );
    } else {
      const fallback = { lat: 33.5731, lng: -7.5898 }; // Fallback
      setCurrentPosition(fallback);
      setMapCenter(fallback);
    }
  }, []);

  // Fetch active drivers
  const fetchActiveDrivers = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, drivers: true }));
      const response = await trajectService.getActiveDrivers();
      setActiveDrivers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, drivers: false }));
    }
  }, []);

  // Handle driver selection
  useEffect(() => {
    if (selectedDriver) {
      const fetchDriverHistory = async (cni) => {
        try {
          setLoading(prev => ({ ...prev, history: true }));
          const response = await trajectService.getDriverHistory(cni);
          setDriverHistory(response.data);
          
          // If there's history, center map on the latest position
          if (response.data.length > 0) {
            const latest = response.data[0];
            setMapCenter({
              lat: parseFloat(latest.latitude),
              lng: parseFloat(latest.longitude)
            });
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(prev => ({ ...prev, history: false }));
        }
      };
      fetchDriverHistory(selectedDriver.cni);
    }
  }, [selectedDriver]);

  // Initialize WebSocket connection
  useEffect(() => {
    const wsConnection = trajectService.initializeWebSocket(
      (update) => {
        setRealTimeLocation(update);
        setWsConnected(true);
        if (selectedDriver && update.driverId === selectedDriver.cni) {
          setDriverHistory(prev => [update, ...prev]);
          // Center map on new real-time position
          setMapCenter({
            lat: parseFloat(update.latitude),
            lng: parseFloat(update.longitude)
          });
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
        setError('Connection to real-time service interrupted');
        setWsConnected(false);
      }
    );

    return () => {
      wsConnection.disconnect();
      setWsConnected(false);
    };
  }, [selectedDriver]);

  const getMapMarkers = () => {
    const markers = [];
    if (currentPosition) {
      markers.push({
        position: currentPosition,
        title: 'Your Location',
        color: 'blue'
      });
    }
    if (selectedDriver) {
      const latestLocation = realTimeLocation?.driverId === selectedDriver.cni ? realTimeLocation : driverHistory[0];
      if (latestLocation) {
        markers.push({
          position: {
            lat: parseFloat(latestLocation.latitude),
            lng: parseFloat(latestLocation.longitude)
          },
          title: `${selectedDriver.nom} ${selectedDriver.prenom}`,
          color: 'red'
        });
      }
    }
    return markers;
  };

  const getPolylinePositions = () => {
    if (!showHistory || !selectedDriver || driverHistory.length === 0) return [];
    
    return driverHistory.map(location => ({
      lat: parseFloat(location.latitude),
      lng: parseFloat(location.longitude)
    }));
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Driver Tracking
          {wsConnected && (
            <Chip 
              label="Live" 
              color="success" 
              size="small" 
              sx={{ ml: 2 }} 
              icon={<LocationOn fontSize="small" />}
            />
          )}
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={fetchActiveDrivers} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Active Drivers Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Active Drivers</Typography>
              {loading.drivers && <CircularProgress size={24} />}
            </Box>
            <Divider />
            <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
              {activeDrivers.length > 0 ? (
                <List>
                  {activeDrivers.map((driver) => (
                    <ListItem 
                      key={driver.cni}
                      button
                      selected={selectedDriver?.cni === driver.cni}
                      onClick={() => setSelectedDriver(driver)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          }
                        },
                      }}
                    >
                      <ListItemText
                        primary={`${driver.nom} ${driver.prenom}`}
                        secondary={
                          <>
                            <Box component="span" display="block">CNI: {driver.cni}</Box>
                            {realTimeLocation?.driverId === driver.cni && (
                              <Box component="span" display="flex" alignItems="center">
                                <LocationOn color="error" fontSize="small" sx={{ mr: 0.5 }} />
                                Latest update: {new Date(realTimeLocation.timestamp).toLocaleTimeString()}
                              </Box>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box p={2}>
                  <Typography color="text.secondary">
                    {loading.drivers ? 'Loading...' : 'No active drivers found'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Driver Details Column */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3} direction="column">
            {/* Driver Information Card */}
            <Grid item>
              <Paper elevation={3}>
                <Box p={2}>
                  {selectedDriver ? (
                    <>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Person color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {selectedDriver.nom} {selectedDriver.prenom}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        CNI: {selectedDriver.cni}
                      </Typography>
                      {realTimeLocation?.driverId === selectedDriver.cni && (
                        <Box mt={1}>
                          <Chip 
                            label={`Current location: ${realTimeLocation.latitude}, ${realTimeLocation.longitude}`}
                            color="info"
                            size="small"
                            icon={<LocationOn fontSize="small" />}
                          />
                        </Box>
                      )}
                      <Box mt={2}>
                        <Button
                          variant="outlined"
                          startIcon={<History />}
                          onClick={toggleHistory}
                          disabled={driverHistory.length === 0}
                        >
                          {showHistory ? 'Hide History' : 'Show History'}
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      Select a driver to view details
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Location History Card */}
            <Grid item>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    Location History
                  </Typography>
                  {selectedDriver ? (
                    <>
                      {loading.history ? (
                        <Box display="flex" justifyContent="center" py={4}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                          {driverHistory.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Time</TableCell>
                                  <TableCell>Latitude</TableCell>
                                  <TableCell>Longitude</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {driverHistory.map((location, index) => (
                                  <TableRow 
                                    key={index}
                                    sx={{
                                      backgroundColor: index === 0 && realTimeLocation?.driverId === selectedDriver.cni ? 
                                        'rgba(0, 0, 255, 0.08)' : 'inherit'
                                    }}
                                  >
                                    <TableCell>
                                      {new Date(location.timestamp).toLocaleString()}
                                    </TableCell>
                                    <TableCell>{location.latitude}</TableCell>
                                    <TableCell>{location.longitude}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography color="text.secondary">
                              No location history available
                            </Typography>
                          )}
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      Select a driver to view location history
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
          
      {/* Map Column */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ height: '600px' }}>
          <Box p={2}>
            <Typography variant="h6">Map</Typography>
            <Box sx={{ height: '550px', width: '100%', mt: 2 }}>
              <LiveMap 
                center={mapCenter || currentPosition || { lat: 33.5731, lng: -7.5898 }} 
                markers={getMapMarkers()} 
                polyline={showHistory ? getPolylinePositions() : []}
              />
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Container>
  );
};

export default React.memo(Traject);