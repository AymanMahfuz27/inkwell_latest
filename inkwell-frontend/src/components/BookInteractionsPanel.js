import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/BookInteractionsPanel.css';

const BookInteractionPanel = ({ bookId }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookInteractions();
    fetchUserCollections();
  }, [bookId]);

  const fetchBookInteractions = async () => {
    try {
      const response = await api.get(`/api/books/books/${bookId}/interactions/`);
      setLikes(response.data.like_count || 0);
      setIsLiked(response.data.is_liked || false);
      setViews(response.data.view_count || 0);
      setComments(response.data.recent_comments || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book interactions:', error);
      setError('Failed to load book interactions');
      setLoading(false);
    }
  };

  const fetchUserCollections = async () => {
    try {
      const response = await api.get('/api/users/collections/');
      setCollections(response.data || []);
    } catch (error) {
      console.error('Error fetching user collections:', error);
      setError('Failed to load user collections');
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/books/books/${bookId}/like/`);
      setLikes(response.data.like_count);
      setIsLiked(response.data.liked);
    } catch (error) {
      console.error('Error liking book:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await api.post(`/api/books/books/${bookId}/comments/`, { content: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection) return;
    try {
      await api.post(`/api/users/collections/${selectedCollection}/add-book/`, { bookId });
      alert('Book added to collection successfully');
    } catch (error) {
      console.error('Error adding book to collection:', error);
    }
  };

  if (loading) return <div>Loading interactions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-interaction-panel">
      <div className="interaction-section">
      <button onClick={handleLike}>{isLiked ? 'Unlike' : 'Like'} ({likes})</button>
      <span>Views: {views}</span>
      </div>
      <div className="interaction-section">
        <select 
          value={selectedCollection} 
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">Select Collection</option>
          {collections && collections.map(collection => (
            <option key={collection.id} value={collection.id}>{collection.name}</option>
          ))}
        </select>
        <button onClick={handleAddToCollection}>Add to Collection</button>
      </div>
      <div className="interaction-section">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
      <div className="comments-section">
        {comments && comments.map(comment => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
            <small>{comment.user} - {new Date(comment.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookInteractionPanel;