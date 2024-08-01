import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Heart, Eye, BookOpen, Plus, UserMinus, UserPlus } from "lucide-react";
import api from "../services/api";
import {
  isAuthenticated,
  followUser,
  unfollowUser,
  getUsername,
} from "../services/authService";
import "../css/BookOverlay.css";

const BookOverlay = ({ book, onClose, onLikeUpdate }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLiked, setIsLiked] = useState(book.is_liked);
  const [likeCount, setLikeCount] = useState(book.like_count);
  const [isVisible, setIsVisible] = useState(false);
  const [authorUsername, setAuthorUsername] = useState("");
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [isOwnBook, setIsOwnBook] = useState(false);
  const [authorFullName, setAuthorFullName] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    setIsVisible(true);
    if (isAuthenticated()) {
      fetchCollections();
      fetchAuthorInfo();
    }
  }, [book.id]);
  
  useEffect(() => {
    if (isAuthenticated() && authorUsername) {
      checkIfFollowingAuthor();
    }
    setIsOwnBook(getUsername() === authorUsername);
  }, [authorUsername]);

  const checkIfFollowingAuthor = async () => {
    if (!authorUsername) return; // Don't make the API call if we don't have the username
    try {
      const response = await api.get(`/api/users/profiles/${authorUsername}/`);
      setIsFollowingAuthor(response.data.is_following);
    } catch (error) {
      console.error("Error checking if following author:", error);
    }
  };

  const fetchAuthorInfo = async () => {
    try {
      const response = await api.get(`/api/books/books/${book.id}/`);
      // alert("Author info response:", response.data);
      setAuthorUsername(response.data.uploaded_by_username);
      setAuthorFullName(response.data.uploaded_by);
      setIsFollowingAuthor(response.data.is_following_author);
      // alert("Author username set to:", response.data.uploaded_by_username);
    } catch (error) {
      console.error("Error fetching author info:", error);
    }
  };

  const handleFollowAuthor = async () => {
    // alert("Follow author clicked. Author username:", authorUsername);
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!authorUsername) {
      // alert("Author username is not available");
      return;
    }
    try {
      if (isFollowingAuthor) {
        await unfollowUser(authorUsername);
        setIsFollowingAuthor(false);
      } else {
        await followUser(authorUsername);
        setIsFollowingAuthor(true);
      }
    } catch (error) {
      // alert("Error following/unfollowing author:", error);
    }
  };
  
    

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };
  const fetchCollections = async () => {
    try {
      const response = await api.get("/api/users/collections/");
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const handleAddToCollection = async () => {
    if (!isAuthenticated()) {
      // alert("Please log in to add books to collections.");
      return;
    }
    if (selectedCollection === "new") {
      await createNewCollection();
    } else {
      try {
        await api.post(
          `/api/users/collections/${selectedCollection}/add_book/`,
          { book_id: book.id }
        );
        // alert("Book added to collection successfully");
      } catch (error) {
        console.error("Error adding book to collection:", error);
        // alert("Failed to add book to collection");
      }
    }
  };

  const createNewCollection = async () => {
    if (!newCollectionName.trim()) {
      // alert("Please enter a name for the new collection");
      return;
    }
    try {
      const response = await api.post("/api/users/collections/", {
        name: newCollectionName,
      });
      const newCollection = response.data;
      setCollections([...collections, newCollection]);
      setSelectedCollection(newCollection.id);
      setNewCollectionName("");
      await api.post(`/api/users/collections/${newCollection.id}/add_book/`, {
        book_id: book.id,
      });
      // alert("New collection created and book added successfully");
    } catch (error) {
      console.error("Error creating new collection:", error);
      // alert("Failed to create new collection");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
      // alert("Please log in to like books.");
      return;
    }
    try {
      const response = await api.post(`/api/books/books/${book.id}/like/`);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.like_count);
      if (onLikeUpdate)
        onLikeUpdate(response.data.like_count, response.data.liked);
    } catch (error) {
      console.error("Error liking book:", error);
      // alert("Failed to update like status");
    }
  };

  return (
    <div className={`inkwell-book-overlay ${isVisible ? "visible" : ""}`}>
      <div className="inkwell-book-overlay-background">
        <div className="inkwell-book-overlay-blob blob1"></div>
        <div className="inkwell-book-overlay-blob blob2"></div>
        <div className="inkwell-book-overlay-blob blob3"></div>
      </div>

      <div className="inkwell-book-overlay-content">
        <button
          className="inkwell-book-overlay-close-button"
          onClick={handleClose}
        >
          <X size={24} />
        </button>
        <div className="inkwell-book-overlay-banner">
          <img
            src={
              book.banner_picture || book.cover_picture || "/default-banner.jpg"
            }
            alt={`${book.title} banner`}
            className="inkwell-book-overlay-banner-image"
          />
          <div className="inkwell-book-overlay-banner-fade"></div>
        </div>
        <div className="inkwell-book-overlay-header">
          <img
            src={book.cover_picture || "/default-cover.jpg"}
            alt={`${book.title} cover`}
            className="inkwell-book-overlay-cover"
          />
          <div className="inkwell-book-overlay-info">
            <h2 className="inkwell-book-overlay-title">{book.title}</h2>
            <p className="inkwell-book-overlay-author">by {book.uploaded_by}</p>

            <div className="inkwell-book-overlay-stats">
              <span className="inkwell-book-overlay-stat">
                <Eye size={16} /> {book.view_count}
              </span>
              <span className="inkwell-book-overlay-stat">
                <Heart size={16} fill={isLiked ? "#ff6b6b" : "none"} />{" "}
                {likeCount}
              </span>
              <button
                className="inkwell-book-overlay-like-button"
                onClick={handleLike}
              >
                {isLiked ? "Unlike" : "Like"}
              </button>
            </div>
            {!isOwnBook ? (
  <button
    className="inkwell-book-overlay-follow-button"
    onClick={handleFollowAuthor}
  >
    {isFollowingAuthor ? <UserMinus size={16} /> : <UserPlus size={16} />}
    {isFollowingAuthor ? "Unfollow Author" : "Follow Author"}
  </button>
) : (
  <Link to={`/profile/${getUsername()}`} className="inkwell-book-overlay-edit-button">
    View Analytics
  </Link>
)}
          </div>
        </div>
        <div className="inkwell-book-overlay-details">
          <p className="inkwell-book-overlay-description">{book.description}</p>
          <div className="inkwell-book-overlay-genres">
            {book.genre_names &&
              book.genre_names.map((genre, index) => (
                <span key={index} className="inkwell-book-overlay-genre-tag">
                  {genre}
                </span>
              ))}
          </div>
        </div>
        <div className="inkwell-book-overlay-actions">
          <Link
            to={`/book/${book.id}`}
            className="inkwell-book-overlay-read-button"
          >
            <BookOpen size={20} /> Start Reading
          </Link>
          {isAuthenticated() && (
            <div className="inkwell-book-overlay-collection-action">
              <select
                className="inkwell-book-overlay-select"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <option value="">Add to Collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
                <option value="new">+ Create New Collection</option>
              </select>
              {selectedCollection === "new" && (
                <input
                  type="text"
                  className="inkwell-book-overlay-input"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="New collection name"
                />
              )}
              <button
                onClick={handleAddToCollection}
                className="inkwell-book-overlay-add-button"
              >
                <Plus size={20} /> Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookOverlay;
