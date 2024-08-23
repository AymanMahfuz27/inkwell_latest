import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ZoomIn, ZoomOut, Columns, AlignJustify } from 'lucide-react';
import api from '../services/api';
import '../css/BookReader.css';
import PDFViewer from './PDFViewer';
import TextViewer from './TextViewer';
import BookInteractionsPanel from './BookInteractionsPanel';

const BookReader = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [viewMode, setViewMode] = useState('vertical');
  const [zoom, setZoom] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const panelRef = useRef(null);

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

  const handleViewModeChange = useCallback((newMode) => {
    console.log('handleViewModeChange called with:', newMode);
    setViewMode(newMode);
  }, []);

  const handleZoomChange = (newZoom) => {
    setZoom(Math.max(0.5, Math.min(2, newZoom)));
  };


  const handleZoom = useCallback((direction) => {
    console.log('handleZoom called with direction:', direction);
    setZoom(prevZoom => Math.max(0.5, Math.min(2, prevZoom + direction * 0.1)));
  }, []);

  // const handlePageChange = useCallback((pageNumber) => {
  //   console.log('BookReader handlePageChange called with:', pageNumber);
  //   if (pageNumber > 0 && pageNumber <= totalPages && pageNumber !== currentPage) {
  //     setCurrentPage(pageNumber);
  //   }
  // }, [totalPages, currentPage]);

  const handlePageChange = (newPage, newTotalPages) => {
    setCurrentPage(newPage);
    setTotalPages(newTotalPages);
  };
  

  const handleTotalPagesChange = useCallback((pages) => {
    console.log('handleTotalPagesChange called with:', pages);
    setTotalPages(pages);
  }, []);

  useEffect(() => {
    console.log('BookReader - currentPage changed:', currentPage);
  }, [currentPage]);

  if (!book) return <div>Loading...</div>;

  const isPDF = book.pdf_file && book.pdf_file.toLowerCase().endsWith('.pdf');

  return (
    <div className="book-reader">
      <div className="book-content-container">
        {/* <div className="book-content-controls">
          {isPDF ? null : (
            <>
              <button onClick={() => handleViewModeChange('horizontal')} title="Horizontal View">
                <Columns />
              </button>
              <button onClick={() => handleViewModeChange('vertical')} title="Vertical View">
                <AlignJustify />
              </button>
              <button onClick={() => handleZoom(0.1)} title="Zoom In"><ZoomIn /></button>
              <button onClick={() => handleZoom(-0.1)} title="Zoom Out"><ZoomOut /></button>
            </>
          )}
        </div> */}
        <div className="book-content-scroll">
          {isPDF ? (
            <PDFViewer 
              pdfUrl={book.pdf_file}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onPageChange={handlePageChange}
              onTotalPagesChange={handleTotalPagesChange}
              currentPage={currentPage}
            />
          ) : (
            <TextViewer 
      content={book.content}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      viewMode={viewMode}
      onViewModeChange={handleViewModeChange}
      zoom={zoom}
      onZoomChange={handleZoomChange}
    />

          )}
        </div>
      </div>
      <div ref={panelRef}>
        <BookInteractionsPanel 
          bookId={bookId}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onOpen={() => setIsPanelOpen(true)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BookReader;