import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importar y activar el paquete de compatibilidad para los íconos
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Datos de ejemplo (puedes reemplazar con tu JSON completo)
const cityData = {
  "Santiago": {
    "1818": {
      "Historia": "El 12 de febrero de 1818, se firmó la Declaración de Independencia de Chile en Santiago."
    },
    "Relatos": {
      "Mitos": "Se dice que el Mapocho es un río encantado, habitado por espíritus que protegen la ciudad.",
      "Leyendas": "La leyenda de la Llorona, quien llora por sus hijos perdidos, se escucha cerca del río Mapocho.",
      "Cuentos": "El cuento de la Casa de la Moneda, donde se dice que aparecen fantasmas de antiguos funcionarios.",
      "Chismes": "Se dice que en el Palacio de La Moneda, los fantasmas de antiguos presidentes aún vagan por los pasillos."
    }
  },
  "Puente Alto": {
    "1980": {
      "Historia": "Puente Alto se convirtió en una comuna con un crecimiento demográfico significativo en las décadas de 1980 y 1990."
    },
    "Relatos": {
      "Leyendas": "La leyenda de un tesoro escondido en las montañas cercanas a la ciudad.",
      "Cuentos": "El cuento de un viejo puente que aparece solo en las noches de luna llena."
    }
  },
  "Antofagasta": {
    "1879": {
      "Historia": "Antofagasta fue ocupada por tropas chilenas al inicio de la Guerra del Pacífico."
    },
    "Relatos": {
      "Mitos": "La leyenda de los tesoros escondidos en el desierto que atraen a buscadores.",
      "Chismes": "Los locales aseguran que las dunas del desierto guardan secretos de civilizaciones antiguas."
    }
  },
  "Viña del Mar": {
    "1930": {
      "Historia": "El Casino Municipal de Viña del Mar fue inaugurado en 1930."
    },
    "Relatos": {
      "Mitos": "La leyenda de la Sirena de Viña, que atrae a los navegantes hacia su perdición.",
      "Chismes": "Los residentes cuentan que el casino esconde un pasadizo secreto hacia el mar."
    }
  },
  "Valparaíso": {
    "1906": {
      "Historia": "El devastador terremoto de Valparaíso en 1906 destruyó gran parte de la ciudad."
    },
    "Relatos": {
      "Leyendas": "La leyenda del Caleuche, un barco fantasma que navega en las aguas cercanas.",
      "Chismes": "Se rumorea que en los cerros, los gatos negros son los guardianes de los secretos."
    }
  },
  "Talcahuano": {
    "2010": {
      "Historia": "Talcahuano sufrió severos daños durante el terremoto y tsunami de 2010."
    },
    "Relatos": {
      "Mitos": "Se dice que en el puerto habita un espíritu marino que cuida de los pescadores."
    }
  },
  "San Bernardo": {
    "1990": {
      "Historia": "San Bernardo ha experimentado un crecimiento poblacional significativo desde los años 90."
    },
    "Relatos": {
      "Leyendas": "La leyenda de la Virgen de San Bernardo, que protege a la ciudad."
    }
  },
  "Port Montt": {
    "1853": {
      "Historia": "Fundación de Puerto Montt como una colonia alemana."
    },
    "Relatos": {
      "Mitos": "Se dice que los espíritus de antiguos colonos aún vagan por las calles."
    }
  },
  "Temuco": {
    "1881": {
      "Historia": "Temuco fue fundada como una fortaleza durante la ocupación de La Araucanía."
    },
    "Relatos": {
      "Mitos": "La leyenda de la Pincoya, quien danza en las aguas y trae la abundancia a los pescadores.",
      "Chismes": "Los ancianos cuentan que en las noches de luna llena, se pueden escuchar cantos lejanos."
    }
  },
  "Concepción": {
    "1960": {
      "Historia": "El terremoto de Valdivia en 1960 afectó gravemente a Concepción."
    },
    "Relatos": {
      "Mitos": "Se dice que la Huasa, una mujer guerrera, protege a la ciudad."
    }
  },
  "Arica": {
    "1868": {
      "Historia": "Arica sufrió un terremoto y tsunami en 1868."
    },
    "Relatos": {
      "Leyendas": "Se dice que en la cima del morro habita un espíritu protector."
    }
  },
  "Rancagua": {
    "1814": {
      "Historia": "La Batalla de Rancagua fue un evento crucial en la lucha por la independencia de Chile."
    },
    "Relatos": {
      "Mitos": "La leyenda del guardián de la ciudad que aparece en momentos de peligro."
    }
  },
  "La Pintana": {
    "1990": {
      "Historia": "La Pintana se ha desarrollado significativamente desde los años 90."
    },
    "Relatos": {
      "Chismes": "Los jóvenes dicen que hay un lugar en la comuna donde se pueden escuchar susurros."
    }
  },
  "Talca": {
    "1920": {
      "Historia": "Talca se estableció como un importante centro agrícola en la región central de Chile."
    },
    "Relatos": {
      "Mitos": "Se cuenta que hay un espíritu que cuida de las cosechas de la zona."
    }
  },
  "Iquique": {
    "1879": {
      "Historia": "La Batalla Naval de Iquique tuvo lugar frente a sus costas."
    },
    "Relatos": {
      "Mitos": "La leyenda del tesoro escondido de un pirata que navega por la costa."
    }
  },
  "Calama": {
    "2003": {
      "Historia": "Calama es conocida por ser el centro de la minería del cobre en Chile."
    },
    "Relatos": {
      "Chismes": "Los habitantes cuentan que en las montañas cercanas se encuentran ciudades perdidas."
    }
  },
  "Coquimbo": {
    "1830": {
      "Historia": "Coquimbo ha sido un puerto clave desde su fundación."
    },
    "Relatos": {
      "Mitos": "Se dice que las olas del mar guardan secretos de antiguos navegantes."
    }
  },
  "La Serena": {
    "1544": {
      "Historia": "Fundación de La Serena, una de las ciudades más antiguas de Chile."
    },
    "Relatos": {
      "Leyendas": "La leyenda de la Virgen de La Serena, que protege a los navegantes."
    }
  },
  "Chillán": {
    "1939": {
      "Historia": "El terremoto de Chillán en 1939 fue uno de los más devastadores de Chile."
    },
    "Relatos": {
      "Chismes": "Los locales creen que los espíritus de las víctimas aún vagan por las calles."
    }
  },
  "Osorno": {
    "1850": {
      "Historia": "Osorno se estableció como un centro agrícola importante en el sur de Chile."
    },
    "Relatos": {
      "Mitos": "Se dice que el río Rahue está habitado por espíritus que protegen el agua."
    }
  },
  "Valdivia": {
    "1960": {
      "Historia": "El terremoto de Valdivia de 1960, el más fuerte registrado, afectó gravemente a la ciudad."
    },
    "Relatos": {
      "Leyendas": "La leyenda del río Calle-Calle, que esconde misterios bajo sus aguas."
    }
  },
  "Quilpué": {
    "2000": {
      "Historia": "Quilpué ha crecido rápidamente como una ciudad dormitorio de Valparaíso."
    },
    "Relatos": {
      "Mitos": "Los habitantes creen que los cerros cercanos son hogar de espíritus guardianes."
    }
  },
  "Copiapó": {
    "1850": {
      "Historia": "Copiapó es conocido como el centro de la minería del cobre."
    },
    "Relatos": {
      "Chismes": "Se dice que hay túneles secretos que conectan las minas con la ciudad."
    }
  },
  "Los Ángeles": {
    "1885": {
      "Historia": "Los Ángeles se fundó como un centro agrícola en la región del Bío Bío."
    },
    "Relatos": {
      "Mitos": "La leyenda de un espíritu que aparece en el río Biobío durante las noches de tormenta."
    }
  },
  "Punta Arenas": {
    "1848": {
      "Historia": "Punta Arenas fue fundada como un asentamiento estratégico para la navegación."
    },
    "Relatos": {
      "Leyendas": "Se dice que el estrecho de Magallanes es hogar de criaturas mitológicas."
    }
  },
  "Alto Hospicio": {
    "1998": {
      "Historia": "Alto Hospicio se estableció como una ciudad dormitorio de Iquique."
    },
    "Relatos": {
      "Chismes": "Los locales afirman que hay lugares donde el tiempo se detiene."
    }
  },
  "Lo Prado": {
    "1990": {
      "Historia": "Lo Prado ha crecido como una comuna residencial en la Región Metropolitana."
    },
    "Relatos": {
      "Mitos": "La leyenda de un árbol que concede deseos a quienes lo tocan."
    }
  },
  "Curicó": {
    "2000": {
      "Historia": "Curicó es famoso por su producción de vino y agricultura."
    },
    "Relatos": {
      "Chismes": "Los viticultores cuentan que hay espíritus que cuidan los viñedos."
    }
  },
  "Villa Alemana": {
    "2000": {
      "Historia": "Villa Alemana ha crecido como una ciudad dormitorio de Viña del Mar."
    },
    "Relatos": {
      "Mitos": "Los habitantes dicen que las colinas son hogar de leyendas ancestrales."
    }
  },
  "Coronel": {
    "2010": {
      "Historia": "Coronel ha crecido como un puerto importante en la región del Biobío."
    },
    "Relatos": {
      "Chismes": "Se rumorea que hay un barco fantasma que aparece en el puerto."
    }
  },
  "San Antonio": {
    "2000": {
      "Historia": "San Antonio es uno de los puertos más importantes de Chile."
    },
    "Relatos": {
      "Mitos": "Se dice que los pescadores ven luces misteriosas en el mar."
    }
  },
  "Chiguayante": {
    "1990": {
      "Historia": "Chiguayante ha crecido como una comuna residencial en la región del Bío Bío."
    },
    "Relatos": {
      "Chismes": "Los locales afirman que hay un túnel que conecta con Concepción."
    }
  },
  "Ovalle": {
    "1850": {
      "Historia": "Ovalle es conocido por su producción agrícola en la Región de Coquimbo."
    },
    "Relatos": {
      "Mitos": "La leyenda de un espíritu que protege los cultivos de la zona."
    }
  },
  "Linares": {
    "1900": {
      "Historia": "Linares es conocido por su producción agrícola y su importancia en el sur de Chile."
    },
    "Relatos": {
      "Chismes": "Los habitantes cuentan que hay un árbol que cumple deseos."
    }
  },
  "Quillota": {
    "1800": {
      "Historia": "Quillota ha sido un importante centro agrícola desde la época colonial."
    },
    "Relatos": {
      "Leyendas": "La leyenda de los indios que protegen las tierras alrededor de la ciudad."
    }
  },
  "Peñaflor": {
    "1990": {
      "Historia": "Peñaflor ha crecido rápidamente como una comuna en la Región Metropolitana."
    },
    "Relatos": {
      "Mitos": "Se dice que el río que atraviesa la ciudad tiene poderes curativos."
    }
  },
  "Melipilla": {
    "2000": {
      "Historia": "Melipilla es conocida por su producción agrícola y vitivinícola."
    },
    "Relatos": {
      "Chismes": "Los locales creen que hay casas embrujadas en la ciudad."
    }
  },
  "San Felipe": {
    "1800": {
      "Historia": "San Felipe ha sido un centro agrícola importante desde la época colonial."
    },
    "Relatos": {
      "Mitos": "La leyenda de un tesoro escondido en las montañas cercanas."
    }
  },
  "Los Andes": {
    "1800": {
      "Historia": "Los Andes se ha desarrollado como un centro agrícola y turístico en la región."
    },
    "Relatos": {
      "Chismes": "Los locales cuentan que hay caminos secretos en las montañas."
    }
  },
  "Buin": {
    "2000": {
      "Historia": "Buin ha crecido como una comuna agrícola en la Región Metropolitana."
    },
    "Relatos": {
      "Mitos": "La leyenda de un espíritu que protege las cosechas de la zona."
    }
  },
  "Talagante": {
    "2000": {
      "Historia": "Talagante ha sido un centro agrícola y residencial en la Región Metropolitana."
    },
    "Relatos": {
      "Chismes": "Los locales creen que hay fantasmas en las antiguas casas coloniales."
    }
  },
  "Lota": {
    "2010": {
      "Historia": "Lota ha sido un importante centro minero y portuario."
    },
    "Relatos": {
      "Mitos": "Se dice que los mineros ven sombras en las minas."
    }
  },
  "Hacienda La Calera": {
    "2000": {
      "Historia": "Hacienda La Calera es conocida por su producción agrícola y su historia colonial."
    },
    "Relatos": {
      "Chismes": "Los residentes creen que hay un espíritu que cuida la hacienda."
    }
  },
  "Tomé": {
    "2010": {
      "Historia": "Tomé es conocida por su puerto y su producción agrícola."
    },
    "Relatos": {
      "Mitos": "Se dice que las olas del mar traen mensajes de los ancestros."
    }
  },
  "Penco": {
    "1800": {
      "Historia": "Penco ha sido un puerto clave desde la época colonial."
    },
    "Relatos": {
      "Chismes": "Los pescadores dicen que en las noches se oyen susurros en el mar."
    }
  },
  "Coyhaique": {
    "1950": {
      "Historia": "Coyhaique se estableció como un centro agrícola en la Patagonia chilena."
    },
    "Relatos": {
      "Mitos": "Se dice que el río Coyhaique tiene poderes curativos."
    }
  },
  "Vallenar": {
    "1800": {
      "Historia": "Vallenar ha sido un centro agrícola y minero en el norte de Chile."
    },
    "Relatos": {
      "Chismes": "Los locales creen que hay tesoros escondidos en las montañas."
    }
  },
  "Angol": {
    "1800": {
      "Historia": "Angol es conocida por su historia mapuche y su desarrollo agrícola."
    },
    "Relatos": {
      "Mitos": "La leyenda de un espíritu que protege a la ciudad y sus habitantes."
    }
  },
  "Rengo": {
    "2000": {
      "Historia": "Rengo ha crecido como una comuna agrícola en la Región de O'Higgins."
    },
    "Relatos": {
      "Chismes": "Los habitantes dicen que hay un árbol en el centro de la plaza que concede deseos."
    }
  },
  "Constitución": {
    "1960": {
      "Historia": "Constitución sufrió daños significativos durante el terremoto de 1960."
    },
    "Relatos": {
      "Leyendas": "Se cuenta que el río Maule tiene secretos escondidos en sus aguas."
    }
  }
};

