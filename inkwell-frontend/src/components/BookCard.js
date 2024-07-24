import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

    // Function to get the correct image URL
    const getImageUrl = (imageUrl) => {
      if (!imageUrl) return '/default-cover.jpg';
      if (imageUrl.startsWith('http')) return imageUrl;
      return `${process.env.REACT_APP_API_URL}${imageUrl}`;
    };
  
    return (
      <>
        <div className="book-card">
          <Link to={`/book/${book.id}`}>
            <img 
              src={getImageUrl(book.cover_picture)} 
              alt={`${book.title} cover`} 
              className="book-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-cover.jpg';
              }}
            />
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.uploaded_by}</p>
            </div>
          </Link>
          <button className="info-button" onClick={() => setShowOverlay(true)}>i</button>
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