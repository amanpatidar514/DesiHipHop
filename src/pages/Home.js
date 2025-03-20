import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Home.css';
import logo from '../images/logo.jpeg';

const Home = () => {
  const navigate = useNavigate();
  // const audio = new Audio(notificationSound);

  const handleStartListening = async () => {
    try {
      // await audio.play();
      
      // Check if user is already authenticated
      const token = localStorage.getItem('spotify_access_token');
      
      if (token) {
        // If already authenticated, go directly to rappers page
        navigate('/rappers');
        return;
      }

      // If not authenticated, initiate Spotify login
      const CLIENT_ID = '7c51bc90b0884fa5afc2d1420b995a61';
      const REDIRECT_URI = 'https://desi-hiphop.vercel.app/callback';


      const SCOPES = [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-library-read',
        'user-library-modify'
      ];

      const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}&show_dialog=true`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error:", error);
    }
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
