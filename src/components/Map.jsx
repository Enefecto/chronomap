import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importar y activar el paquete de compatibilidad para los íconos
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const MapComponent = () => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Referencia para el mapa
  const mapRef = useRef(null);

  // Obtener los datos de las ciudades de la API
  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch(
        'https://geonames-proxy.destyght-dev.workers.dev/searchJSON?country=CL&featureClass=P&maxRows=50&orderby=population'
      );
      const data = await response.json();
      setCities(data.geonames);

      console.log(data.geonames);
    };

    fetchCities();
  }, []);

  // Función para mover el mapa a las coordenadas de una ciudad
  const flyToCity = (lat, lng) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([lat, lng], 10); // '10' es el nivel de zoom
    }
  };

  // Filtro de ciudades para el buscador
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-4 h-screen w-full">
      {/* Mapa */}
      <div className="md:col-span-3 row-span-1 md:row-span-2 order-1 md:order-none">
        <MapContainer
          center={[-33.4489, -70.6693]} // Centrado en Santiago de Chile
          zoom={5}
          className="w-full h-full md:h-screen" // Asegura la altura en pantallas grandes y pequeñas
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredCities.map((city, index) => (
            <Marker
              key={index}
              position={[city.lat, city.lng]}
              eventHandlers={{
                click: () => flyToCity(city.lat, city.lng), // Volamos a la ciudad cuando se hace clic en el marcador
              }}
            >
              <Popup>
                <div>
                  <p>{city.name}</p>
                  <button
                    className="mt-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-700"
                    onClick={() => window.location.href = `/history/${city.name}`}
                  >
                    Leer Historia
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Sidebar con la lista de ciudades */}
      <div className="md:col-span-1 bg-slate-700 text-white p-4 overflow-y-auto order-2 md:order-none">
        <h1 className="text-4xl text-center border-b-2 border-red-600 pb-1 mb-5">
          Chrono Mapa de Chile
        </h1>
        {/* Input para el buscador */}
        <input
          type="text"
          placeholder="Buscar ciudad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 rounded text-black"
        />
        <ul>
          {filteredCities.map((city, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-yellow-300 my-2"
              onClick={() => flyToCity(city.lat, city.lng)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
