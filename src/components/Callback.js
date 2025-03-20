import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const getTokenFromUrl = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return params.get('access_token');
    };

    try {
      const token = getTokenFromUrl();
      if (token) {
        localStorage.setItem('spotify_access_token', token);
        // Redirect to rappers page without hash routing
        window.location.href = 'https://amanpatidar514.github.io/DesiHipHop/rappers';
      } else {
        window.location.href = 'https://amanpatidar514.github.io/DesiHipHop';
      }
    } catch (error) {
      console.error('Auth error:', error);
      window.location.href = 'https://amanpatidar514.github.io/DesiHipHop';
    }
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
