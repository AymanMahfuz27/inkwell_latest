import React, { useState, useEffect } from 'react';
import '../css/TextViewer.css';

const TextViewer = ({ content }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const paginateContent = () => {
      const wordsPerPage = 400; // Adjust this value as needed
      const words = content.split(/\s+/);
      const paginatedContent = [];
      for (let i = 0; i < words.length; i += wordsPerPage) {
        paginatedContent.push(words.slice(i, i + wordsPerPage).join(' '));
      }
      setPages(paginatedContent);
    };

    paginateContent();
  }, [content]);

  const changePage = (offset) => {
    setCurrentPage(prevPage => Math.max(0, Math.min(pages.length - 1, prevPage + offset)));
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight') {
        changePage(1);
      } else if (event.key === 'ArrowLeft') {
        changePage(-1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="text-viewer">
      <div className="text-viewer-content">
        {pages[currentPage]}
      </div>
      <div className="text-viewer-controls">
        <button onClick={() => changePage(-1)} disabled={currentPage === 0} className="nav-button">
          Previous
        </button>
        <span>Page {currentPage + 1} of {pages.length}</span>
        <button onClick={() => changePage(1)} disabled={currentPage === pages.length - 1} className="nav-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default TextViewer;
