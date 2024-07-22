import React from 'react';
import { Link } from 'react-router-dom';
import '../css/BookCard.css';

const BookCard = ({ book }) => {
    // Function to get the correct image URL
    const getImageUrl = (imageUrl) => {
      if (!imageUrl) return '/default-cover.jpg';
      if (imageUrl.startsWith('http')) return imageUrl;
      return `${process.env.REACT_APP_API_URL}${imageUrl}`;
    };
  
    return (
      <Link to={`/book/${book.id}`} className="book-card" >
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
          {/* <p className="book-genres">{book.genre_names ? book.genre_names.join(', ') : 'No genres'}</p> */}
        </div>
      </Link>
    );
  };
  

export default BookCard;