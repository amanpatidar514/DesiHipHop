import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      if (accessToken) {
        // Store the token in localStorage
        localStorage.setItem('spotify_access_token', accessToken);

        // Clean up the URL by removing the hash
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to rappers page
        navigate('/rappers');
      } else {
        // If no access token is found, navigate to home or show error
        navigate('/');
      }
    }
  }, [navigate]);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
      <h2 style={{ color: '#fff' }}>Loading...</h2>
    </div>
  );
};

export default Callback;
