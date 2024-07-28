import React, { useState, useEffect } from 'react';
import '../css/TextViewer.css';

const TextViewer = ({ content, currentPage, totalPages, onPageChange, viewMode, zoom }) => {
  const [pages, setPages] = useState([]);
  const baseFontSize = 16; // Base font size in pixels

  useEffect(() => {
    const paginateContent = () => {
      const wordsPerPage = 400;
      const words = content.split(/\s+/);
      const paginatedContent = [];
      for (let i = 0; i < words.length; i += wordsPerPage) {
        paginatedContent.push(words.slice(i, i + wordsPerPage).join(' '));
      }
      setPages(paginatedContent);
    };

    paginateContent();
  }, [content]);

  const textStyle = {
    fontSize: `${baseFontSize * zoom}px`,
  };

  return (
    <div className={`text-viewer ${viewMode}`} style={textStyle}>
      {viewMode === 'horizontal' ? (
        <div className="page" style={textStyle}>{pages[currentPage - 1]}</div>
      ) : (
        pages.map((page, index) => (
          <div key={index} className="page" style={textStyle}>{page}</div>
        ))
      )}
    </div>
  );
};

export default TextViewer;