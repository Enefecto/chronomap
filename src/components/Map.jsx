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
  const [loading, setLoading] = useState(true); // Estado de carga

  // Referencia para el mapa
  const mapRef = useRef(null);

  // Obtener los datos de las ciudades de la API
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true); // Iniciar carga
      const response = await fetch(
        'https://geonames-proxy.destyght-dev.workers.dev/searchJSON?country=CL&featureClass=P&maxRows=50&orderby=population'
      );
      const data = await response.json();
      setCities(data.geonames);
      setLoading(false); // Terminar carga
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
        
        {/* Mostrar el indicador de carga si loading es true */}
        {loading ? (
          <div className="flex justify-center items-center h-full gap-2">
            <div role="status">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
            <p>Cargando ciudades...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
