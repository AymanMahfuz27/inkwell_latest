import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import '../css/BookReader.css';
import PDFViewer from './PDFViewer';
import TextViewer from './TextViewer';
import BookInteractionsPanel from './BookInteractionsPanel';

const BookReader = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('horizontal');
  const [zoom, setZoom] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/api/books/books/${bookId}/`);
        setBook(response.data);
        if (response.data.content) {
          const wordsPerPage = 400;
          const words = response.data.content.split(/\s+/);
          setTotalPages(Math.ceil(words.length / wordsPerPage));
        }
      } catch (err) {
        console.error('Error fetching book:', err);
      }
    };

    fetchBook();
  }, [bookId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageChange = (newPage, newTotalPages) => {
    setCurrentPage(newPage);
    if (newTotalPages) setTotalPages(newTotalPages);
  };

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
  };

  const handleZoom = (direction) => {
    setZoom(prevZoom => Math.max(0.5, Math.min(2, prevZoom + direction * 0.1)));
  };

  if (!book) return <div>Loading...</div>;

  const isPDF = book.pdf_file && book.pdf_file.toLowerCase().endsWith('.pdf');

  return (
    <div className="book-reader">
      <div className="book-content-container">
        <div className="book-content-controls">
          {viewMode === 'horizontal' && (
            <>
              <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                <ChevronLeft /> Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                Next <ChevronRight />
              </button>
            </>
          )}
          <button onClick={() => handleZoom(1)}><ZoomIn /></button>
          <button onClick={() => handleZoom(-1)}><ZoomOut /></button>
        </div>
        <div className="book-content-scroll">
          {isPDF ? (
            <PDFViewer 
              pdfUrl={book.pdf_file}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              viewMode={viewMode}
              zoom={zoom}
            />
          ) : (
            <TextViewer 
              content={book.content}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              viewMode={viewMode}
              zoom={zoom}
            />
          )}
        </div>
      </div>
      <div ref={panelRef}>
        <BookInteractionsPanel 
          bookId={bookId}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onOpen={() => setIsPanelOpen(true)}
        />
      </div>
    </div>
  );
};

export default BookReader;