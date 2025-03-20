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
  const [audiusTracksCache, setAudiusTracksCache] = useState({});
  const [popularAudiusTracks, setPopularAudiusTracks] = useState([]);

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

  const searchAudiusTrack = async (query) => {
    if (audiusTracksCache[query]) {
      return audiusTracksCache[query];
    }

    try {
      const response = await axios.get(
        `https://discoveryprovider.audius.co/v1/tracks/search`,
        { params: { query, limit: 1 } }
      );
      const track = response.data.data[0];
      setAudiusTracksCache((prev) => ({ ...prev, [query]: track }));
      return track;
    } catch (err) {
      console.error('Audius search failed for:', query, err);
      return null;
    }
  };

  const fetchPopularAudiusTracks = async () => {
    try {
      const response = await axios.get(
        'https://discoveryprovider.audius.co/v1/tracks/trending',
        { params: { limit: 6 } }
      );
      setPopularAudiusTracks(response.data.data);
    } catch (err) {
      console.error('Failed to fetch popular Audius tracks:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const token = await refreshSpotifyToken();
        if (!token) throw new Error('Unable to refresh token.');

        // Try to fetch as a single track first
        try {
          const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

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
          if (err.response?.status !== 404) throw err;
        }

        // If not a single track, try fetching an album
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

    fetchPopularAudiusTracks();
  }, [albumId]);

  const handleSongClick = async (song) => {
    const query = `${song.name} ${song.artists}`;
    const audiusTrack = await searchAudiusTrack(query);
    if (audiusTrack) {
      setSelectedSong({ ...song, audius: audiusTrack });
    } else {
      alert('Song not available on Audius.');
    }
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

      {selectedSong && selectedSong.audius && (
        <div className="popup">
          <div className="popup-content dark">
            <div className="song-info">
              <h2>{selectedSong.name}</h2>
              <p className="artist-name">{selectedSong.artists}</p>
            </div>

            <audio
              controls
              autoPlay
              src={`https://discoveryprovider.audius.co/v1/tracks/${selectedSong.audius.id}/stream`}
            />

            <button onClick={() => setSelectedSong(null)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}

      <h2 className="section-title">Popular Audius Tracks</h2>
      <div className="songs-grid">
        {popularAudiusTracks.map((track) => (
          <div
            key={track.id}
            className="song-card"
            onClick={() => setSelectedSong({ name: track.title, artists: track.user.name, audius: track })}
          >
            <h3>{track.title}</h3>
            <p className="artist-name">{track.user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Songs;
