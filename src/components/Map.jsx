import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ apiUsername }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch(
        `http://api.geonames.org/searchJSON?country=CL&featureClass=P&maxRows=50&orderby=population&username=${apiUsername}`
      );
      const data = await response.json();
      setCities(data.geonames);
    };

    fetchCities();
  }, [apiUsername]);

  return (
    <MapContainer center={[-33.4489, -70.6693]} zoom={5} className="w-full h-[500px]">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {cities.map((city, index) => (
        <Marker key={index} position={[city.lat, city.lng]}>
          <Popup>
            {city.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
