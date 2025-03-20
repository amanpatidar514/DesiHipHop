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
    // Use hash routing in callback URL
    const REDIRECT_URI = 'https://amanpatidar514.github.io/DesiHipHop/#/callback';
    
    // Generate a random state value
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('spotify_auth_state', state);

    const SCOPES = [
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state'
    ];

    // Use traditional URL parameters
    window.location.href = 
      'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + CLIENT_ID +
      '&scope=' + SCOPES.join('%20') +
      '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
      '&state=' + state +
      '&show_dialog=true';
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
