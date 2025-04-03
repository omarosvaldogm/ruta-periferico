import { useState } from 'react';
import MapaConRuta from "./components/MapaConRuta"
import 'leaflet/dist/leaflet.css';
import TransportNavbar from "./components/TransportNavbar";

function App() {
  const [userPosition, setUserPosition] = useState(null);
  const [combis, setCombis] = useState([]);


  return (
    <>
      <TransportNavbar combis={combis} userPosition={userPosition} />
      <MapaConRuta 
      onUserPositionUpdate={setUserPosition}
      onCombisUpdate={setCombis}
      userPosition={userPosition}
      combis={combis}
    />
    </>
  )
}

export default App;