// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import GenreCard from '../components/GenreCard';
import { isAuthenticated, getUsername } from '../services/authService';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import '../css/HomePage.css';
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

const GenreRow = ({ genres }) => (
  <div className="genre-row">
    {genres.map(genre => (
      <GenreCard key={genre.id} genre={genre} />
    ))}
  </div>
);


const HomePage = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [genreBooks, setGenreBooks] = useState({});
  const [popularBooks, setPopularBooks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inkwellLogo = 'inkwell-logo.svg';



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allBooksResponse, genresResponse, popularBooksResponse, newReleasesResponse] = await Promise.all([
          api.get('/api/books/books/'),
          api.get('/api/books/genres/'),
          api.get('/api/books/books/?sort=popular'),
          api.get('/api/books/books/?sort=new')
        ]);

        const allBooksData = allBooksResponse.data.results || allBooksResponse.data;
        setAllBooks(allBooksData);
        setGenres(genresResponse.data);
        setPopularBooks(popularBooksResponse.data.results || popularBooksResponse.data);
        setNewReleases(newReleasesResponse.data.results || newReleasesResponse.data);

        if (isAuthenticated()) {
          const userCollectionsResponse = await api.get(`/api/users/collections/`);
          const userCollections = userCollectionsResponse.data;
          
          if (userCollections.length > 0) {
            const randomCollection = userCollections[Math.floor(Math.random() * userCollections.length)];
            setUserBooks(randomCollection.books);
          }
        }

        // Fetch books for 3 random genres
        const randomGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 3);
        const genreBooksData = {};
        for (const genre of randomGenres) {
          const genreBooksResponse = await api.get(`/api/books/genres/${genre.name}/books/`);
          genreBooksData[genre.name] = genreBooksResponse.data;
        }
        setGenreBooks(genreBooksData);

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
      
      <GenreRow genres={genres.slice(0, 5)} />

      <BookRow 
        title="Popular Now" 
        books={popularBooks}
        onScrollLeft={() => handleScroll('left', 'scroll-popular-books')}
        onScrollRight={() => handleScroll('right', 'scroll-popular-books')}
      />

      {isAuthenticated() && userBooks.length > 0 && (
        <BookRow 
          title="From Your Collection" 
          books={userBooks}
          onScrollLeft={() => handleScroll('left', 'scroll-from-your-collection')}
          onScrollRight={() => handleScroll('right', 'scroll-from-your-collection')}
        />
      )}


      <BookRow 
        title="New Releases" 
        books={newReleases}
        onScrollLeft={() => handleScroll('left', 'scroll-new-releases')}
        onScrollRight={() => handleScroll('right', 'scroll-new-releases')}
      />

      {Object.entries(genreBooks).map(([genre, books]) => (
        <BookRow 
          key={genre}
          title={`${genre} Books`} 
          books={books}
          onScrollLeft={() => handleScroll('left', `scroll-${genre.toLowerCase()}-books`)}
          onScrollRight={() => handleScroll('right', `scroll-${genre.toLowerCase()}-books`)}
        />
      ))}

      <div className="about-inkwell-section">
        <h2>About Inkwell</h2>
        <p>Discover a new way to explore and enjoy books with Inkwell. Our platform offers a unique reading experience, connecting authors and readers like never before.</p>
        <Link to="/about" className="learn-more-button">
          <Info size={20} />
          Learn More About Inkwell
        </Link>
      </div>

      <div className="see-all-links">
        <Link to="/all-books">Explore All Books</Link>
        {isAuthenticated() && <Link to={`/profile/${getUsername()}`}>View Your Collections</Link>}
        <Link to="/genres">Browse All Genres</Link>
      </div>
    </div>
  );
};

export default HomePage;
