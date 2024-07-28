// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { BookListCard, UserListCard, GenreListCard } from '../components/ListCards';
import { User, Book, Tag } from 'lucide-react';
import '../css/SearchPage.css';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [genreResults, setGenreResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location]);

  const performSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const [booksResponse, usersResponse, genresResponse] = await Promise.all([
        api.get(`/api/books/books/search/?q=${query}`),
        api.get(`/api/users/profiles/search/?q=${query}`),
        api.get(`/api/books/genres/search/?q=${query}`)
      ]);

      setBookResults(Array.isArray(booksResponse.data) ? booksResponse.data : []);
      setUserResults(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      setGenreResults(Array.isArray(genresResponse.data) ? genresResponse.data : []);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="search-page">
      <h1>Search Inkwell</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for books, users, or genres"
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {isLoading && <div className="loading">Searching...</div>}
      {error && <div className="error">{error}</div>}

      {!isLoading && !error && (
        <>
          <div className="search-results-section">
            <h2><Book size={24} /> Books</h2>
            <div className="search-results-list">
              {bookResults.length > 0 ? (
                bookResults.map(book => <BookListCard key={book.id} book={book} />)
              ) : (
                <p>No books found</p>
              )}
            </div>
          </div>

          <div className="search-results-section">
            <h2><User size={24} /> Users</h2>
            <div className="search-results-list">
              {userResults.length > 0 ? (
                userResults.map(user => <UserListCard key={user.id} user={user} />)
              ) : (
                <p>No users found</p>
              )}
            </div>
          </div>

          <div className="search-results-section">
            <h2><Tag size={24} /> Genres</h2>
            <div className="search-results-list">
              {genreResults.length > 0 ? (
                genreResults.map(genre => <GenreListCard key={genre.id} genre={genre} />)
              ) : (
                <p>No genres found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;

