import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { isAuthenticated } from '../services/authService';
import '../css/BookOverlay.css';

const BookOverlay = ({ book, onClose, onLikeUpdate }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isLiked, setIsLiked] = useState(book.is_liked);
  const [likeCount, setLikeCount] = useState(book.like_count);
  const [pageCount, setPageCount] = useState(book.page_count || 'Calculating...');

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCollections();
    }
    calculatePageCount();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await api.get('/api/users/collections/');
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const calculatePageCount = async () => {
    if (book.content) {
      // For text books
      const pages = book.content.split('\n\n').length;
      setPageCount(pages);
    } else if (book.pdf_file) {
      // For PDF books
      try {
        const response = await api.get(`/api/books/books/${book.id}/page_count/`);
        setPageCount(response.data.page_count);
      } catch (error) {
        console.error('Error fetching page count:', error);
        setPageCount('Unable to calculate');
      }
    }
  };

  const handleAddToCollection = async () => {
    if (!isAuthenticated()) {
      alert('Please log in to add books to collections.');
      return;
    }
    if (selectedCollection === 'new') {
      await createNewCollection();
    } else {
      try {
        await api.post(`/api/users/collections/${selectedCollection}/add_book/`, { book_id: book.id });
        alert('Book added to collection successfully');
      } catch (error) {
        console.error('Error adding book to collection:', error);
        alert('Failed to add book to collection');
      }
    }
  };

  const createNewCollection = async () => {
    if (!newCollectionName.trim()) {
      alert('Please enter a name for the new collection');
      return;
    }
    try {
      const response = await api.post('/api/users/collections/', { name: newCollectionName });
      const newCollection = response.data;
      setCollections([...collections, newCollection]);
      setSelectedCollection(newCollection.id);
      setNewCollectionName('');
      await api.post(`/api/users/collections/${newCollection.id}/add_book/`, { book_id: book.id });
      alert('New collection created and book added successfully');
    } catch (error) {
      console.error('Error creating new collection:', error);
      alert('Failed to create new collection');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
      alert('Please log in to like books.');
      return;
    }
    try {
      const response = await api.post(`/api/books/books/${book.id}/like/`);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.like_count);
      if (onLikeUpdate) onLikeUpdate(response.data.like_count, response.data.liked);
    } catch (error) {
      console.error('Error liking book:', error);
      alert('Failed to update like status');
    }
  };

  return (
    <div className="book-overlay">
      <div className="overlay-content">
        <div className="banner-section">
          <div className="banner-image-container">
            <img 
              src={book.banner_picture || book.cover_picture || '/default-cover.jpg'} 
              alt={`${book.title} banner`} 
              className="banner-image"
            />
            <div className="banner-fade"></div>
          </div>
          <h2 className="overlay-title">{book.title}</h2>
          <Link to={`/book/${book.id}`} className="start-reading-button">
            Start Reading
          </Link>
        </div>
        <div className="book-details">
          <div className="left-column">
            <p><strong>Uploaded by:</strong> {book.uploaded_by}</p>
            <p><strong>Upload date:</strong> {new Date(book.upload_date).toLocaleDateString()}</p>
            <p className="book-description">{book.description}</p>
          </div>
          <div className="right-column">
            <div className="collection-buttons">
              {isAuthenticated() && (
                <>
                  <select 
                    value={selectedCollection} 
                    onChange={(e) => setSelectedCollection(e.target.value)}
                  >
                    <option value="">Select Collection</option>
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>{collection.name}</option>
                    ))}
                    <option value="new">+ Create New Collection</option>
                  </select>
                  {selectedCollection === 'new' && (
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="New collection name"
                    />
                  )}
                  <button onClick={handleAddToCollection}>Add to Collection</button>
                </>
              )}
            </div>
            <div className="book-metrics">
              <p><strong>Pages:</strong> {pageCount}</p>
              <p><strong>Views:</strong> {book.view_count}</p>
              <p>
                <strong>Likes:</strong> {likeCount}
                <button onClick={handleLike} className="like-button">
                  {isLiked ? 'Unlike' : 'Like'}
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="genres-section">
          <h3>Genres</h3>
          <p>{book.genre_names ? book.genre_names.join(', ') : 'No genres specified'}</p>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default BookOverlay;
