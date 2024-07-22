import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../css/BookReader.css';

const BookReader = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/api/books/books/${bookId}/`);
        setBook(response.data);
      } catch (err) {
        setError('Failed to fetch book. Please try again later.');
      }
    };

    fetchBook();
  }, [bookId]);

  if (error) return <div className="error">{error}</div>;
  if (!book) return <div>Loading...</div>;

  const pages = book.content.split('\n\n'); // Split content into pages (adjust as needed)

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

//   debugging lines 
console.log('Book data:', book);
console.log('Pages:', pages);
console.log('Current page:', currentPage);
  return (
    <div className="book-reader">
      <h1>{book.title}</h1>
      <div className="controls">
        <button onClick={() => changeFontSize(-2)}>A-</button>
        <button onClick={() => changeFontSize(2)}>A+</button>
      </div>
      <div className="book-content" style={{ fontSize: `${fontSize}px` }}>
        {pages[currentPage]}
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 0}>Previous</button>
        <span>Page {currentPage + 1} of {pages.length}</span>
        <button onClick={nextPage} disabled={currentPage === pages.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default BookReader;