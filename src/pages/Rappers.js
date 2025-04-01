import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Rappers.css';

const SPOTIFY_CLIENT_ID = '7c51bc90b0884fa5afc2d1420b995a61';
const SPOTIFY_CLIENT_SECRET = 'b66594a7b0b74f2d8ebce2e715418bbc';

const artistNames = [
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
          'Nazz',
          'Emiway Bantai',
          'The local train',
          'Parmish Verma',
          'Muhfaad',
          'AP Dhillon',
          'Raja Kumari',
          'Bohemia',
          'aleemrk',
          'Jokhay',
          'Rockson'
];

const Rappers = () => {
  const [rappers, setRappers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAccessToken = async () => {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: SPOTIFY_CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('Failed to get access token');
        }

        const results = [];
        for (const name of artistNames) {
          const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&market=IN&limit=1`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.data.artists.items[0]) {
            results.push(response.data.artists.items[0]);
          }
        }

        setRappers(results);
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
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
              <img src={rapper.images[0]?.url || '/default-artist.jpg'} alt={rapper.name} />
              <h2>{rapper.name}</h2>
              <p>{rapper.followers.total.toLocaleString()} followers</p>
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
