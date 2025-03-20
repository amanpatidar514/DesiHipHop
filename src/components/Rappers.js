import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rappers.css';

const artistNames = [
  'DIVINE',
  'Raftaar',
  'Emiway Bantai',
  'KR$NA',
  'Ikka',
  'Badshah',
  'Yo Yo Honey Singh',
  'Brodha V',
  'MC Stan',
  'Seedhe Maut',
  'Fotty Seven'
];

const Rappers = () => {
  const [rappers, setRappers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const results = [];

        for (const name of artistNames) {
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&market=IN&limit=1`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const artist = data.artists.items[0];
            if (artist && artist.images.length > 0) {
              results.push(artist);
            }
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
  }, [navigate]);

  const handleRapperClick = (rapperId) => {
    navigate(`/albums/${rapperId}`);
  };

  if (loading) {
    return (
      <div className="rappers-loading">
        <h2>Loading Artists...</h2>
        <p>Please wait while we fetch the best hip-hop artists</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rappers-error">
        <h2>Error Loading Artists</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
        <button onClick={() => navigate('/')}>Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="rappers-page">
      <h1>Popular Indian Hip-Hop Artists</h1>
      {rappers.length === 0 ? (
        <div className="no-rappers">
          <p>No artists found. Please try again.</p>
        </div>
      ) : (
        <div className="rappers-grid">
          {rappers.map((rapper) => (
            <div
              key={rapper.id}
              className="rapper-card"
              onClick={() => handleRapperClick(rapper.id)}
            >
              <img src={rapper.images[0].url} alt={rapper.name} className="rapper-image" />
              <h3>{rapper.name}</h3>
              <p>Followers: {rapper.followers.total.toLocaleString()}</p>
              <p className="popularity">Popularity: {rapper.popularity}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rappers;
