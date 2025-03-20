import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import getSpotifyToken from './getSpotifyToken';
import './Albums.css';

const Albums = () => {
  const { rapperId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rapperName, setRapperName] = useState('');
  const [rapperImage, setRapperImage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getSpotifyToken();

        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${rapperId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRapperName(artistResponse.data.name);
        setRapperImage(artistResponse.data.images[0]?.url || '');

        const tracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${rapperId}/top-tracks?market=IN`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTracks(tracksResponse.data.tracks);

        const albumResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${rapperId}/albums?include_groups=album&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlbums(albumResponse.data.items);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (rapperId) fetchData();
  }, [rapperId]);

  return (
    <div className="albums-page">
      <h1>{rapperName ? `${rapperName}'s Music` : 'Music'}</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* 🆕 All Songs Card Section (Spotify Songs) */}
      {rapperImage && (
        <div className="all-songs-section">
          <h2>All Songs of {rapperName}</h2>
          <div className="all-songs-box" onClick={() => navigate(`/songs/${rapperId}`)}>
            <img src={rapperImage} alt={rapperName} />
            <p>{rapperName}</p>
          </div>
        </div>
      )}

      {/* Top Tracks Section */}
      <div className="tracks-section">
        <h2>Popular Tracks</h2>
        <div className="albums-grid">
          {tracks.map((track) => (
            <div key={track.id} className="album-card">
              <img src={track.album.images[0]?.url} alt={track.name} />
              <h3>{track.name}</h3>
              <p>{track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Albums Section */}
      <div className="albums-section">
        <h2>Albums</h2>
        <div className="albums-grid">
          {albums.length > 0 ? (
            albums.map((album) => (
              <Link key={album.id} to={`/songs/${album.id}`} className="album-card">
                <img src={album.images[0]?.url} alt={album.name} />
                <h3>{album.name}</h3>
                <p>{new Date(album.release_date).getFullYear()}</p>
              </Link>
            ))
          ) : (
            <p>No albums found for this rapper.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Albums;
