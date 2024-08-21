import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import WatercolorBackgroundError from '../components/WatercolorBackgroundError';
import LoadingScreen from '../components/LoadingScreen';
import '../css/AllGenresPage.css';
import { Tag } from 'lucide-react';

const AllGenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/api/books/genres/');
        setGenres(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres. Please try again later.');
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="all-genres-page">
      <WatercolorBackgroundError />
      <div className="all-genres-content">
        <h1 className="all-genres-title">Explore All Genres</h1>
        <div className="genres-grid">
          {genres.map(genre => (

            
            <Link to={`/genres/${encodeURIComponent(genre.name)}`} key={genre.id} className="genre-card">
              <Tag size={24} className="genre-list-card-icon" />
              <h2>{genre.name}</h2>
              <p>{genre.book_count} books</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllGenresPage;

