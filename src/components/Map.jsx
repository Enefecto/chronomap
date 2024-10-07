import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ apiUsername }) => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador

  // Referencia para el mapa
  const mapRef = useRef(null);

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

  // Función para mover el mapa a las coordenadas de una ciudad
  const flyToCity = (lat, lng) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([lat, lng], 10); // '10' es el nivel de zoom
    }
  };

  // Filtrar ciudades en función del texto del buscador
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
            <Marker key={index} position={[city.lat, city.lng]}>
              <Popup>{city.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Sidebar con la lista de ciudades */}
      <div className="md:col-span-1 bg-slate-700 text-white p-4 overflow-y-auto order-2 md:order-none">
        <h1 className="text-4xl text-center border-b-2 border-red-600 pb-1 mb-5">
          Chrono Map de Chile
        </h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar ciudad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 text-black"
        />

        {/* Lista de ciudades filtradas */}
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
