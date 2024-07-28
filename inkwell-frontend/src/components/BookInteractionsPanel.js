import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Layers, List, X, ThumbsUp, Eye } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import '../css/BookInteractionsPanel.css';

const BookInteractionsPanel = ({ 
  bookId, 
  currentPage, 
  totalPages, 
  onPageChange, 
  viewMode, 
  onViewModeChange,
  isOpen,
  onClose,
  onOpen
}) => {

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [goToPage, setGoToPage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchBookInteractions();
    if (isAuthenticated()) {
      fetchUserCollections();
    }
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
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/api/books/books/${bookId}/like/`);
      setLikes(response.data.like_count);
      setIsLiked(response.data.liked);
    } catch (error) {
      console.error('Error liking book:', error);
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
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
      await api.post(`/api/users/collections/${selectedCollection}/add_book/`, { book_id: bookId });
      alert('Book added to collection successfully');
    } catch (error) {
      console.error('Error adding book to collection:', error);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      const response = await api.post('/api/users/collections/', { name: newCollectionName });
      const newCollection = response.data;
      setCollections([...collections, newCollection]);
      setSelectedCollection(newCollection.id);
      setNewCollectionName('');
      setShowNewCollectionInput(false);
      await handleAddToCollection();
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setGoToPage('');
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  if (loading) return <div>Loading interactions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div 
        className={`book-interaction-panel-toggle ${isOpen ? '' : 'collapsed'}`} 
        onClick={onOpen}
      >
        <ChevronLeft />
      </div>
      <div className={`book-interaction-panel ${isOpen ? '' : 'collapsed'}`}>
        <button className="close-panel-button" onClick={onClose}>
          Collapse Panel
        </button>

        <div className="interaction-section">
          <button onClick={handleLike} className="like-button">
            <ThumbsUp size={20} />
            {isLiked ? 'Unlike' : 'Like'} ({likes})
          </button>
          <div className="views">
            <Eye size={20} />
            {views}
          </div>
        </div>
        <div className="page-navigation">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="go-to-page">
            <input
              type="number"
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              placeholder="Go to page"
              min="1"
              max={totalPages}
            />
            <button onClick={handleGoToPage}>Go</button>
          </div>
        </div>
        <div className="view-mode-toggle">
          <button onClick={() => onViewModeChange('horizontal')} className={viewMode === 'horizontal' ? 'active' : ''}>
            <Layers size={20} />
            Horizontal
          </button>
          <button onClick={() => onViewModeChange('vertical')} className={viewMode === 'vertical' ? 'active' : ''}>
            <List size={20} />
            Vertical
          </button>
        </div>
        <div className="collection-section">
          <select 
            value={selectedCollection} 
            onChange={(e) => {
              if (e.target.value === 'new') {
                setShowNewCollectionInput(true);
              } else {
                setSelectedCollection(e.target.value);
                setShowNewCollectionInput(false);
              }
            }}
          >
            <option value="">Select Collection</option>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>{collection.name}</option>
            ))}
            <option value="new">+ Create New Collection</option>
          </select>
          {showNewCollectionInput ? (
            <>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="New collection name"
              />
              <button onClick={handleCreateCollection}>Create & Add</button>
            </>
          ) : (
            <button onClick={handleAddToCollection}>Add to Collection</button>
          )}
        </div>

        <div className="comment-section">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <p>{comment.content}</p>
              <small>{comment.user} - {new Date(comment.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookInteractionsPanel;
