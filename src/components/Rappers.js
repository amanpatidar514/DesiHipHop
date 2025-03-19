import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Rappers.css';


const Rappers = () => {
  const navigate = useNavigate();

  const handleRapperClick = (rapperName) => {
    navigate(`/albums?rapper=${encodeURIComponent(rapperName)}`);
  };

  return (
    <div className="rappers-page">
      <h1>Indian Rappers</h1>
      <div className="rapper-grid">
        {rappers.map((rapper, index) => (
          <div
            key={index}
            className="rapper-card"
            onClick={() => handleRapperClick(rapper.name)}
          >
            <img src={rapper.image} alt={rapper.name} />
            <h2>{rapper.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rappers;
