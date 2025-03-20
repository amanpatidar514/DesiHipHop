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
  const [youtubeVideoId, setYoutubeVideoId] = useState('');

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

  const fetchYouTubeVideoId = async (trackName, artistName) => {
    const query = encodeURIComponent(`${trackName} ${artistName}`);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            q: query,
            maxResults: 1,
            key: 'AIzaSyBJuSBqKk36m9bgt7-OB3uNmhOmLaPOGSU',
          },
        }
      );

      const videoId = response.data.items[0]?.id?.videoId;
      return videoId || '';
    } catch (err) {
      console.error('Error fetching YouTube video ID:', err);
      return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = await refreshSpotifyToken();
        if (!token) throw new Error('Unable to refresh token.');

        try {
          const trackRes = await axios.get(`https://api.spotify.com/v1/tracks/${albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const track = trackRes.data;
          setAlbumName(track.album.name);
          setSongs([
            {
              name: track.name,
              id: track.id,
              artists: track.artists.map((a) => a.name).join(', '),
              albumImage: track.album.images[0]?.url,
            },
          ]);
          return;
        } catch (err) {
          if (err.response?.status !== 404) throw err;
        }

        const albumRes = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const album = albumRes.data;
        setAlbumName(album.name);

        const trackList = album.tracks.items.map((track) => ({
          name: track.name,
          id: track.id,
          artists: track.artists.map((a) => a.name).join(', '),
          albumImage: album.images[0]?.url,
        }));

        setSongs(trackList);
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

  const handleSongClick = async (song) => {
    const videoId = await fetchYouTubeVideoId(song.name, song.artists);
    if (videoId) {
      setYoutubeVideoId(videoId);
      setSelectedSong(song);
    } else {
      alert('YouTube video not found!');
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

      {selectedSong && youtubeVideoId && (
        <div className="popup">
          <div className="popup-content dark">
            <div className="song-info">
              <h2>{selectedSong.name}</h2>
              <p className="artist-name">{selectedSong.artists}</p>
            </div>

            <div className="youtube-audio-wrapper">
              <iframe
                title="YouTube Music"
                width="0"
                height="0"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
              ></iframe>
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
