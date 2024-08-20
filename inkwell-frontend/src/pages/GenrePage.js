import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import WatercolorBackground from '../components/WatercolorBackground';
import LoadingScreen from '../components/LoadingScreen';
import '../css/GenrePage.css';
import { Tag } from 'lucide-react';

const GenrePage = () => {
  const { genreName } = useParams();
  const decodedGenreName = decodeURIComponent(genreName);
  const [genre, setGenre] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenreAndBooks = async () => {
      try {
        console.log(`Fetching data for genre: ${decodedGenreName}`);
        const [genreResponse, booksResponse] = await Promise.all([
          api.get(`/api/books/genres/${decodedGenreName}/`),
          api.get(`/api/books/genres/${decodedGenreName}/books/`)
        ]);
        console.log('Genre response:', genreResponse.data);
        console.log('Books response:', booksResponse.data);
        setGenre(genreResponse.data);
        setBooks(booksResponse.data);
      } catch (err) {
        console.error('Error fetching genre data:', err);
        setError('Failed to load genre information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGenreAndBooks();
  }, [decodedGenreName]);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="genre-page">
      <WatercolorBackground />
      <div className="genre-page-content">


        <h1 className="genre-page-title">      {genre?.name}<Tag size={24} className="genre-list-card-icon-genre-page" /></h1>
        <p className="genre-page-description">
          {genre?.description || `Explore our collection of ${genre?.name} books.`}
        </p>
        <div className="genre-page-books">
  {books.map(book => (
    <BookCard key={book.id} book={book} />
  ))}
</div>      </div>
    </div>
  );
};

export default GenrePage;