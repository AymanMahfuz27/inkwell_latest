import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import '../css/HomePage.css';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/api/books/books/');
        console.log('API Response:', response.data); // Log the response for debugging
        const booksData = Array.isArray(response.data) ? response.data : response.data.results;
        
        if (Array.isArray(booksData)) {
          setBooks(booksData);
        } else {
          throw new Error('Received data is not in the expected format');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books. Please try again later.');
        setLoading(false);
      }
    };


    fetchBooks();
  }, []);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-page">
      <h1>Welcome to Inkwell!</h1>
      <div className="book-grid">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;