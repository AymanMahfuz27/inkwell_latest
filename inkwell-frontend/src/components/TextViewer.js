import React, { useState } from 'react';
import '../css/TextViewer.css';

const TextViewer = ({ content }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const pages = [''].concat(content.split('\n\n'));

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeFontSize = (delta) => {
    setFontSize(prevSize => Math.max(12, Math.min(24, prevSize + delta)));
  };

  return (
    <div className="text-viewer">
      {currentPage === 0 ? (
        <div className="cover-page">
          <p>Cover Page</p>
          {/* Add more cover page content here if needed */}
        </div>
      ) : (
        <>
          <div className="controls">
            <button onClick={() => changeFontSize(-2)}>A-</button>
            <button onClick={() => changeFontSize(2)}>A+</button>
          </div>
          <div className="book-content" style={{ fontSize: `${fontSize}px` }}>
            {pages[currentPage]}
          </div>
        </>
      )}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 0}>Previous</button>
        <span>Page {currentPage} of {pages.length - 1}</span>
        <button onClick={nextPage} disabled={currentPage === pages.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default TextViewer;
