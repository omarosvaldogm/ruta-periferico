import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

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

// Icono personalizado para la combi del chofer
const combiChoferIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048325.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

function VistaChofer({ rutaId, onParadaRegistrada }) {
  const [posicionActual, setPosicionActual] = useState(null);
  const [estaciones, setEstaciones] = useState([]);
  const [ruta, setRuta] = useState([]);
  const [estacionCercana, setEstacionCercana] = useState(null);
  const [paradaRegistrada, setParadaRegistrada] = useState(false);
  const [historialParadas, setHistorialParadas] = useState([]);
  const mapRef = useRef();

  // Obtener estaciones y ruta
  useEffect(() => {
    const cargarDatosRuta = async () => {
      try {
        // Obtener estaciones (simulado)
        const estacionesEjemplo = [
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
            
        
            // Josue
            { nombre: "Eurocar", latlng: [17.992880, -92.944491]},
            { nombre: "Vips regreso", latlng: [17.995597, -92.941892]},
            { nombre: "Vips ida", latlng: [17.996867, -92.941077]},
            { nombre: "Chedraui selecto ida", latlng: [17.994969, -92.943126]},
            { nombre: "Parque tomas garrido", latlng: [17.997447, -92.939926]},
            { nombre: "Peatonal parque tomas garrido regreso", latlng: [17.998663, -92.938662]},
            { nombre: "Peatonal parque tomas garrido ida", latlng: [17.998925, -92.938948]},
            { nombre: "La venta regreso", latlng: [18.001234, -92.935971]},
            { nombre: "La venta ida", latlng: [18.000769, -92.937145]},
            { nombre: "Parque museo la venta regreso", latlng: [18.001768, -92.934884]},
            { nombre: "Parque museo la venta ida", latlng: [18.002171, -92.934929]},
            { nombre: "Ujat central regreso", latlng: [18.006582, -92.923922]},
            { nombre: "Ujat central ida", latlng: [18.007394, -92.923435]},
            { nombre: "Farmacias guadalajara", latlng: [18.009101, -92.921684]},
            { nombre: "Las americas regreso", latlng: [18.013068, -92.918445]},
            { nombre: "Las americas ida", latlng: [18.012700, -92.918924]},
            { nombre: "IMSS No° 46 regreso", latlng: [18.014450, -92.916229]},
            { nombre: "IMSS No° 46 ida", latlng: [18.014773, -92.916106]},
            { nombre: "AutoClimas", latlng: [18.010661, -92.920598]},
            { nombre: "Farmacias del Ahorro ida", latlng: [18.003268, -92.926397]},
            { nombre: "CERAOR 3D ida", latlng: [18.002188, -92.930889]},
            { nombre: "Nissan ida", latlng: [17.995899, -92.942124]},
        
            // Beto
            {nombre: "IMMS Av universidad ida", latlng: [18.01566, -92.915937]},
            {nombre: "IMMS Av universidad regreso", latlng: [18.014796, -92.916012]},
            {nombre: "Deportivo UJAT", latlng: [18.016180, -92.912600]},
            {nombre: "Bodega Aurrera Av Universidad ida", latlng: [18.018006, -92.909795]},
            {nombre: "Plaza Sendero regreso", latlng: [18.018019, -92.910877]},
            {nombre: "Indeco ida", latlng: [18.023343, -92.907133]},
            {nombre: "Cd Industrial regreso", latlng: [18.024796, -92.906791]},
            {nombre: "CLAT ida", latlng: [18.026190, -92.905532]},
            {nombre: "CLAT regreso", latlng: [18.026198, -92.905966]},
            {nombre: "CETIS 70 ida", latlng: [18.030021, -92.903385]},
            {nombre: "CETIS 70 regreso", latlng: [18.030581, -92.903579]},
        
            // Irving
            { nombre: "La Huasteca regreso", latlng: [17.790966, -92.942791] },
            { nombre: "Playas del Rosario ida", latlng: [17.849320, -92.926461] },
            { nombre: "Playas del Rosario Regreso", latlng: [17.848339, -92.926362] },
            { nombre: "Gracias Mexico regreso", latlng: [17.850683, -92.926098] },
            { nombre: "El Manzano regreso", latlng: [17.854438, -92.925666] },
            { nombre: "El Manzano ida", latlng: [17.854709, -92.925785] },
            { nombre: "Las Mercedes ida", latlng: [17.862216, -92.924859] },
            { nombre: "Las Mercedes Regreso", latlng: [17.862819, -92.924631] },
            { nombre: "Estanzuela regreso", latlng: [17.867067, -92.924127] },
            { nombre: "Estanzuela ida", latlng: [17.866676, -92.924298] },
            { nombre: "Los Claustros regreso", latlng: [17.875111, -92.923109] },
            { nombre: "El 15 ida", latlng: [17.876027, -92.923184] }, 
            { nombre: "El Paraíso regreso", latlng: [17.878887, -92.922684] },
            { nombre: "COBATAB 24 ida (El Paraíso)", latlng: [17.878792, -92.922859] },
            { nombre: "27 de Octubre regreso", latlng: [17.884188, -92.921981] },
            { nombre: "Parada UTTAB ida (27 de octubre)", latlng: [17.884757, -92.922223] },
            { nombre: "El Encanto regreso", latlng: [17.892842, -92.923374] },
            { nombre: "El Encanto ida", latlng: [17.892733, -92.923521] }, 
            { nombre: "Las Margaritas regreso", latlng: [17.900298, -92.922065] },
            { nombre: "Villa Floresta regreso", latlng: [17.902768, -92.922101] },
            { nombre: "Casa para todos regreso", latlng: [17.904692, -92.922341] },
            { nombre: "La Lima regreso", latlng: [17.907474, -92.922281] },
            { nombre: "Parada de la Agencia regreso", latlng: [17.911281, -92.918020] },
            { nombre: "Parada KM 11 regreso", latlng: [17.913240, -92.915535] },
            { nombre: "Parada Colegio Nicanor ida", latlng: [17.927820, -92.912563] }, 
            { nombre: "FOVISSTE PARRILLA regreso", latlng: [17.928376, -92.913115] },
            { nombre: "Hacienda del Sol ida", latlng: [17.928667, -92.913564] }, 
            { nombre: "La Majahua ida", latlng: [17.948748, -92.915640] }, 
            { nombre: "La Majahua Regreso", latlng: [17.948562, -92.915558] }, 
            { nombre: "Parada Laboratorios Chontalpa regreso", latlng: [17.969188, -92.920689] },
        
            { nombre: "Dulceria Estrella Regreso", latlng: [17.97644128037872, -92.9739852890047] },
            { nombre: "Autotab Villahermosa ida ", latlng: [17.9816952632132, -92.9713882691751] },
            { nombre: "Paqueteria tres guerras", latlng: [17.98424551434118, -92.96937171091268] },
            { nombre: "Hotel Baez ", latlng: [17.987080, -92.957255] },
            { nombre: "Hotel Karamelo", latlng:     [17.990835, -92.945919] },
            { nombre: "Hotel Karamelo", latlng:     [17.991728, -92.945140] },
            { nombre: "UT", latlng:     [17.883719, -92.926949] },
          // Agrega más estaciones según tu ruta
        ];
        setEstaciones(estacionesEjemplo);

        // Obtener ruta desde OSRM (simulado)
        const coordenadas = estacionesEjemplo.map(e => `${e.latlng[1]},${e.latlng[0]}`).join(';');
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${coordenadas}?overview=full&geometries=geojson`
        );
        setRuta(response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
      } catch (error) {
        console.error("Error al cargar datos de ruta:", error);
      }
    };

    cargarDatosRuta();
  }, [rutaId]);

  // Configurar geolocalización en tiempo real
  useEffect(() => {
    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setPosicionActual(newPosition);

        // Centrar mapa en la posición actual si es la primera vez
        if (mapRef.current && !posicionActual) {
          mapRef.current.flyTo([newPosition.lat, newPosition.lng], 16);
        }

        // Calcular estación más cercana
        if (estaciones.length > 0) {
          const cercana = estaciones.reduce((closest, estacion) => {
            const distancia = calcularDistancia(newPosition, estacion.latlng);
            return distancia < closest.distancia ? { estacion, distancia } : closest;
          }, { estacion: null, distancia: Infinity });

          setEstacionCercana(cercana.distancia < 0.05 ? cercana.estacion : null); // 50 metros
        }
      },
      (error) => {
        console.error("Error de geolocalización:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watcherId);
  }, [estaciones, posicionActual]);

  // Función para calcular distancia
  const calcularDistancia = (pos1, pos2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (pos2[0] - pos1.lat) * Math.PI / 180;
    const dLon = (pos2[1] - pos1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Función para registrar parada
  const registrarParada = () => {
    if (!estacionCercana) return;
    
    const nuevaParada = {
      estacion: estacionCercana.nombre,
      hora: new Date().toLocaleTimeString(),
      posicion: posicionActual
    };
    
    setHistorialParadas([...historialParadas, nuevaParada]);
    setParadaRegistrada(true);
    
    // Notificar al componente padre si es necesario
    if (onParadaRegistrada) {
      onParadaRegistrada(nuevaParada);
    }
    
    // Resetear el estado después de 3 segundos
    setTimeout(() => setParadaRegistrada(false), 3000);
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
        {estaciones.map((estacion) => (
          <Marker 
            key={`estacion-${estacion.id}`} 
            position={estacion.latlng}
            icon={estacionCercana?.id === estacion.id ? 
              L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              }) : DefaultIcon
            }
          >
            <Popup>
              {estacion.nombre}
              {estacionCercana?.id === estacion.id && (
                <div>
                  <br />
                  <strong>Estás cerca de esta estación</strong>
                </div>
              )}
            </Popup>
          </Marker>
        ))}
        
        {/* Marcador de la posición actual del chofer */}
        {posicionActual && (
          <Marker 
            position={[posicionActual.lat, posicionActual.lng]}
            icon={combiChoferIcon}
          >
            <Popup>
              Tu posición actual
              {estacionCercana && (
                <div>
                  <br />
                  Estación cercana: {estacionCercana.nombre}
                </div>
              )}
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Panel de control del chofer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Panel del Chofer</h3>
        
        {estacionCercana ? (
          <>
            <p style={{ margin: '0 0 10px 0' }}>
              Estás cerca de: <strong>{estacionCercana.nombre}</strong>
            </p>
            <button 
              onClick={registrarParada}
              disabled={paradaRegistrada}
              style={{
                padding: '10px 20px',
                backgroundColor: paradaRegistrada ? '#4CAF50' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {paradaRegistrada ? '✓ Parada Registrada' : 'Registrar Parada'}
            </button>
          </>
        ) : (
          <p>No hay estaciones cercanas</p>
        )}
      </div>
      
      {/* Historial de paradas */}
      {historialParadas.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          maxHeight: '300px',
          overflowY: 'auto',
          maxWidth: '300px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Historial de Paradas</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {historialParadas.map((parada, index) => (
              <li key={index} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                <strong>{parada.estacion}</strong>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  {parada.hora} - {parada.posicion.lat.toFixed(4)}, {parada.posicion.lng.toFixed(4)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default VistaChofer;