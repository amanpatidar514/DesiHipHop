// services/audiusAPI.js

import axios from 'axios';
import { getCachedAudiusTrack, setCachedAudiusTrack } from './audiusCache';

const BASE_URL = 'https://discoveryprovider.audius.co/v1';

export const searchAudiusTrack = async (trackName, artistName) => {
  const query = `${trackName} ${artistName}`.toLowerCase();
  const cached = getCachedAudiusTrack(query);
  if (cached) return cached;

  try {
    const response = await axios.get(`${BASE_URL}/tracks/search`, {
      params: { query, limit: 1 },
    });

    const track = response.data.data[0];
    if (track) {
      setCachedAudiusTrack(query, track);
    }

    return track;
  } catch (error) {
    console.error('Audius search error:', error);
    return null;
  }
};

export const fetchPopularAudiusTracks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tracks/trending`, {
      params: { limit: 10 },
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch popular Audius tracks:', error);
    return [];
  }
};
