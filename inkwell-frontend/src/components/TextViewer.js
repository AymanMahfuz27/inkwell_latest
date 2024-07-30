import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import '../css/TextViewer.css';

const TextViewer = ({ content, currentPage, totalPages, onPageChange, viewMode, zoom }) => {
  const [pages, setPages] = useState([]);
  const baseFontSize = 16;

  useEffect(() => {
    // const paginateContent = () => {
    //   const isHTML = /<[a-z][\s\S]*>/i.test(content);
    //   let pageContents = [];

    //   if (isHTML) {
    //     // Rich text content handling
    //     const tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = DOMPurify.sanitize(content);

    //     const pageBreakElements = ['H1', 'H2'];
    //     const elementsPerPage = 5;
    //     let currentPageContent = '';
    //     let elementCount = 0;

    //     tempDiv.childNodes.forEach((node) => {
    //       if (node.nodeType === Node.ELEMENT_NODE) {
    //         if ((pageBreakElements.includes(node.tagName) && currentPageContent !== '') || elementCount >= elementsPerPage) {
    //           pageContents.push(currentPageContent);
    //           currentPageContent = '';
    //           elementCount = 0;
    //         }
            
    //         currentPageContent += node.outerHTML;
    //         elementCount++;
    //       }
    //     });

    //     if (currentPageContent !== '') {
    //       pageContents.push(currentPageContent);
    //     }
    //   } else {
    //     // Plain text content handling
    //     const wordsPerPage = 300;
    //     const words = content.split(/\s+/);

    //     for (let i = 0; i < words.length; i += wordsPerPage) {
    //       pageContents.push(words.slice(i, i + wordsPerPage).join(' '));
    //     }
    //   }

    //   setPages(pageContents);
    //   onPageChange(Math.min(currentPage, pageContents.length), pageContents.length);
    // };

    const paginateContent = () => {
      const isHTML = /<[a-z][\s\S]*>/i.test(content);
      let pageContents = [];
    
      if (isHTML) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = DOMPurify.sanitize(content);
    
        const pageBreakChar = '<!--pagebreak-->';
        const pageBreakElements = ['H1', 'H2'];
        const maxCharactersPerPage = 3000; // Adjust as needed
        
        let currentPageContent = '';
        let currentPageCharCount = 0;
    
        const addToPage = (node) => {
          const nodeContent = node.outerHTML || node.textContent;
          currentPageContent += nodeContent;
          currentPageCharCount += nodeContent.length;
    
          if (currentPageCharCount >= maxCharactersPerPage) {
            pageContents.push(currentPageContent);
            currentPageContent = '';
            currentPageCharCount = 0;
          }
        };
    
        tempDiv.childNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'HR' && node.className === 'page-break') {
              // Manual page break
              if (currentPageContent) {
                pageContents.push(currentPageContent);
                currentPageContent = '';
                currentPageCharCount = 0;
              }
            } else if (pageBreakElements.includes(node.tagName)) {
              // New section (H1 or H2)
              if (currentPageContent && (currentPageCharCount > maxCharactersPerPage / 2)) {
                pageContents.push(currentPageContent);
                currentPageContent = '';
                currentPageCharCount = 0;
              }
              addToPage(node);
            } else {
              addToPage(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            // Handle text nodes (e.g., between elements)
            addToPage(node);
          }
        });
    
        if (currentPageContent) {
          pageContents.push(currentPageContent);
        }
      } else {
        // Plain text content handling
        const wordsPerPage = 500; // Adjust as needed
        const words = content.split(/\s+/);
    
        for (let i = 0; i < words.length; i += wordsPerPage) {
          pageContents.push(words.slice(i, i + wordsPerPage).join(' '));
        }
      }
    
      setPages(pageContents);
      onPageChange(Math.min(currentPage, pageContents.length), pageContents.length);
    };

    paginateContent();
  }, [content, onPageChange, currentPage]);

  const textStyle = {
    fontSize: `${baseFontSize * zoom}px`,
  };

  const createMarkup = (html) => {
    return {__html: DOMPurify.sanitize(html)};
  }

  return (
    <div className={`text-viewer ${viewMode}`} style={textStyle}>
      {viewMode === 'horizontal' ? (
        <div 
          className="page" 
          style={textStyle}
          dangerouslySetInnerHTML={createMarkup(pages[currentPage - 1] || '')}
        />
      ) : (
        pages.map((page, index) => (
          <div 
            key={index} 
            className="page" 
            style={textStyle}
            dangerouslySetInnerHTML={createMarkup(page)}
          />
        ))
      )}
    </div>
  );
};

export default TextViewer;