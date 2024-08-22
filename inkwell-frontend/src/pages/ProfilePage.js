import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FileText,
  ChevronLeft
} from "lucide-react";
import api from "../services/api";
import {
  isAuthenticated,
  getUsername,
  getUserFirstName,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../services/authService";

import "../css/ProfilePage.css";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { BookListCard } from "../components/ListCards";
import FollowersList from "../components/FollowersList";
import FollowingList from "../components/FollowingList";
import LoadingScreen from '../components/LoadingScreen';


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
  const [likedBooks, setLikedBooks] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [drafts, setDrafts] = useState([]);
  const navigate = useNavigate();
  const defaultCover = 'default_images/book_default.webp';
  const defaultAvatar = 'default_images/profile_pic_default.jpg';
  const [expandedCollections, setExpandedCollections] = useState({});




  useEffect(() => {
    setActiveTab("books");
    const loadProfileData = async () => {
      console.log("Loading profile data for username:", username);
      if (!profile || profile.username !== username) {
        await fetchProfile();
      }
      const isOwnProfile = username === getUsername();
      console.log("Is own profile:", isOwnProfile);
      setIsOwnProfile(isOwnProfile);
      setFirstName(getUserFirstName());

      if (isOwnProfile) {
        await fetchCollections();
        await fetchLikedBooks();
      }

      await fetchBooks();
    };
    loadProfileData();
  }, [username, profile]);

  useEffect(() => {
    if (activeTab === "followers") {
      fetchFollowers();
    } else if (activeTab === "following") {
      fetchFollowing();
    }
  }, [activeTab, username]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      console.log("Profile updated:", profile);
      setEditedProfile(profile);
    }
  }, [profile]);
  useEffect(() => {
    if (isOwnProfile && activeTab === "drafts") {
      fetchDrafts();
    }
  }, [isOwnProfile, activeTab]);

  const fetchLikedBooks = async () => {
    if (!isOwnProfile) return;
    try {
      const response = await api.get(
        `/api/users/profiles/${username}/liked_books/`
      );
      setLikedBooks(response.data);
    } catch (err) {
      setError("Failed to fetch liked books. Please try again later.");
    }
  };
  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/users/profiles/${username}/`);
      const profileData = response.data;
      if (
        profileData.profile_picture &&
        !profileData.profile_picture.startsWith("http")
      ) {
        profileData.profile_picture = `${process.env.REACT_APP_API_URL}${profileData.profile_picture}`;
      }
      setProfile(profileData);
      setEditedProfile(profileData);
      setIsFollowing(profileData.is_following);
      setFollowersCount(profileData.followers_count);
      setFollowingCount(profileData.following_count);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile. Please try again later.");
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await api.get("/api/books/drafts/user_drafts/");
      setDrafts(response.data);
    } catch (err) {
      setError("Failed to fetch drafts. Please try again later.");
    }
  };

  const handleEditDraft = (draftId) => {
    navigate(`/upload?draftId=${draftId}`);
  };

  const handleDeleteDraft = async (draftId) => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      try {
        await api.delete(`/api/books/drafts/${draftId}/`);
        setDrafts(drafts.filter((draft) => draft.id !== draftId));
      } catch (err) {
        console.error("Error deleting draft:", err);
        setError("Failed to delete draft. Please try again.");
      }
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profile.username);
        setIsFollowing(false);
        setFollowersCount((prevCount) => prevCount - 1);
      } else {
        await followUser(profile.username);
        setIsFollowing(true);
        setFollowersCount((prevCount) => prevCount + 1);
      }
      await fetchProfile();
    } catch (err) {
      setError("Failed to update follow status. Please try again.");
    }
  };

  const fetchFollowers = async () => {
    try {
      const data = await getFollowers(profile.username);
      setFollowers(data);
    } catch (err) {
      setError("Failed to fetch followers. Please try again.");
    }
  };

  const fetchFollowing = async () => {
    try {
      const data = await getFollowing(profile.username);
      setFollowing(data);
    } catch (err) {
      setError("Failed to fetch following. Please try again.");
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
    const { name, value } = e.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value || "",
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewProfilePicture(file);
      console.log("New profile picture set:", file);
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile((prev) => ({
          ...prev,
          profile_picture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in editedProfile) {
        if (editedProfile[key] !== null && editedProfile[key] !== undefined && key !== 'profile_picture') {
          formData.append(key, editedProfile[key]);
        }
      }
      if (newProfilePicture) {
        formData.append("profile_picture", newProfilePicture, newProfilePicture.name);
      } else if (profile.profile_picture && typeof profile.profile_picture === 'string') {
        // If no new picture is selected, don't send the existing one
        // The backend should keep the existing picture if none is provided
      }
  
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
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
      console.log("Profile update response:", response.data);
      setProfile(response.data);
      setIsEditing(false);
      setNewProfilePicture(null);
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err.message
      );
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
  const toggleCollection = (collectionId) => {
    setExpandedCollections(prev => ({
      ...prev,
      [collectionId]: !prev[collectionId]
    }));
  };
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <LoadingScreen />;

  return (
    <div className="inkwell-profile-page-container">
      <div className="inkwell-profile-page-content">
      <div className="inkwell-profile-page-header">
  <img
    src={profile.profile_picture || defaultAvatar}
    alt={`${profile.username}'s profile`}
    className="inkwell-profile-page-picture"
  />
  <div className="inkwell-profile-page-info">
    <h1 className="inkwell-profile-page-name">
      {profile.first_name} {profile.last_name}
    </h1>
    <p className="inkwell-profile-page-username">@{profile.username}</p>
    <p className="inkwell-profile-page-bio">{profile.bio}</p>
    <div className="inkwell-profile-page-stats">
      <span>Followers: {followersCount}</span>
      <span>Following: {followingCount}</span>
    </div>
  </div>
  <div className="inkwell-profile-page-stats-and-actions">
    {!isOwnProfile ? (
      <button
        onClick={handleFollow}
        className="inkwell-profile-page-follow-button"
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    ) : !isEditing ? (
      <button
        onClick={handleEdit}
        className="inkwell-profile-page-edit-button"
      >
        <Edit2 size={20} /> Edit Profile
      </button>
    ) : null}
  </div>
