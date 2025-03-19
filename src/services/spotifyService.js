import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

// Function to set the token
let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

// Function to fetch albums by artist ID
export const getArtistAlbums = async (artistId) => {
  try {
    const response = await axios.get(`${BASE_URL}/artists/${artistId}/albums`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;  // Returns an array of albums
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};
