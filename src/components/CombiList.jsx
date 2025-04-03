import React from 'react';
import { FaBus, FaClock, FaRoad, FaMapMarkerAlt } from 'react-icons/fa';

// Función para calcular la distancia entre dos puntos (similar a la que ya tienes)
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

const CombiList = ({ combis, userPosition }) => {
  // Función para calcular el tiempo estimado de llegada en minutos
  const calcularTiempoLlegada = (combi) => {
    if (!userPosition || !combi.position) return '--';
    
    const distancia = calcularDistancia(
      userPosition, 
      [combi.position[0], combi.position[1]]
    );
    
    // Suponemos una velocidad promedio de 30 km/h si no hay datos de velocidad
    const velocidad = combi.velocidad || 30;
    const tiempoHoras = distancia / velocidad;
    const tiempoMinutos = Math.ceil(tiempoHoras * 60);
    
    return tiempoMinutos > 1 ? `${tiempoMinutos} mins` : '1 min';
  };

  // Función para calcular la distancia en km
  const calcularDistanciaTexto = (combi) => {
    if (!userPosition || !combi.position) return '-- km';
    
    const distancia = calcularDistancia(
      userPosition, 
      [combi.position[0], combi.position[1]
    ]);
    
    return distancia < 1 
      ? `${(distancia * 1000).toFixed(0)} m` 
      : `${distancia.toFixed(2)} km`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-indigo-600 text-white">
        <h2 className="text-lg font-semibold flex items-center">
          <FaBus className="mr-2" />
          Unidades disponibles
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {combis.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay unidades disponibles en este momento
          </div>
        ) : (
          combis.map((combi) => (
            <div key={`combi-card-${combi.id}`} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                {/* Ícono de la combi */}
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/1048/1048325.png" 
                    alt="Combi" 
                    className="h-12 w-12 object-contain"
                  />
                </div>
                
                {/* Información de la combi */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {combi.ruta || `Unidad ${combi.id}`}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {combi.velocidad || '--'} km/h
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="mr-1.5 text-indigo-500" />
                      <span>{calcularTiempoLlegada(combi)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <FaRoad className="mr-1.5 text-indigo-500" />
                      <span>{calcularDistanciaTexto(combi)}</span>
                    </div>
                  </div>
                  
                  {userPosition && combi.position && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1.5 text-indigo-500" />
                      <span>
                        {combi.progreso ? `A ${(combi.progreso * 100).toFixed(0)}% de la ruta` : 'En ruta'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CombiList;