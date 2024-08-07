// src/components/LoadingScreen.js
import React from 'react';
import '../css/LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-icon">
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#3291ff" strokeLinecap="round" />
        </svg>
      </div>
      <p className="loading-text">Loading Inkwell...</p>
    </div>
  );
};

export default LoadingScreen;