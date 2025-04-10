import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapaConRuta from "./components/MapaConRuta";
import 'leaflet/dist/leaflet.css';
import TransportNavbar from "./components/TransportNavbar";
import VistaChofer from "./components/VistaChofer";

function App() {
  const [userPosition, setUserPosition] = useState(null);
  const [combis, setCombis] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <TransportNavbar combis={combis} userPosition={userPosition} />
            <MapaConRuta 
              onUserPositionUpdate={setUserPosition}
              onCombisUpdate={setCombis}
              userPosition={userPosition}
              combis={combis}
            />
          </>
        } />
        <Route path="/chofer" element={
          <>
          <TransportNavbar combis={combis} userPosition={userPosition} />
          <VistaChofer rutaId="periferico" onParadaRegistrada={(parada) => {
            console.log('Parada registrada:', parada);
            // Aquí puedes enviar la parada a tu backend
          }} />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;