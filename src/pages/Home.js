import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartListening = () => {
    const CLIENT_ID = '7c51bc90b0884fa5afc2d1420b995a61';
    // Make sure this exactly matches what's in Spotify Dashboard
    const REDIRECT_URI = 'https://amanpatidar514.github.io/DesiHipHop/callback';
    
    const SCOPES = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state'
    ];

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(' '),
      show_dialog: true
    });

    window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
  };

  return (
    <div className="homepage">
      <div className="content">
        <div className="logo">
          <img src={process.env.PUBLIC_URL + '/images/logo.jpeg'} alt="Desi Hip-Hop Logo" />
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
