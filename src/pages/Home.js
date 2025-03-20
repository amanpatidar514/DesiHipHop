import React from 'react';
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
    // Remove hash routing from callback URL
    const REDIRECT_URI = 'https://amanpatidar514.github.io/DesiHipHop/callback';
    
    const SCOPES = [
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state'
    ].join(' ');

    // Build auth URL
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      response_type: 'token',
      show_dialog: true
    };

    const authUrl = 'https://accounts.spotify.com/authorize?' + 
      Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

    window.location.href = authUrl;
  };

  return (
    <div className="homepage">
      <div className="content">
        <div className="logo">
          <img 
            src={require('./logo.jpeg')}
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
