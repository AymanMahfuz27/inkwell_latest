import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  BookOpen,
  Image,
  ChevronDown,
  Trash2,
} from "lucide-react";
import api from "../services/api";
import { getUsername, getUserFirstName } from "../services/authService";
import WatercolorBackground from "../components/WatercolorBackground";
import "../css/ProfilePage.css";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { BookListCard } from "../components/ListCards";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [collections, setCollections] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("books");
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [first_name, setFirstName] = useState(getUserFirstName());

  useEffect(() => {
    fetchProfile();
    fetchCollections();
    fetchBooks();
    setIsOwnProfile(username === getUsername());
    setFirstName(getUserFirstName());
  }, [username, first_name]);

  const CollapsibleSection = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="inkwell-profile-page-subtitle">{title}</h2>
          <ChevronDown
            className={`toggle-icon ${isExpanded ? "expanded" : ""}`}
          />
        </div>
        <div className={`collapsible-content ${isExpanded ? "expanded" : ""}`}>
          {children}
        </div>
      </div>
    );
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/users/profiles/${username}/`);
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (err) {
      setError("Failed to fetch profile. Please try again later.");
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await api.get("/api/users/collections/");
      setCollections(response.data);
    } catch (err) {
      setError("Failed to fetch collections. Please try again later.");
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get(`/api/users/profiles/${username}/books/`);
      setBooks(response.data);
    } catch (err) {
      setError("Failed to fetch books. Please try again later.");
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/api/users/profiles/${username}/delete_book/`, {
          data: { book_id: bookId },
          headers: {
            "Content-Type": "application/json",
          },
        });
        setBooks(books.filter((book) => book.id !== bookId));
      } catch (err) {
        console.error("Error deleting book:", err);
        setError("Failed to delete book. Please try again.");
      }
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

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewProfilePicture(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in editedProfile) {
        formData.append(key, editedProfile[key]);
      }
      if (newProfilePicture) {
        formData.append("profile_picture", newProfilePicture);
      }

      const response = await api.put(
        `/api/users/profiles/${username}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile(response.data);
      setIsEditing(false);
      setNewProfilePicture(null);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/collections/", { name: newCollectionName });
      setNewCollectionName("");
      fetchCollections();
    } catch (err) {
      setError("Failed to create collection. Please try again.");
    }
  };

  if (error) return <div className="inkwell-profile-page-error">{error}</div>;
  if (!profile)
    return <div className="inkwell-profile-page-loading">Loading...</div>;

  return (
    <div className="inkwell-profile-page-container">
      <WatercolorBackground />
      <div className="inkwell-profile-page-content">
        <h1 className="inkwell-profile-page-title">
          Welcome back, {profile.first_name}
        </h1>

        <div className="inkwell-profile-page-picture-container">
          <img
            src={profile.profile_picture || "/default-avatar.jpg"}
            alt={`${profile.username}'s profile`}
            className="inkwell-profile-page-picture"
          />
          {isOwnProfile && isEditing && (
            <div className="inkwell-profile-page-picture-upload">
              <label
                htmlFor="profile-picture-upload"
                className="inkwell-profile-page-picture-label"
              >
                <Image size={20} />
                Change Picture
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                onChange={handleProfilePictureChange}
                accept="image/*"
                className="inkwell-profile-page-picture-input"
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="inkwell-profile-page-form">
            <div className="inkwell-profile-page-input-group">
              <label className="inkwell-profile-page-label">
                <User size={20} />
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={editedProfile.first_name}
                onChange={handleChange}
                className="inkwell-profile-page-input"
              />
            </div>
            <div className="inkwell-profile-page-input-group">
              <label className="inkwell-profile-page-label">
                <User size={20} />
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={editedProfile.last_name}
                onChange={handleChange}
                className="inkwell-profile-page-input"
              />
            </div>
            <div className="inkwell-profile-page-input-group">
              <label className="inkwell-profile-page-label">
                <Mail size={20} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleChange}
                className="inkwell-profile-page-input"
              />
            </div>
            <div className="inkwell-profile-page-input-group">
              <label className="inkwell-profile-page-label">
                <BookOpen size={20} />
                Bio
              </label>
              <textarea
                name="bio"
                value={editedProfile.bio}
                onChange={handleChange}
                className="inkwell-profile-page-textarea"
              />
            </div>
            <div className="inkwell-profile-page-button-group">
              <button type="submit" className="inkwell-profile-page-button">
                <Save size={20} />
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inkwell-profile-page-button secondary"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="inkwell-profile-page-info">
            <p>
              <strong>Name:</strong> {profile.first_name} {profile.last_name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio}
            </p>
            {isOwnProfile && (
              <button
                onClick={handleEdit}
                className="inkwell-profile-page-button"
              >
                <Edit2 size={20} />
                Edit Profile
              </button>
            )}
          </div>
        )}
        <div className="inkwell-profile-page-tabs">
          <button
            className={`tab ${activeTab === "books" ? "active" : ""}`}
            onClick={() => setActiveTab("books")}
          >
            All Books
          </button>
          {isOwnProfile && (
            <>
              <button
                className={`tab ${activeTab === "collections" ? "active" : ""}`}
                onClick={() => setActiveTab("collections")}
              >
                Book Collections
              </button>
              <button
                className={`tab ${activeTab === "analytics" ? "active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </>
          )}
        </div>

        {activeTab === "books" && (
          <div className="inkwell-profile-page-books">
            <h2 className="inkwell-profile-page-subtitle">All Books</h2>
            {books.length > 0 ? (
              books.map((book) => (
                <BookListCard
                  key={book.id}
                  book={book}
                  onDelete={handleDeleteBook}
                  showDeleteButton={isOwnProfile}
                />
              ))
            ) : (
              <p>No books uploaded yet.</p>
            )}
          </div>
        )}

        {isOwnProfile && activeTab === "collections" && (
          <div className="inkwell-profile-page-collections">
            <h2 className="inkwell-profile-page-subtitle">Book Collections</h2>
            <form
              onSubmit={createCollection}
              className="inkwell-profile-page-form"
            >
              <div className="inkwell-profile-page-input-group">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="New collection name"
                  required
                  className="inkwell-profile-page-input"
                />
                <button type="submit" className="inkwell-profile-page-button">
                  Create Collection
                </button>
              </div>
            </form>

            {collections.map((collection) => (
              <div
                key={collection.id}
                className="inkwell-profile-page-collection"
              >
                <h3 className="inkwell-profile-page-collection-title">
                  {collection.name}
                </h3>
                {collection.books.length === 0 ? (
                  <p>This collection is empty.</p>
                ) : (
                  <div className="inkwell-profile-page-book-scroll">
                    {collection.books.map((book) => (
                      <BookListCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isOwnProfile && activeTab === "analytics" && (
          <div className="inkwell-profile-page-analytics">
            <h2 className="inkwell-profile-page-subtitle">
              Analytics Dashboard
            </h2>
            <AnalyticsDashboard />
          </div>
        )}

        {error && <p className="inkwell-profile-page-error">{error}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
