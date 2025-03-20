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
      console.log('Token:', token); // Debug log
      
      if (!token) {
        console.log('No token found, redirecting to home'); // Debug log
        navigate('/');
        return;
      }

      try {
        console.log('Fetching rappers...'); // Debug log
        const response = await fetch(
          'https://api.spotify.com/v1/search?q=genre:hip-hop%20indian&type=artist&limit=20',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData); // Debug log
          throw new Error(`Failed to fetch rappers: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debug log

        if (data.artists && data.artists.items) {
          const filteredRappers = data.artists.items.filter(artist => 
            artist.popularity > 20 && artist.images.length > 0
          );
          console.log('Filtered rappers:', filteredRappers); // Debug log
          setRappers(filteredRappers);
        } else {
          throw new Error('Invalid data structure received');
        }
      } catch (err) {
        console.error('Error details:', err); // Debug log
        setError(err.message || 'Failed to load rappers');
      } finally {
        setLoading(false);
      }
    };

    fetchRappers();
  }, [navigate]);

  // Add visible loading and error states
  if (loading) {
    return (
      <div className="rappers-loading">
        <h2>Loading Rappers...</h2>
        <p>Please wait while we fetch the artists</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rappers-error">
        <h2>Error Loading Rappers</h2>
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
          <p>No artists found</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Rappers;
