import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../css/BookReader.css';
import PDFViewer from './PDFViewer';
import TextViewer from './TextViewer';
import CoverPage from './CoverPage';
import BookInteractionPanel from './BookInteractionsPanel';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const BookReader = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [showCover, setShowCover] = useState(true);
  const [showInteractions, setShowInteractions] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/api/books/books/${bookId}/`);
        setBook(response.data);
      } catch (err) {
        console.error('Error fetching book:', err);
      }
    };

    fetchBook();
  }, [bookId]);

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

  const toggleInteractions = () => {
    setShowInteractions(!showInteractions);
  };

  return (
    <div className="book-reader">
      <div className="book-content">
        {showCover ? (
          <CoverPage book={book} onStartReading={toggleCover} />
        ) : (
          isPDF ? (
            <PDFViewer pdfUrl={pdfUrl} />
          ) : (
            <TextViewer content={book.content} />
          )
        )}
      </div>
      <div className={`interactions-panel ${showInteractions ? 'open' : ''}`}>
        <button className="toggle-interactions" onClick={toggleInteractions}>
          {showInteractions ? <ChevronRight /> : <ChevronLeft />}
        </button>
        <BookInteractionPanel bookId={bookId} />
      </div>
    </div>
  );
};

export default BookReader;

