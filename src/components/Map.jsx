import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  return (
    <MapContainer center={[-33.4489, -70.6693]} zoom={6} className="w-full h-[500px]">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[-33.4489, -70.6693]}>
        <Popup>
          Santiago de Chile<br /> Capital del país.
        </Popup>
      </Marker>
      {/* Puedes agregar más marcadores con diferentes coordenadas */}
    </MapContainer>
  );
};

export default MapComponent;
