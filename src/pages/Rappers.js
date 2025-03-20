import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rappers.css';

const Rappers = () => {
  const [rappers, setRappers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRappers = async () => {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token) {
        navigate('/');
        return;
      }

      try {
        // Search for hip-hop artists
        const response = await fetch(
          'https://api.spotify.com/v1/search?q=genre:hip-hop%20indian&type=artist&limit=20',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch rappers');
        }

        const data = await response.json();
        const filteredRappers = data.artists.items.filter(artist => 
          artist.popularity > 20 && artist.images.length > 0
        );

        setRappers(filteredRappers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rappers:', err);
        setError('Failed to load rappers');
        setLoading(false);
      }
    };

    fetchRappers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="rappers-loading">
        <h2>Loading Rappers...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rappers-error">
        <h2>{error}</h2>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="rappers-page">
      <h1>Popular Hip-Hop Artists</h1>
      <div className="rappers-grid">
        {rappers.map(rapper => (
          <div key={rapper.id} className="rapper-card">
            <img 
              src={rapper.images[0]?.url} 
              alt={rapper.name}
              className="rapper-image"
            />
            <h3>{rapper.name}</h3>
            <p>Followers: {rapper.followers.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rappers;
