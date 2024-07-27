// src/components/BookReader.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../css/BookReader.css';
import PDFViewer from './PDFViewer';
import CoverPage from './CoverPage';
import BookInteractionPanel from './BookInteractionsPanel';

const BookReader = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [error, setError] = useState(null);
  const [showCover, setShowCover] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/api/books/books/${bookId}/`);
        setBook(response.data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to fetch book. Please try again later.');
      }
    };

    fetchBook();
  }, [bookId]);

  if (error) return <div className="error">{error}</div>;
  if (!book) return <div>Loading...</div>;

  const isPDF = book.pdf_file && typeof book.pdf_file === 'string' && book.pdf_file.toLowerCase().endsWith('.pdf');

  let pdfUrl = null;
  if (isPDF) {
    pdfUrl = book.pdf_file.startsWith('http')
      ? book.pdf_file
      : `${process.env.REACT_APP_API_URL}${book.pdf_file}`;
  }

  const toggleCover = () => {
    setShowCover(!showCover);
  };

  const renderBookContent = () => {
    if (isPDF && pdfUrl) {
      return (
        <>
          {showCover ? (
            <CoverPage book={book} />
          ) : (
            <PDFViewer pdfUrl={pdfUrl} />
          )}
          <button onClick={toggleCover}>
            {showCover ? 'Start Reading' : 'Show Cover'}
          </button>
        </>
      );
    } else {
      // Text content handling
      const pages = [''].concat(book.content.split('\n\n'));

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
        <>
          {currentPage === 0 ? (
            <CoverPage book={book} />
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
        </>
      );
    }
  };

  return (
    <div className="book-reader">
      {renderBookContent()}
      <BookInteractionPanel bookId={bookId} />
    </div>
  );
};

export default BookReader;