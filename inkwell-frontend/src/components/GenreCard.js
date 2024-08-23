// src/components/GenreCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const GenreCard = ({ genre }) => (
  <Link to={`/genres/${genre.name}`} className="genre-card">
    <Tag size={24} />
    <h3>{genre.name}</h3>
    <p>{genre.book_count} books</p>
  </Link>
);

export default GenreCard;