import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get token from URL
        const hash = window.location.hash;
        console.log("Hash received:", hash); // Debug log

        const accessTokenMatch = hash.match(/access_token=([^&]*)/);
        const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
        console.log("Token extracted:", accessToken ? "Token found" : "No token"); // Debug log

        if (accessToken) {
          // Store token
          localStorage.setItem('spotify_access_token', accessToken);
          
          // Remove hash from URL
          window.history.pushState("", document.title, window.location.pathname);
          
          // Force a hard redirect to rappers page
          const baseUrl = 'https://amanpatidar514.github.io/DesiHipHop';
          const rappersUrl = `${baseUrl}/#/rappers`;
          
          console.log("Redirecting to:", rappersUrl); // Debug log
          window.location.href = rappersUrl;
        } else {
          // If no token, redirect to home
          window.location.href = 'https://amanpatidar514.github.io/DesiHipHop/#/';
        }
      } catch (error) {
        console.error("Callback error:", error);
        window.location.href = 'https://amanpatidar514.github.io/DesiHipHop/#/';
      }
    };

    // Execute callback handling
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
