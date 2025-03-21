import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Songs.css';

const SPOTIFY_CLIENT_ID = '7c51bc90b0884fa5afc2d1420b995a61';
const SPOTIFY_CLIENT_SECRET = 'b66594a7b0b74f2d8ebce2e715418bbc';
const YOUTUBE_API_KEY = 'AIzaSyBeeOGvXNLLNoxEekI1G-BR0e3d5pxTgeg';

const Songs = () => {
  const { albumId } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const youtubeUrlCache = useRef({});

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
      console.error('Spotify token refresh failed:', err);
      return null;
    }
  };

  const getYouTubeVideoId = async (songName, artistName) => {
    const searchKey = `${songName}-${artistName}`;
    if (youtubeUrlCache.current[searchKey]) return youtubeUrlCache.current[searchKey];

    try {
      const query = `${songName} by ${artistName} official audio`
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .trim();

      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1,
        },
      });

      const video = response.data.items[0];
      if (video) {
        const videoId = video.id.videoId;
        const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        youtubeUrlCache.current[searchKey] = youtubeUrl;
        return youtubeUrl;
      }
    } catch (err) {
      console.error(`YouTube search error for ${songName} - ${artistName}:`, err);
    }

    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await refreshSpotifyToken();
        if (!token) throw new Error('Spotify token issue');

        const trackRes = await axios.get(`https://api.spotify.com/v1/tracks/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const track = trackRes.data;
        setAlbumName(track.album.name);
        setSongs([{
          name: track.name,
          id: track.id,
          artists: track.artists.map(a => a.name).join(', '),
          albumImage: track.album.images[0]?.url,
        }]);
      } catch (err) {
        try {
          const token = await refreshSpotifyToken();
          const albumRes = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const album = albumRes.data;
          setAlbumName(album.name);
          setSongs(album.tracks.items.map(track => ({
            name: track.name,
            id: track.id,
            artists: track.artists.map(a => a.name).join(', '),
            albumImage: album.images[0]?.url,
          })));
        } catch (innerErr) {
          console.error('Error loading songs:', innerErr);
          setError('Failed to load songs.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [albumId]);

  const handleSongClick = async (song) => {
    const youtubeUrl = await getYouTubeVideoId(song.name, song.artists);
    if (youtubeUrl) {
      setSelectedSong({ ...song, youtubeUrl });
    } else {
      alert('YouTube video not found!');
    }
  };

  return (
    <div className="songs-page">
      <h1>{albumName ? `${albumName} Songs` : 'Songs'}</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="songs-grid">
        {songs.map(song => (
          <div key={song.id} className="song-card" onClick={() => handleSongClick(song)}>
            <h3 className="song-title">{song.name}</h3>
            <p className="artist-name">{song.artists}</p>
          </div>
        ))}
      </div>

      {selectedSong && selectedSong.youtubeUrl && (
        <div className="popup">
          <div className="popup-content dark">
            <div className="song-info">
              <img
                src={selectedSong.albumImage}
                alt={selectedSong.name}
                className="track-image"
              />
              <h3>{selectedSong.name}</h3>
              <p>{selectedSong.artists}</p>
            </div>

            <div style={{ width: '1px', height: '1px', overflow: 'hidden' }}>
              <iframe
                width="1"
                height="1"
                src={selectedSong.youtubeUrl}
                allow="autoplay"
                frameBorder="0"
                title="YouTube Audio"
              />
            </div>

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
