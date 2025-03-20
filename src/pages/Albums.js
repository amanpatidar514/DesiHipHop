import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import getSpotifyToken from './getSpotifyToken';
import YouTube from 'react-youtube';
import './Albums.css';

const Albums = () => {
  const { rapperId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rapperName, setRapperName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  const playerRef = useRef(null);

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

  const fetchYouTubeAudio = async (trackName, artistName) => {
    try {
      const query = `${trackName} ${artistName}`;
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyBeeOGvXNLLNoxEekI1G-BR0e3d5pxTgeg',
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1
        }
      });

      return response.data.items[0]?.id?.videoId || '';
    } catch (err) {
      console.error(`YouTube search error for ${trackName} - ${artistName}:`, err);
      return '';
    }
  };

  const handleTrackClick = async (track) => {
    setSelectedTrack(track);
    const id = await fetchYouTubeAudio(track.name, track.artists[0].name);
    setVideoId(id);
    setIsPlaying(true);
  };

  const onPlayerReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    playerRef.current = event.target;
  };

  const handlePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (player) player.setVolume(newVolume);
  };

  return (
    <div className="albums-page">
      <h1>{rapperName ? `${rapperName}'s Music` : 'Music'}</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="tracks-section">
        <h2>Popular Tracks</h2>
        <div className="albums-grid">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="album-card"
              onClick={() => handleTrackClick(track)}
            >
              <img src={track.album.images[0]?.url} alt={track.name} />
              <h3>{track.name}</h3>
              <p>{track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

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

      {selectedTrack && videoId && (
        <div className="popup">
          <div className="popup-content dark">
            <div className="song-info">
              <img src={selectedTrack.album.images[0]?.url} alt={selectedTrack.name} className="track-image" />
              <h3>{selectedTrack.name}</h3>
              <p>{selectedTrack.artists.map(artist => artist.name).join(', ')}</p>
            </div>

            <YouTube
              videoId={videoId}
              opts={{ height: '1', width: '1', playerVars: { autoplay: 1 } }}
              onReady={onPlayerReady}
              style={{ display: 'none' }}
            />

            <div className="custom-controls">
              <button onClick={handlePlayPause} className="control-button">
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <button onClick={() => setSelectedTrack(null)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Albums;