</div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="inkwell-profile-page-form">
            <div className="inkwell-profile-page-input-group">
              <label className="inkwell-profile-page-label">
                <Image size={20} />
                Profile Picture
              </label>
              <input
                key={isEditing ? "editing" : "not-editing"}

                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="inkwell-profile-page-input"
              />
              {profile.profile_picture && (
                <img
                  src={profile.profile_picture}
                  alt="Current profile picture"
                  className="inkwell-profile-page-current-picture"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            {["first_name", "last_name", "email", "bio"].map(
              (field) =>
                editedProfile[field] !== undefined && (
                  <div key={field} className="inkwell-profile-page-input-group">
                    <label className="inkwell-profile-page-label">
                      {field === "bio" ? (
                        <BookOpen size={20} />
                      ) : (
                        <User size={20} />
                      )}
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace("_", " ")}
                    </label>
                    {field === "bio" ? (
                      <textarea
                        name={field}
                        value={editedProfile[field] || ""}
                        onChange={handleChange}
                        className="inkwell-profile-page-textarea"
                      />
                    ) : (
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={editedProfile[field] || ""}
                        onChange={handleChange}
                        className="inkwell-profile-page-input"
                      />
                    )}
                  </div>
                )
            )}
            <div className="inkwell-profile-page-button-group">
              <button type="submit" className="inkwell-profile-page-button">
                <Save size={20} /> Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inkwell-profile-page-button secondary"
              >
                <X size={20} /> Cancel
              </button>
            </div>
          </form>
        )}

<div className="inkwell-profile-page-tabs">
  <button
    className={`tab ${activeTab === "books" ? "active" : ""}`}
    onClick={() => setActiveTab("books")}
  >
    Books
  </button>
  {isOwnProfile && (
    <>
      <button
        className={`tab ${activeTab === "drafts" ? "active" : ""}`}
        onClick={() => setActiveTab("drafts")}
      >
        Drafts
      </button>
      <button
        className={`tab ${activeTab === "liked" ? "active" : ""}`}
        onClick={() => setActiveTab("liked")}
      >
        Liked
      </button>
      <button
        className={`tab ${activeTab === "collections" ? "active" : ""}`}
        onClick={() => setActiveTab("collections")}
      >
        Collections
      </button>
      <button
        className={`tab ${activeTab === "followers" ? "active" : ""}`}
        onClick={() => setActiveTab("followers")}
      >
        Followers
      </button>
      <button
        className={`tab ${activeTab === "following" ? "active" : ""}`}
        onClick={() => setActiveTab("following")}
      >
        Following
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
        {isOwnProfile && activeTab === "liked" && (
          <div className="inkwell-profile-page-liked-books">
            <h2 className="inkwell-profile-page-subtitle">Liked Books</h2>
            {likedBooks.length > 0 ? (
              likedBooks.map((book) => (
                <BookListCard key={book.id} book={book} />
              ))
            ) : (
              <p>You haven't liked any books yet.</p>
            )}
          </div>
        )}
      {isOwnProfile && activeTab === "drafts" && (
          <div className="inkwell-profile-page-drafts">
            <h2 className="inkwell-profile-page-subtitle">Book Drafts</h2>
            {drafts.length > 0 ? (
              drafts.map((draft) => (
                <BookListCard
                  key={draft.id}
                  book={draft}
                  onDelete={() => handleDeleteDraft(draft.id)}
                  showDeleteButton={true}
                  customAction={() => handleEditDraft(draft.id)}
                  customActionText="Edit Draft"
                  customActionIcon={<FileText size={20} />}
                />
              ))
            ) : (
              <p>No drafts available.</p>
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
        <div 
          className="inkwell-profile-page-collection-header"
          onClick={() => toggleCollection(collection.id)}
        >
          <h3 className="inkwell-profile-page-collection-title">
            {collection.name}
          </h3>
          <span className="inkwell-profile-page-collection-toggle">
          {expandedCollections[collection.id] ? 
      <ChevronDown size={20} /> : 
      <ChevronLeft size={20} />
    }
          </span>
        </div>
        {expandedCollections[collection.id] && (
          collection.books.length === 0 ? (
            <p>This collection is empty.</p>
          ) : (
            <div className="inkwell-profile-page-book-scroll">
              {collection.books.map((book) => (
                <BookListCard key={book.id} book={book} />
              ))}
            </div>
          )
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
        {isOwnProfile && activeTab === "followers" && (
          <FollowersList followers={followers} />
        )}

        {isOwnProfile && activeTab === "following" && (
          <FollowingList following={following} />
        )}

        {error && <p className="inkwell-profile-page-error">{error}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
