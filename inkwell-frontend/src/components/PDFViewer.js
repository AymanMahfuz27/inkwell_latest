import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Viewer, Worker, ScrollMode, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { Expand } from 'lucide-react';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import '../css/PDFViewer.css';

// Define the worker URL as a constant
const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const PDFViewer = ({ pdfUrl, viewMode, onViewModeChange, onPageChange, onTotalPagesChange, currentPage }) => {
  console.log('PDFViewer render - currentPage:', currentPage);
  
  const scrollModePluginInstance = scrollModePlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const fullScreenPluginInstance = fullScreenPlugin({
    getFullScreenTarget: (pagesContainer) => 
      pagesContainer.closest('[data-testid="default-layout__body"]'),
  });

  const { switchScrollMode } = scrollModePluginInstance;
  const { jumpToPage } = pageNavigationPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;
  
  const isJumping = useRef(false);
  const jumpTimeout = useRef(null);
  const [internalCurrentPage, setInternalCurrentPage] = useState(currentPage);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (viewMode === 'horizontal') {
      switchScrollMode(ScrollMode.Horizontal);
    } else {
      switchScrollMode(ScrollMode.Vertical);
    }
  }, [viewMode, switchScrollMode]);

  useEffect(() => {
    if (currentPage !== internalCurrentPage) {
      console.log('Jumping to page:', currentPage);
      isJumping.current = true;
      setInternalCurrentPage(currentPage);
      jumpToPage(currentPage - 1);
      
      if (jumpTimeout.current) {
        clearTimeout(jumpTimeout.current);
      }
      
      jumpTimeout.current = setTimeout(() => {
        isJumping.current = false;
      }, 500);
    }
  }, [currentPage, jumpToPage]);

  const handlePageChange = useCallback((e) => {
    const newPage = e.currentPage;
    console.log('onPageChange event - new page:', newPage, 'current state:', internalCurrentPage);
    
    if (!isJumping.current && newPage !== internalCurrentPage) {
      console.log('Calling onPageChange with:', newPage);
      setInternalCurrentPage(newPage);
      onPageChange(newPage);
    }
  }, [internalCurrentPage, onPageChange]);

  const renderToolbar = (Toolbar) => (
    <Toolbar>
      {(slots) => {
        const {
          CurrentPageInput,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          ShowSearchPopover,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;

        return (
          <div className="pdf-toolbar">
            <div className="pdf-toolbar-left">
              <ShowSearchPopover />
              <ZoomOut />
              <Zoom />
              <ZoomIn />
            </div>
            <div className="pdf-toolbar-center">
              <GoToPreviousPage />
              <CurrentPageInput /> / <NumberOfPages />
              <GoToNextPage />
            </div>
            <div className="pdf-toolbar-right">
              <EnterFullScreen>
                {(props) => (
                  <button
                    className="full-screen-button"
                    onClick={props.onClick}
                    title="Enter full screen"
                  >
                    <Expand size={24} />
                  </button>
                )}
              </EnterFullScreen>
            </div>
          </div>
        );
      }}
    </Toolbar>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
    sidebarTabs: (defaultTabs) => [defaultTabs[0]],
  });

  const handleError = (error) => {
    console.error('PDF loading error:', error);
    setError('Failed to load PDF. Please try again later.');
  };

  if (error) {
    return <div className="pdf-error">{error}</div>;
  }

  return (
    <div className="pdf-viewer-container">
      <Worker workerUrl={WORKER_URL}>
        <Viewer
          fileUrl={pdfUrl}
          plugins={[
            defaultLayoutPluginInstance,
            scrollModePluginInstance,
            pageNavigationPluginInstance,
            fullScreenPluginInstance,
          ]}
          theme="dark"
          onPageChange={handlePageChange}
          onDocumentLoad={(e) => {
            console.log('onDocumentLoad event - total pages:', e.doc.numPages);
            onTotalPagesChange(e.doc.numPages);
          }}
          defaultScale={SpecialZoomLevel.PageFit}
          onError={handleError}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;