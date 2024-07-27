import React from 'react';
import { Minus, Plus, Moon, Sun, Menu } from 'lucide-react';

const BookHeader = ({
  book,
  currentPage,
  totalPages,
  fontSize,
  changeFontSize,
  toggleTheme,
  toggleInteractions,
  theme
}) => {
  return (
    <header className="book-header">
      <div className="book-info">
        <h1>{book.title}</h1>
        <p>{book.uploaded_by}</p>
      </div>
      <div className="page-info">
        Page {currentPage + 1} of {totalPages}
      </div>
      <div className="controls">
        <button onClick={() => changeFontSize(-2)} aria-label="Decrease font size">
          <Minus size={16} />
        </button>
        <button onClick={() => changeFontSize(2)} aria-label="Increase font size">
          <Plus size={16} />
        </button>
        <button onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <button onClick={toggleInteractions} aria-label="Toggle interactions panel">
          <Menu size={16} />
        </button>
      </div>
    </header>
  );
};

export default BookHeader;