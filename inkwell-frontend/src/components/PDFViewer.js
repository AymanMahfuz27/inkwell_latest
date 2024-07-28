import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../css/PDFViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

const PDFViewer = ({ pdfUrl, currentPage, onPageChange, viewMode, zoom }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    onPageChange(1, numPages);  // Pass total pages to parent component
  };

  const handlePageRenderSuccess = (pageNumber) => {
    if (viewMode === 'vertical') {
      onPageChange(pageNumber, numPages);
    }
  };

  return (
    <div className={`pdf-viewer ${viewMode}`}>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('Error loading PDF:', error)}
      >
        {viewMode === 'horizontal' ? (
          <Page 
            pageNumber={currentPage} 
            scale={zoom}
            onRenderSuccess={() => handlePageRenderSuccess(currentPage)}
          />
        ) : (
          Array.from(new Array(numPages), (el, index) => (
            <Page 
              key={`page_${index + 1}`} 
              pageNumber={index + 1} 
              scale={zoom}
              onRenderSuccess={() => handlePageRenderSuccess(index + 1)}
              loading={<div className="page-loading">Loading page {index + 1}...</div>}
            />
          ))
        )}
      </Document>
    </div>
  );
};

export default PDFViewer;