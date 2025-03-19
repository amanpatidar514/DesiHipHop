import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getHashParams = () => {
      const hashParams = {};
      const r = /([^&;=]+)=?([^&;]*)/g;
      const q = window.location.hash.substring(1);
      let e;
      while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    };

    const params = getHashParams();
    if (params.access_token) {
      localStorage.setItem('spotify_access_token', params.access_token);
      navigate('/rappers');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#000',
      color: '#fff'
    }}>
      <h2>Connecting to Spotify...</h2>
    </div>
  );
};

export default Callback;
