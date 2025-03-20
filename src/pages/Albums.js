import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import getSpotifyToken from './getSpotifyToken';
import './Albums.css';

const Albums = () => {
  const { rapperId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rapperName, setRapperName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeChannelId, setYoutubeChannelId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getSpotifyToken();

        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${rapperId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const artistName = artistResponse.data.name;
        setRapperName(artistName);

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

        if (artistName.toLowerCase() === 'drake') {
          setYoutubeChannelId('UCByOQJjav0CUDwxCk-jVNRQ'); // Example channel ID for Drake
        }

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

      const videoId = response.data.items[0]?.id?.videoId;
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
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

      {/* All Songs of Artist from YouTube */}
      {youtubeChannelId && (
        <div className="youtube-section">
          <h2>All Songs of {rapperName}</h2>
          <div className="youtube-videos">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed?listType=user_uploads&list=${youtubeChannelId}`}
              title="YouTube Songs"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

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

      {/* Popup Player */}
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
                allowFullScreen
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
