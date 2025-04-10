import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configurer les icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LiveMap = ({ center, markers, polyline }) => {
  // Création d'icônes personnalisées
  const createCustomIcon = (color = 'blue') =>
    new L.Icon({
      iconUrl: color === 'red'
        ? 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000'
        : 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0000FF',
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -40],
    });

  // Mémoisation des marqueurs
  const mapMarkers = useMemo(() => markers.map((marker, index) => (
    <Marker
      key={index}
      position={marker.position}
      icon={createCustomIcon(marker.color)}
    >
      <Popup>{marker.title}</Popup>
    </Marker>
  )), [markers]);

  // Mémoisation de la polyline
  const routePolyline = useMemo(() => {
    if (polyline.length < 2) return null;
    return (
      <Polyline 
        positions={polyline} 
        color="blue" 
        weight={3} 
        opacity={0.7} 
      />
    );
  }, [polyline]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      key={JSON.stringify(center)} // Force re-render lorsque le centre change
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapMarkers}
      {routePolyline}
    </MapContainer>
  );
};

export default React.memo(LiveMap);






