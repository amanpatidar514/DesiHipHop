import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      try {
        const hash = window.location.hash;
        const accessTokenMatch = hash.match(/access_token=([^&]*)/);
        const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;

        if (accessToken) {
          // Store the token
          localStorage.setItem('spotify_access_token', accessToken);
          console.log('Token stored:', accessToken); // Debug log
          
          // Clear the hash
          window.location.hash = '';
          
          // Navigate to rappers page using full URL
          window.location.replace('https://amanpatidar514.github.io/DesiHipHop/#/rappers');
        } else {
          console.log('No token found'); // Debug log
          window.location.replace('https://amanpatidar514.github.io/DesiHipHop/#/');
        }
      } catch (error) {
        console.error('Error in callback:', error);
        window.location.replace('https://amanpatidar514.github.io/DesiHipHop/#/');
      }
    };

    handleCallback();
  }, [navigate]);

  // Loading screen
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#121212',
      color: '#fff',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h2>Connecting to Spotify...</h2>
      <div style={{ fontSize: '14px', opacity: 0.8 }}>Please wait while we set up your session</div>
    </div>
  );
};

export default Callback;
