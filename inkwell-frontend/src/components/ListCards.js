// src/components/ListCards.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, User, Tag, Star, Eye, Clock } from 'lucide-react';
import '../css/ListCards.css';

export const BookListCard = ({ book }) => (
  <div className="inkwell-list-card book-list-card">
    <img 
      src={book.cover_picture || '/default-cover.jpg'} 
      alt={`${book.title} cover`} 
      className="book-list-card-cover"
    />
    <div className="book-list-card-info">
      <h3 className="book-list-card-title">{book.title}</h3>
      <p className="book-list-card-author">by {book.uploaded_by}</p>
      <p className="book-list-card-description">{book.description.slice(0, 150)}...</p>
      <div className="book-list-card-meta">
        <span><Star size={16} /> {book.average_rating || 'N/A'}</span>
        <span><Eye size={16} /> {book.view_count}</span>
        <span><Clock size={16} /> {new Date(book.upload_date).toLocaleDateString()}</span>
      </div>
      <div className="book-list-card-genres">
        {book.genre_names.map((genre, index) => (
          <span key={index} className="book-list-card-genre">{genre}</span>
        ))}
      </div>
    </div>
    <Link to={`/book/${book.id}`} className="book-list-card-link">
      <Book size={24} />
      Read Now
    </Link>
  </div>
);

export const UserListCard = ({ user }) => (
  <div className="inkwell-list-card user-list-card">
    <img 
      src={user.profile_picture || '/default-avatar.jpg'} 
      alt={`${user.username}'s avatar`} 
      className="user-list-card-avatar"
    />
    <div className="user-list-card-info">
      <h3 className="user-list-card-username">{user.username}</h3>
      <p className="user-list-card-name">{user.first_name} {user.last_name}</p>
      <p className="user-list-card-bio">{user.bio?.slice(0, 100)}...</p>
    </div>
    <Link to={`/profile/${user.username}`} className="user-list-card-link">
      <User size={24} />
      View Profile
    </Link>
  </div>
);

export const GenreListCard = ({ genre }) => (
  <div className="inkwell-list-card genre-list-card">
    <Tag size={24} className="genre-list-card-icon" />
    <div className="genre-list-card-info">
      <h3 className="genre-list-card-name">{genre.name}</h3>
      <p className="genre-list-card-count">{genre.book_count} books</p>
    </div>
    <Link to={`/genres/${genre.id}`} className="genre-list-card-link">
      Explore Genre
    </Link>
  </div>
);