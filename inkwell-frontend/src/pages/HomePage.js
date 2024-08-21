// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import { isAuthenticated, getUsername } from '../services/authService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../css/HomePage.css';
import WatercolorBackground from '../components/WatercolorBackground';
import LoadingScreen from '../components/LoadingScreen';

const BookRow = ({ title, books, onScrollLeft, onScrollRight }) => (
  <div className="book-row">
    <div className="book-row-header">
      <h2>{title}</h2>
      <div className="scroll-buttons">
        <button onClick={onScrollLeft} className="scroll-button">
          <ChevronLeft size={24} />
        </button>
        <button onClick={onScrollRight} className="scroll-button">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
    <div className="book-scroll" id={`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [genreBooks, setGenreBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inkwellLogo = 'inkwell-logo.svg';


  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBooksResponse = await api.get('/api/books/books/');
        const allBooksData = allBooksResponse.data.results || allBooksResponse.data;
        setAllBooks(allBooksData);

        if (isAuthenticated()) {
          const username = getUsername();
          const userCollectionsResponse = await api.get(`/api/users/collections/`);
          const userCollections = userCollectionsResponse.data;
          
          if (userCollections.length > 0) {
            const randomCollection = userCollections[Math.floor(Math.random() * userCollections.length)];
            setUserBooks(randomCollection.books);
          }
        }

        const genres = [...new Set(allBooksData.flatMap(book => book.genre_names))];
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        setSelectedGenre(randomGenre);
        
        const genreBooks = allBooksData.filter(book => book.genre_names.includes(randomGenre));
        setGenreBooks(genreBooks);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = (direction, rowId) => {
    const scrollContainer = document.getElementById(rowId);
    const scrollAmount = 300; // Adjust this value to control scroll distance
    if (scrollContainer) {
      if (direction === 'left') {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (loading) return <LoadingScreen/>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      {/* <WatercolorBackground /> */}
      <div className="hero-section">
        <div className="hero-content">
          <img src={inkwellLogo} alt="Inkwell" className="hero-logo" />
          <div className="hero-text">
            <h1>Welcome to Inkwell</h1>
            <p>Discover, read, and share your favorite books</p>
          </div>
        </div>
      </div>
      
      <BookRow 
        title="Featured Books" 
        books={allBooks}
        onScrollLeft={() => handleScroll('left', 'scroll-featured-books')}
        onScrollRight={() => handleScroll('right', 'scroll-featured-books')}
      />
      
      {isAuthenticated() && userBooks.length > 0 && (
        <BookRow 
          title="From Your Collection" 
          books={userBooks}
          onScrollLeft={() => handleScroll('left', 'scroll-from-your-collection')}
          onScrollRight={() => handleScroll('right', 'scroll-from-your-collection')}
        />
      )}
      
      {genreBooks.length > 0 && (
        <BookRow 
          title={`${selectedGenre} Books`} 
          books={genreBooks}
          onScrollLeft={() => handleScroll('left', `scroll-${selectedGenre.toLowerCase()}-books`)}
          onScrollRight={() => handleScroll('right', `scroll-${selectedGenre.toLowerCase()}-books`)}
        />
      )}

      <div className="see-all-links">
        <Link to="/all-books">Explore All Books</Link>
        {isAuthenticated() && <Link to={`/profile/${getUsername()}`}>View Your Collections</Link>}
        <Link to="/genres">Browse Genres</Link>
      </div>
    </div>
  );
};

export default HomePage;