import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import '../css/BookCard.css';
import BookOverlay from './BookOverlay';

const BookCard = ({ book, onLikeUpdate }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [localBook, setLocalBook] = useState(book);

  const handleLikeUpdate = (newLikeCount, newIsLiked) => {
    setLocalBook(prevBook => ({
      ...prevBook,
      like_count: newLikeCount,
      is_liked: newIsLiked
    }));
    if (onLikeUpdate) onLikeUpdate(book.id, newLikeCount, newIsLiked);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/default-cover.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${process.env.REACT_APP_API_URL}${imageUrl}`;
  };

  return (
    <>
      <div className="inkwell-bookcard-container">
        <Link to={`/book/${book.id}`} className="inkwell-bookcard-link">
          <div className="inkwell-bookcard-cover-wrapper">
            <img 
              src={getImageUrl(book.cover_picture)} 
              alt={`${book.title} cover`} 
              className="inkwell-bookcard-cover-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-cover.jpg';
              }}
            />
          </div>
          <div className="inkwell-bookcard-info">
            <h3 className="inkwell-bookcard-title">{book.title}</h3>
            <p className="inkwell-bookcard-author">{book.uploaded_by}</p>
          </div>
        </Link>
        <button className="inkwell-bookcard-info-button" onClick={() => setShowOverlay(true)} aria-label="More information">
          <Info size={20} />
        </button>
      </div>
      {showOverlay && (
        <BookOverlay 
          book={localBook} 
          onClose={() => setShowOverlay(false)} 
          onLikeUpdate={handleLikeUpdate}
        />
      )}
    </>
  );
};

export default BookCard;