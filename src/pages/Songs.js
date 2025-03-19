import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Songs.css';

const SPOTIFY_CLIENT_ID = '7c51bc90b0884fa5afc2d1420b995a61';
const SPOTIFY_CLIENT_SECRET = 'b66594a7b0b74f2d8ebce2e715418bbc';

const Songs = () => {
  const { albumId } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);

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

      const newToken = response.data.access_token;
      localStorage.setItem('spotify_token', newToken);
      return newToken;
    } catch (err) {
      console.error('Failed to refresh Spotify token:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const token = await refreshSpotifyToken();
        if (!token) throw new Error('Unable to refresh token.');

        // First try to fetch as a track (for single songs)
        try {
          const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // If successful, it's a single track
          const track = trackResponse.data;
          setAlbumName(track.album.name);
          setSongs([{
            name: track.name,
            id: track.id,
            artists: track.artists.map(artist => artist.name).join(', '),
            albumImage: track.album.images[0]?.url,
          }]);
          return;
        } catch (err) {
          // If 404, it might be an album ID instead
          if (err.response?.status !== 404) throw err;
        }

        // If track fetch failed, try fetching as album
        const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const album = albumResponse.data;
        setAlbumName(album.name);

        const trackNames = album.tracks.items.map((track) => ({
          name: track.name,
          id: track.id,
          artists: track.artists.map(artist => artist.name).join(', '),
          albumImage: album.images[0]?.url,
        }));

        setSongs(trackNames);
      } catch (err) {
        console.error('Error loading songs:', err);
        setError('Failed to load songs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchData();
    }
  }, [albumId]);

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  return (
    <div className="songs-page">
      <h1>{albumName ? `${albumName} Songs` : 'Album Songs'}</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="songs-grid">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song.id}
              className="song-card"
              onClick={() => handleSongClick(song)}
            >
              <h2>{song.name}</h2>
              <p className="artist-name">{song.artists}</p>
            </div>
          ))
        ) : (
          !loading && <p>No songs found.</p>
        )}
      </div>

      {selectedSong && (
        <div className="popup">
          <div className="popup-content dark">
            <div className="song-info">
              <h2>{selectedSong.name}</h2>
              <p className="artist-name">{selectedSong.artists}</p>
            </div>
            
            <iframe
              src={`https://open.spotify.com/embed/track/${selectedSong.id}`}
              width="100%"
              height="152"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              title="Spotify Player"
            />
            
            <button onClick={() => setSelectedSong(null)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Songs;
