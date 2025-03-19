// getSpotifyToken.js
import axios from 'axios';

const getSpotifyToken = async () => {
  const clientId = '7c51bc90b0884fa5afc2d1420b995a61';
  const clientSecret = 'b66594a7b0b74f2d8ebce2e715418bbc';
  
  const auth = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const token = response.data.access_token;
    console.log('Generated Token:', token);  // ✅ Check the token
    return token;

  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    throw error;
  }
};

export default getSpotifyToken;
