import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchCollections();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/users/profiles/${username}/`);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile. Please try again later.');
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await api.get('/api/users/collections/');
      setCollections(response.data);
    } catch (err) {
      setError('Failed to fetch collections. Please try again later.');
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users/collections/', { name: newCollectionName });
      setNewCollectionName('');
      fetchCollections();
    } catch (err) {
      setError('Failed to create collection. Please try again.');
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>{profile.username}'s Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Bio:</strong> {profile.bio}</p>
      </div>

      <div className="collections-section">
        <h2>Book Collections</h2>
        <form onSubmit={createCollection}>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New collection name"
            required
          />
          <button type="submit">Create Collection</button>
        </form>

        {collections.map(collection => (
          <div key={collection.id} className="collection">
            <h3>{collection.name}</h3>
            {collection.books.length === 0 ? (
              <p>This collection is empty.</p>
            ) : (
              <div className="book-scroll">
                {collection.books.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;