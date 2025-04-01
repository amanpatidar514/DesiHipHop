import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rappers from './pages/Rappers';
import Albums from './pages/Albums';
import Songs from './pages/Songs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rappers" element={<Rappers />} />
        <Route path="/albums/:rapperId" element={<Albums />} />
        <Route path="/songs/all/:rapperId" element={<Songs />} />
        <Route path="/songs/:albumId" element={<Songs />} />
      </Routes>
    </Router>
  );
}

export default App;
