import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Callback from './components/Callback';
import Rappers from './pages/Rappers';
import Albums from './pages/Albums';
import Songs from './pages/Songs';

function App() {
  return (
    <Router basename="/DesiHipHop">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/rappers" element={<Rappers />} />
        <Route path="/albums/:rapperId" element={<Albums />} />
        <Route path="/songs/all/:rapperId" element={<Songs />} />
        <Route path="/songs/:albumId" element={<Songs />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
