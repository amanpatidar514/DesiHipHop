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
      console.log('Attempting to fetch with token:', token); // Debug log

      if (!token) {
        console.log('No token found, redirecting to home');
        navigate('/');
        return;
      }

      try {
        const response = await fetch(
          'https://api.spotify.com/v1/search?q=genre:"hip-hop"+indian+rapper&type=artist&market=IN&limit=50',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('API Response status:', response.status); // Debug log

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired
            localStorage.removeItem('spotify_access_token');
            navigate('/');
            return;
          }
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data); // Debug log

        if (data.artists && data.artists.items) {
          const filteredRappers = data.artists.items
            .filter(artist => artist.images.length > 0)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 20);

          setRappers(filteredRappers);
        } else {
          throw new Error('Invalid data structure received');
        }
      } catch (err) {
        console.error('Error fetching rappers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRappers();
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
      <h1>Popular Hip-Hop Artists</h1>
      {rappers.length === 0 ? (
        <div className="no-rappers">
          <p>No artists found. Please try again.</p>
        </div>
      ) : (
        <div className="rappers-grid">
          {rappers.map(rapper => (
            <div 
              key={rapper.id} 
              className="rapper-card"
              onClick={() => handleRapperClick(rapper.id)}
            >
              <img 
                src={rapper.images[0]?.url} 
                alt={rapper.name}
                className="rapper-image"
              />
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
