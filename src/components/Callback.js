import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get the hash fragment
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        
        // Get token and state
        const token = params.get('access_token');
        const state = params.get('state');
        
        // Verify state
        const storedState = localStorage.getItem('spotify_auth_state');
        
        if (token && state === storedState) {
          // Clear state
          localStorage.removeItem('spotify_auth_state');
          
          // Store token
          localStorage.setItem('spotify_access_token', token);
          
          // Navigate to rappers page
          window.location.replace('https://amanpatidar514.github.io/DesiHipHop/#/rappers');
        } else {
          // If verification fails, go back to home
          window.location.replace('https://amanpatidar514.github.io/DesiHipHop/#/');
        }
      } catch (error) {
        console.error('Auth error:', error);
        window.location.replace('https://amanpatidar514.github.io/DesiHipHop/#/');
      }
    };

    handleCallback();
  }, []);

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
