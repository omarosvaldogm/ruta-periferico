import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución para íconos rotos
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para centrar el mapa en la posición del usuario
function CentrarEnPosicion({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);

  return null;
}

// Componente del botón "Centrar en mí"
function BotonCentrar({ onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '8px',
        backgroundColor: 'white',
        border: '2px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Centrar en mí
    </button>
  );
}

function MapaConRuta() {
  const [ruta, setRuta] = useState([]);
  const [posicionUsuario, setPosicionUsuario] = useState(null);
  const [errorGeolocalizacion, setErrorGeolocalizacion] = useState(null);
  const mapRef = useRef();

  // Coordenadas de ejemplo (Villahermosa)
  const estaciones = [
    { nombre: "Cárcamo de Tamulté regreso", latlng: [17.9654, -92.9596] },
    { nombre: "Cárcamo de Tamulté ida", latlng: [17.965222, -92.959778] },
    
    { nombre: "Recinto Memorial", latlng: [17.964611, -92.955972] },
    { nombre: "Plaza Villahermosa regreso", latlng: [17.964917, -92.953000] },
    { nombre: "Plaza Villahermosa ida", latlng: [17.964637, -92.953030] },
    { nombre: "Costco regreso", latlng: [17.966861, -92.930639] },
    { nombre: "Costco ida", latlng: [17.966722, -92.931750] },
    { nombre: "Costco", latlng: [17.966861, -92.930639] },
    { nombre: "Altabrisa regreso", latlng: [17.968028, -92.940722] },
    { nombre: "Altabrisa ida", latlng: [17.967861, -92.941278] },
    { nombre: "Parque Ignacio Rubio", latlng: [17.968528, -92.944806] },
    { nombre: "Fovisste regreso", latlng: [17.968778, -92.947083] },
    { nombre: "Fovisste ida", latlng: [17.968361, -92.945306] },
    { nombre: "Fovisste 2 ida", latlng: [17.968556, -92.946972] },
    { nombre: "Colegio Arjí", latlng: [17.968167, -92.949028] },
    { nombre: "Santandreu", latlng: [17.966139, -92.963028] },
    { nombre: "Puente Llantas Cuyuso", latlng: [17.967806, -92.966194] },
    { nombre: "Soriana San Joaquín", latlng: [17.970944, -92.970083] },
    { nombre: "Puente CONALEP regreso", latlng: [17.968222, -92.927278] },
    { nombre: "Puente CONALEP ida", latlng: [17.968028, -92.927056] },
  ];

  // Obtener ruta desde OSRM
  useEffect(() => {
    const obtenerRuta = async () => {
      const coordenadas = estaciones.map(e => `${e.latlng[1]},${e.latlng[0]}`).join(';');
      
      try {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${coordenadas}?overview=full&geometries=geojson`
        );
        setRuta(response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
      } catch (error) {
        console.error("Error al obtener la ruta:", error);
      }
    };

    obtenerRuta();
  }, []);

  // Configurar geolocalización
  useEffect(() => {
    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        setPosicionUsuario({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setErrorGeolocalizacion(null);
      },
      (error) => {
        setErrorGeolocalizacion(error.message);
        console.error("Error de geolocalización:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watcherId);
  }, []);

  // Calcular estación más cercana
  const estacionMasCercana = posicionUsuario 
    ? estaciones.reduce((closest, estacion) => {
        const distancia = calcularDistancia(posicionUsuario, estacion.latlng);
        return distancia < closest.distancia ? { estacion, distancia } : closest;
      }, { estacion: null, distancia: Infinity })
    : null;

  function calcularDistancia(pos1, pos2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (pos2[0] - pos1.lat) * Math.PI / 180;
    const dLon = (pos2[1] - pos1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const handleCentrarEnUsuario = () => {
    if (posicionUsuario && mapRef.current) {
      mapRef.current.flyTo([posicionUsuario.lat, posicionUsuario.lng], 16);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[17.9654, -92.9596]} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Línea de la ruta */}
        {ruta.length > 0 && (
          <Polyline 
            positions={ruta} 
            color="blue" 
            weight={5}
          />
        )}
        
        {/* Marcadores de estaciones */}
        {estaciones.map((estacion, index) => (
          <Marker key={`estacion-${index}`} position={estacion.latlng}>
            <Popup>{estacion.nombre}</Popup>
          </Marker>
        ))}
        
        {/* Marcador de posición del usuario */}
        {posicionUsuario && (
          <Marker position={[posicionUsuario.lat, posicionUsuario.lng]}>
            <Popup>
              Tu posición actual
              {estacionMasCercana && (
                <div>
                  <br />
                  Próxima estación: {estacionMasCercana.estacion.nombre} 
                  <br />
                  ({estacionMasCercana.distancia.toFixed(2)} km)
                </div>
              )}
            </Popup>
          </Marker>
        )}
        
        <CentrarEnPosicion position={posicionUsuario ? [posicionUsuario.lat, posicionUsuario.lng] : null} />
      </MapContainer>
      
      <BotonCentrar onClick={handleCentrarEnUsuario} />
      
      {errorGeolocalizacion && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          padding: '8px',
          backgroundColor: 'white',
          border: '2px solid red',
          borderRadius: '4px'
        }}>
          Error de geolocalización: {errorGeolocalizacion}
        </div>
      )}
    </div>
  );
}

export default MapaConRuta;