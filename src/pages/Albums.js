import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import getSpotifyToken from './getSpotifyToken';
import './Albums.css';

const YOUTUBE_API_KEY = 'AIzaSyBeeOGvXNLLNoxEekI1G-BR0e3d5pxTgeg';

// ✅ Dummy non-album tracks to fix the undefined variable error
const nonAlbumTracks = [
  {
    name: 'Freeverse 2',
    artist: 'Talha Anjum',
    image: 'https://i.ytimg.com/vi/0YvWkBuvIEM/maxresdefault.jpg',
  },
  {
    name: 'Proof',
    artist: 'Talha Anjum',
    image: 'https://i.ytimg.com/vi/IcNPa3vUe_M/maxresdefault.jpg',
  },
  {
    name: 'Garmi',
    artist: 'Talha Anjum',
    image: 'https://i.ytimg.com/vi/FY5iSrt6Lkg/maxresdefault.jpg',
  },
];

const Albums = () => {
  const { rapperId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rapperName, setRapperName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const youtubeUrlCache = useRef({});

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
    const searchKey = `${trackName}-${artistName}`;
    if (youtubeUrlCache.current[searchKey]) return youtubeUrlCache.current[searchKey];

    try {
      const query = `${trackName} ${artistName} official audio`
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
        const youtubeEmbed = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        youtubeUrlCache.current[searchKey] = youtubeEmbed;
        return youtubeEmbed;
      }
    } catch (err) {
      console.error(`YouTube search error for ${trackName} - ${artistName}:`, err);
    }

    return '';
  };

  const handleTrackClick = async (track) => {
    setSelectedTrack(track);
    const ytUrl = await fetchYouTubeAudio(track.name, track.artists[0].name);
    setYoutubeUrl(ytUrl);
  };

  return (
    <div className="albums-page">
      <h1>{rapperName ? `${rapperName}'s Music` : 'Music'}</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="non-album-section">
        <h2>All Songs of {rapperName}</h2>
        <div className="non-album-grid">
          {nonAlbumTracks.map((track, index) => (
            <div key={index} className="song-card">
              <img src={track.image} alt={track.name} className="song-artwork" />
              <h2>{track.name}</h2>
              <p className="artist-name">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tracks Section */}
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

      {/* Audio Playback Popup */}
      {selectedTrack && youtubeUrl && (
        <div className="popup">
          <div className="popup-content dark">
            <div className="song-info">
              <img
                src={selectedTrack.album.images[0]?.url}
                alt={selectedTrack.name}
                className="track-image"
              />
              <h3>{selectedTrack.name}</h3>
              <p>{selectedTrack.artists.map(artist => artist.name).join(', ')}</p>
            </div>

            <div style={{ width: '1px', height: '1px', overflow: 'hidden' }}>
              <iframe
                width="1"
                height="1"
                src={youtubeUrl}
                title="YouTube Audio"
                allow="autoplay"
                frameBorder="0"
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