const MapComponent = () => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Nueva categoría
  const [loading, setLoading] = useState(true);

  // Referencia para el mapa
  const mapRef = useRef(null);

  // Obtener los datos de las ciudades de la API
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const response = await fetch(
        'https://geonames-proxy.destyght-dev.workers.dev/searchJSON?country=CL&featureClass=P&maxRows=50&orderby=population'
      );
      const data = await response.json();
      setCities(data.geonames);
      setLoading(false);
    };
    fetchCities();
  }, []);

  // Función para mover el mapa a las coordenadas de una ciudad
  const flyToCity = (lat, lng) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([lat, lng], 10);
    }
  };

  // Filtrar ciudades según el término de búsqueda y la categoría seleccionada
  const filteredCities = cities.filter(city => {

    const cityName = city.name;

    // Verificar coincidencia de término de búsqueda en el nombre de la ciudad
    const matchesSearchTerm = cityName.toLowerCase().includes(searchTerm.toLowerCase());

    // Verificar existencia de la categoría seleccionada en los datos de la ciudad
    const hasCategory = selectedCategory === "Historia"
      ? Object.values(cityData[cityName] || {}).some(yearData => yearData?.Historia)
      : cityData[cityName]?.Relatos?.[selectedCategory];

    return matchesSearchTerm && (selectedCategory ? hasCategory : true);
  });



  return (
    <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-4 h-screen w-full">
      {/* Mapa */}
      <div className="md:col-span-3 row-span-1 md:row-span-2 order-1 md:order-none">
        <MapContainer
          center={[-33.4489, -70.6693]}
          zoom={5}
          className="w-full h-full md:h-screen"
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
                click: () => flyToCity(city.lat, city.lng),
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
                  {selectedCategory !== '' && selectedCategory !== 'Historia' ? <p>{cityData[city.name]?.Relatos[selectedCategory]}</p> : ''}
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
              {/* SVG de carga */}
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

            {/* Selector de categoría */}
            <select
              className="w-full p-2 mb-4 rounded text-black"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option value="Historia">Historia</option>
              <option value="Mitos">Mitos</option>
              <option value="Leyendas">Leyendas</option>
              <option value="Cuentos">Cuentos</option>
              <option value="Chismes">Chismes</option>
            </select>

            <ul>
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-yellow-300 my-2"
                  onClick={() => flyToCity(city.lat, city.lng)}
                >
                  {city.name}
                </li>
              ))
            ) : (
              <li className='my-2'>Ninguna ciudad encontrada :(</li>
            )}

            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
