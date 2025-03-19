import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const goToRappersPage = () => {
    navigate('/rappers');
  };

  return (
    <div className="homepage">
      <div className="content">
        <h1>Desi Hip-Hop</h1>
        <div className="logo">
          <img src="/images/logo.jpeg" alt="Desi Hip-Hop Logo" />
        </div>
        <div className="navigate-box">
          <p>Explore the best DHH rappers and their albums.</p>
          <button onClick={goToRappersPage}>Start Listening</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
