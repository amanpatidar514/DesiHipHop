import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Home.css';

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
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state'
    ].join(' ');

    const authUrl = 
      'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + encodeURIComponent(CLIENT_ID) +
      '&scope=' + encodeURIComponent(SCOPES) +
      '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
      '&show_dialog=true';

    console.log("Auth URL:", authUrl); // Debug log
    window.location.href = authUrl;
  };

  return (
    <div className="homepage">
      <div className="content">
        <div className="logo">
          <img 
            src={`${process.env.PUBLIC_URL}/images/logo.jpeg`}
            alt="Desi Hip-Hop Logo" 
            style={{ 
              width: '150px', 
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
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
