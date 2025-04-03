import React, { useState } from 'react';
import { FaUser, FaBell, FaBars, FaCar, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import CombiList from './CombiList'; // Asegúrate de importar el componente

const TransportNavbar = ({ combis, userPosition }) => {  // Acepta combis y userPosition como props
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ride');

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 pb-4 sm:px-6 lg:px-8">
        {/* Primera fila del navbar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <FaCar className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">Ruta Periférico</span>
          </div>

          {/* Menú central para dispositivos grandes */}
          <div className="hidden md:flex space-x-8">
            <button 
              className={`flex items-center px-3 py-2 text-sm font-medium ${activeTab === 'ride' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('ride')}
            >
              <FaCar className="mr-2" />
              Ruta
            </button>
            <button 
              className={`flex items-center px-3 py-2 text-sm font-medium ${activeTab === 'units' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('units')}
            >
              <FaMapMarkerAlt className="mr-2" />
              Unidades
            </button>
          </div>

          {/* Iconos de usuario y notificaciones */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <FaBell className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <FaUser className="h-5 w-5" />
            </button>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="mt-4">
          {/* Pestaña Ruta */}
          {activeTab === 'ride' && (
            <div className="pb-4 md:pb-0">
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="¿A dónde vas?"
                />
              </div>
            </div>
          )}

          {/* Pestaña Unidades */}
          {activeTab === 'units' && userPosition && combis.length > 0 && (
            <div className="relative">
              <CombiList combis={combis} userPosition={userPosition} />
            </div>
          )}
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="pt-2 pb-3 space-y-1">
              <button 
                className={`flex items-center w-full px-3 py-2 text-base font-medium ${activeTab === 'ride' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                onClick={() => {
                  setActiveTab('ride');
                  setIsMenuOpen(false);
                }}
              >
                <FaCar className="mr-2" />
                Ruta
              </button>
              <button 
                className={`flex items-center w-full px-3 py-2 text-base font-medium ${activeTab === 'units' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                onClick={() => {
                  setActiveTab('units');
                  setIsMenuOpen(false);
                }}
              >
                <FaMapMarkerAlt className="mr-2" />
                Unidades
              </button>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4 space-x-3">
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <FaBell className="h-6 w-6" />
                </button>
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <FaUser className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TransportNavbar;