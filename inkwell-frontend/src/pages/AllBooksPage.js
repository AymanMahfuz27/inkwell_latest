import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import '../css/HomePage.css';  // We'll continue to use the HomePage CSS for consistency
import WatercolorBackground from '../components/WatercolorBackground';

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    if (!hasMore) return;
    try {
      const response = await api.get('/api/books/books/', {
        params: { page: page, limit: 12 }  // Increased to 12 for better grid layout
      });
      const newBooks = response.data.results || response.data;
      
      if (Array.isArray(newBooks)) {
        setBooks(prevBooks => [...prevBooks, ...newBooks]);
        setPage(prevPage => prevPage + 1);
        setHasMore(newBooks.length === 12);
      } else {
        console.error('Unexpected response format:', newBooks);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && books.length === 0) {
    return <div className="loading">Loading books...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page all-books-page">
        <WatercolorBackground />
      <div className="hero-section">
        <h1>All Books</h1>
        <p>Explore our collection of amazing books</p>
      </div>
      
      <div className="books-grid">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button 
            className="load-more-button" 
            onClick={fetchBooks} 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Books'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AllBooksPage;