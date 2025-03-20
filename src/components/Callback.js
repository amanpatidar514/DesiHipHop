import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get token from URL without using regex
        const params = new URLSearchParams(
          window.location.hash.substring(1) // Remove the # character
        );
        const accessToken = params.get('access_token');
        console.log("Token found:", accessToken ? 'Yes' : 'No');

        if (accessToken) {
          // Store token
          localStorage.setItem('spotify_access_token', accessToken);
          
          // Clear the URL hash
          window.history.pushState({}, document.title, '/');
          
          // Redirect to rappers page
          setTimeout(() => {
            window.location.href = 'https://amanpatidar514.github.io/DesiHipHop/#/rappers';
          }, 1000);
        } else {
          window.location.href = 'https://amanpatidar514.github.io/DesiHipHop/#/';
        }
      } catch (error) {
        console.error("Callback error:", error);
        window.location.href = 'https://amanpatidar514.github.io/DesiHipHop/#/';
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
