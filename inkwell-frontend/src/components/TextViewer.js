import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Columns, AlignJustify } from 'lucide-react';
import '../css/TextViewer.css';

const TextViewer = ({ 
  content, 
  currentPage, 
  totalPages, 
  onPageChange, 
  viewMode, 
  onViewModeChange,
  zoom,
  onZoomChange
}) => {
  const [pages, setPages] = useState([]);
  const viewerRef = useRef(null);
  const [goToPage, setGoToPage] = useState('');
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

  useEffect(() => {
    const paginateContent = () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = DOMPurify.sanitize(content);

      const pageBreakChar = '<!--pagebreak-->';
      const maxWordsPerPage = 500;
      let pageContents = [];
      let currentPageContent = '';
      let wordCount = 0;

      const addToPage = (node) => {
        const nodeContent = node.outerHTML || node.textContent;
        
        if (nodeContent.includes(pageBreakChar)) {
          if (currentPageContent) {
            pageContents.push(currentPageContent);
            currentPageContent = '';
            wordCount = 0;
          }
          return;
        }
        
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.trim().split(/\s+/);
          for (let word of words) {
            if (wordCount >= maxWordsPerPage) {
              pageContents.push(currentPageContent);
              currentPageContent = '';
              wordCount = 0;
            }
            currentPageContent += word + ' ';
            wordCount++;
          }
        } else {
          currentPageContent += nodeContent;
        }
      };

      tempDiv.childNodes.forEach((node) => {
        addToPage(node);
      });

      if (currentPageContent) {
        pageContents.push(currentPageContent);
      }

      setPages(pageContents);
      onPageChange(localCurrentPage, pageContents.length);
    };

    paginateContent();
  }, [content, onPageChange, localCurrentPage]);

  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (localCurrentPage < pages.length) {
      const newPage = localCurrentPage + 1;
      setLocalCurrentPage(newPage);
      onPageChange(newPage, pages.length);
    }
  };

  const handlePrevPage = () => {
    if (localCurrentPage > 1) {
      const newPage = localCurrentPage - 1;
      setLocalCurrentPage(newPage);
      onPageChange(newPage, pages.length);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber >= 1 && pageNumber <= pages.length) {
      setLocalCurrentPage(pageNumber);
      onPageChange(pageNumber, pages.length);
      setGoToPage('');
    }
  };

  const createMarkup = (html) => {
    return {__html: DOMPurify.sanitize(html)};
  };

  return (
    <div className="text-viewer-container">
      <div className="text-viewer-toolbar">
        <button onClick={handlePrevPage} disabled={localCurrentPage === 1}>
          <ChevronLeft />
        </button>
        <div className="page-navigation">
          <input 
            type="number" 
            value={goToPage} 
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
          />
          <span>{localCurrentPage} / {pages.length}</span>
        </div>
        <button onClick={handleNextPage} disabled={localCurrentPage === pages.length}>
          <ChevronRight />
        </button>
        <button onClick={() => onZoomChange(zoom + 0.1)}>
          <ZoomIn />
        </button>
        <button onClick={() => onZoomChange(zoom - 0.1)}>
          <ZoomOut />
        </button>
        <button onClick={() => onViewModeChange('horizontal')} className={viewMode === 'horizontal' ? 'active' : ''}>
          <Columns />
        </button>
        <button onClick={() => onViewModeChange('vertical')} className={viewMode === 'vertical' ? 'active' : ''}>
          <AlignJustify />
        </button>
      </div>
      <div 
        ref={viewerRef}
        className={`text-viewer-content ${viewMode}`}
        style={{ fontSize: `${zoom * 100}%` }}
      >
        {viewMode === 'horizontal' ? (
          <div 
            className="page"
            dangerouslySetInnerHTML={createMarkup(pages[localCurrentPage - 1] || '')}
          />
        ) : (
          pages.map((page, index) => (
            <div key={index}>
              <div 
                className="page"
                dangerouslySetInnerHTML={createMarkup(page)}
              />
              {index < pages.length - 1 && <div className="page-break"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TextViewer;