import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Rappers.css';

const SPOTIFY_CLIENT_ID = '7c51bc90b0884fa5afc2d1420b995a61';
const SPOTIFY_CLIENT_SECRET = 'b66594a7b0b74f2d8ebce2e715418bbc';

const Rappers = () => {
  const [rappers, setRappers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshSpotifyToken = async () => {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: SPOTIFY_CLIENT_SECRET,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      return response.data.access_token;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchRappers = async () => {
      try {
        setLoading(true);
        const token = await refreshSpotifyToken();
        if (!token) throw new Error('Failed to get access token');

        // First, get some known Indian hip-hop artists
        const indianRappers = [
          'Divine', 'Raftaar', 'Badshah', 'Yo Yo Honey Singh', 
          'MC Stan', 'Seedhe Maut', 'Prabh Deep', 'Kr$na',
          'EPR', 'Karma', 'King',
          'Talha Anjum',   // Add Talha Anjum
          'Loka',          // Add Loka
          'Ikka',          // Add Ikka
          'Young Stunner',
          'Umair',
          'Bali',
          'Dino James',
          'Talhah Yunus',
          'GAUSH',
          'Chaar Diwaari',
          'Paradox',
          'MC Altaf',
          'Raga',
          'Panther',
          'Nazz'
        ];
        

        // Search for each rapper
        const rappersData = await Promise.all(
          indianRappers.map(async (rapperName) => {
            try {
              const response = await axios.get(
                `https://api.spotify.com/v1/search`,
                {
                  params: {
                    q: rapperName,
                    type: 'artist',
                    market: 'IN',
                    limit: 1
                  },
                  headers: { Authorization: `Bearer ${token}` }
                }
              );

              const artist = response.data.artists.items[0];
              if (!artist) return null;

              return {
                id: artist.id,
                name: artist.name,
                image: artist.images[0]?.url || '/default-artist.jpg',
                followers: artist.followers.total,
                popularity: artist.popularity
              };
            } catch (error) {
              console.error(`Error fetching ${rapperName}:`, error);
              return null;
            }
          })
        );

        // Filter out null values and sort by popularity
        const validRappers = rappersData
          .filter(rapper => rapper !== null)
          .sort((a, b) => b.popularity - a.popularity);

        setRappers(validRappers);
      } catch (err) {
        console.error('Error fetching rappers:', err);
        setError('Failed to load rappers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRappers();
  }, []);

  if (loading) return <div className="rappers-page"><h1>Loading...</h1></div>;
  if (error) return <div className="rappers-page"><h1>{error}</h1></div>;

  return (
    <div className="rappers-page">
      <h1>Popular Hip-Hop Artists</h1>
      {rappers.length > 0 ? (
        <div className="rappers-grid">
          {rappers.map((rapper) => (
            <Link key={rapper.id} to={`/albums/${rapper.id}`} className="rapper-card">
              <img src={rapper.image} alt={rapper.name} />
              <h2>{rapper.name}</h2>
              <p>{rapper.followers.toLocaleString()} followers</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-results">No artists found</p>
      )}
    </div>
  );
};

export default Rappers;
