import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Home.css';
import logo from '../images/logo.jpeg';

const Home = () => {
  const navigate = useNavigate();

  const handleStartListening = () => {
    // Directly navigate to rappers page
    navigate('/rappers');
  };

  return (
    <div className="homepage">
      <div className="content">
        <div className="logo">
          <img src={logo} alt="Desi Hip-Hop Logo" />
        </div>
        <h1>Desi Hip-Hop</h1>
        <div className="navigate-box">
          <p>Explore best hip-hop artists and albums.</p>
          <button className="bat-button" onClick={handleStartListening}>
            <span>Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
