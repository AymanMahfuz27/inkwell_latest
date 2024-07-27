import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const BookNavigation = ({ onNavigate }) => {
  return (
    <div className="book-navigation">
      <button
        className="nav-button prev"
        onClick={() => onNavigate('prev')}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>
      <button
        className="nav-button next"
        onClick={() => onNavigate('next')}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default BookNavigation;