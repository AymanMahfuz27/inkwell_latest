
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../css/PDFViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => Math.max(1, Math.min(numPages, prevPageNumber + offset)));
  };

  const changeScale = (delta) => {
    setScale(prevScale => Math.max(0.5, Math.min(2, prevScale + delta)));
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-document">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('Error loading PDF:', error)}
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
      <div className="pdf-controls">
        <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="nav-button">Previous</button>
        <span>Page {pageNumber} of {numPages}</span>
        <button onClick={() => changePage(1)} disabled={pageNumber >= numPages} className="nav-button">Next</button>
        <button onClick={() => changeScale(-0.1)} className="nav-button">Zoom Out</button>
        <button onClick={() => changeScale(0.1)} className="nav-button">Zoom In</button>
      </div>
    </div>
  );
};

export default PDFViewer;
