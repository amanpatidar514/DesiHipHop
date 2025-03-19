// src/services/spotifyAuth.js
const getSpotifyToken = async () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  
    const authString = btoa(`${clientId}:${clientSecret}`);
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authString}`
        },
        body: 'grant_type=client_credentials'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }
  
      const data = await response.json();
      return data.access_token;
  
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      return null;
    }
  };
  
  export default getSpotifyToken;
  