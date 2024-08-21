// src/components/LoadingScreen.js
import React from 'react';
import '../css/LoadingScreen.css';

const LoadingScreen = () => {
  const inkwellLogo = 'inkwell-logo.svg';

  return (
    
    <div className="loading-screen">
      <div className="loading-icon">
      <img src={inkwellLogo} alt="Inkwell" className="loading-logo" />
      </div>
      <p className="loading-text">Loading Inkwell...</p>
    </div>
  );
};

export default LoadingScreen;