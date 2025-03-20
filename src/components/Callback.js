import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get the full hash including the #
        const hash = window.location.hash;
        
        // Extract access token using regex
        const accessTokenMatch = hash.match(/access_token=([^&]*)/);
        const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;

        if (accessToken) {
          // Store the token
          localStorage.setItem('spotify_access_token', accessToken);
          
          // Clear the hash from URL
          window.location.hash = '';
          
          // Force navigation to rappers page
          setTimeout(() => {
            navigate('/rappers', { replace: true });
          }, 1000);
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error in callback:', error);
        navigate('/', { replace: true });
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
      background: '#000',
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
