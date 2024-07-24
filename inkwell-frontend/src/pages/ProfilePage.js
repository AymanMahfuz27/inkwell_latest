import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { getUsername } from '../services/authService';
import BookCard from '../components/BookCard';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
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
      setEditedProfile(response.data);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/users/profiles/${username}/`, editedProfile);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
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

  const isOwnProfile = username === getUsername();

  return (
    <div className="profile-page">
      <h1>{profile.username}'s Profile</h1>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={editedProfile.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={editedProfile.last_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={editedProfile.bio}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          {isOwnProfile && <button onClick={handleEdit}>Edit Profile</button>}
        </div>
      )}

      {isOwnProfile && (
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
      )}
    </div>
  );
};

export default ProfilePage;