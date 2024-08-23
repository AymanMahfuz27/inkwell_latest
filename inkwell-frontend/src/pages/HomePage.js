// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import GenreCard from '../components/GenreCard';
import {UserListCard} from '../components/ListCards';
import { isAuthenticated, getUsername } from '../services/authService';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import '../css/HomePage.css';
import LoadingScreen from '../components/LoadingScreen';
import WatercolorBackgroundError from '../components/WatercolorBackgroundError';

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
  <div className="homepage-genre-section">
    <h2>Explore Genres</h2>
    <div className="homepage-genre-row">
      <div className="homepage-genre-scroll">
        {genres.slice(0, 10).map(genre => ( 
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </div>
    </div>
  </div>
);


const UserRow = ({ users }) => (
  <div className="user-row">
    {users.map(user => (
      <UserListCard key={user.id} user={user} />
    ))}
  </div>
);



const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [genreBooks, setGenreBooks] = useState({});
  const [popularBooks, setPopularBooks] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [mostLikedBooks, setMostLikedBooks] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inkwellLogo = 'inkwell-logo.svg';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          featuredBooksResponse,
          genresResponse,
          popularBooksResponse,
          recentlyAddedResponse,
          mostLikedBooksResponse,
          randomUsersResponse
        ] = await Promise.all([
          api.get('/api/books/books/?limit=10'),
          api.get('/api/books/genres/'),
          api.get('/api/books/books/?sort=-view_count&limit=10'),
          api.get('/api/books/books/?sort=-created_at&limit=10'),
          api.get('/api/books/books/?sort=-likes&limit=10'),
          api.get('/api/users/profiles/?sort=random&limit=3')
        ]);

        setFeaturedBooks(featuredBooksResponse.data.results || featuredBooksResponse.data);
        setGenres(genresResponse.data);
        setPopularBooks(popularBooksResponse.data.results || popularBooksResponse.data);
        setRecentlyAdded(recentlyAddedResponse.data.results || recentlyAddedResponse.data);
        setMostLikedBooks(mostLikedBooksResponse.data.results || mostLikedBooksResponse.data);
        setRandomUsers(randomUsersResponse.data.results || randomUsersResponse.data);

        if (isAuthenticated()) {
          const userCollectionsResponse = await api.get(`/api/users/collections/`);
          const userCollections = userCollectionsResponse.data;
          
          if (userCollections.length > 0) {
            const randomCollection = userCollections[Math.floor(Math.random() * userCollections.length)];
            setUserBooks(randomCollection.books);
          }
        }

        // Fetch books for 3 random genres
        const randomGenres = genresResponse.data.sort(() => 0.5 - Math.random()).slice(0, 3);
        const genreBooksData = {};
        for (const genre of randomGenres) {
          const genreBooksResponse = await api.get(`/api/books/genres/${genre.name}/books/?limit=10`);
          genreBooksData[genre.name] = genreBooksResponse.data.results || genreBooksResponse.data;
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
        books={featuredBooks}
        onScrollLeft={() => handleScroll('left', 'scroll-featured-books')}
        onScrollRight={() => handleScroll('right', 'scroll-featured-books')}
      />
      
      <GenreRow genres={genres} />

      <BookRow 
        title="Popular Now" 
        books={popularBooks}
        onScrollLeft={() => handleScroll('left', 'scroll-popular-books')}
        onScrollRight={() => handleScroll('right', 'scroll-popular-books')}
      />

       {/* Featured Users Section */}
       {randomUsers.length > 0 && (
        <div className="featured-users-section">
          <h2>Featured Inkwell Users</h2>
          <UserRow users={randomUsers} />
        </div>
      )}

      <BookRow 
        title="Recently Added" 
        books={recentlyAdded}
        onScrollLeft={() => handleScroll('left', 'scroll-recently-added')}
        onScrollRight={() => handleScroll('right', 'scroll-recently-added')}
      />

      {isAuthenticated() && userBooks.length > 0 && (
        <BookRow 
          title="From Your Collection" 
          books={userBooks}
          onScrollLeft={() => handleScroll('left', 'scroll-from-your-collection')}
          onScrollRight={() => handleScroll('right', 'scroll-from-your-collection')}
        />
      )}

<div className="about-inkwell-section">
        <h2>About Inkwell</h2>
        <p>Discover a new way to explore and enjoy books with Inkwell. Our platform offers a unique reading experience, connecting authors and readers like never before.</p>
        <Link to="/about" className="learn-more-button">
          <Info size={20} />
          Learn More About Inkwell
        </Link>
      </div>

      <BookRow 
        title="Most Liked Books" 
        books={mostLikedBooks}
        onScrollLeft={() => handleScroll('left', 'scroll-most-liked-books')}
        onScrollRight={() => handleScroll('right', 'scroll-most-liked-books')}
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

     

      

      <div className="see-all-links">
        <Link to="/all-books">Explore All Books</Link>
        {isAuthenticated() && <Link to={`/profile/${getUsername()}`}>View Your Collections</Link>}
        <Link to="/genres">Browse All Genres</Link>
      </div>
    </div>
  );
};

export default HomePage;