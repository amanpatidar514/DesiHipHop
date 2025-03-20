import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Home.css';
import logo from '../images/logo.jpeg';

const Home = () => {
  const navigate = useNavigate();

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      navigate('/rappers');
    }
  }, [navigate]);

  const handleStartListening = () => {
    const CLIENT_ID = '7c51bc90b0884fa5afc2d1420b995a61';
    const REDIRECT_URI = 'https://amanpatidar514.github.io/DesiHipHop/#/callback';

    const SCOPES = [
      'user-read-private',
      'user-read-email'
    ];

    // Simplified URL construction
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const queryParams = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(' ')
    }).toString();

    window.location.href = `${authEndpoint}?${queryParams}`;
  };

  return (
    <div className="homepage">
      <div className="content">
        <div className="logo">
          <img 
            src={logo}
            alt="Desi Hip-Hop Logo" 
          />
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
