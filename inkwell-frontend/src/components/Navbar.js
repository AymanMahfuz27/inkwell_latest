// src/components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUserFirstName, getUsername, logout } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { Search, User, LogOut } from 'lucide-react';
import '../css/Navbar.css';

const Navbar = () => {
  const { auth, username, firstName } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const inkwellLogo = 'inkwell-logo.svg';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
      <Link to="/" className="logo">
  <img src={inkwellLogo} alt="Inkwell" className="navbar-logo" />
</Link>
        <div className="nav-center">
        <div className={`nav-links ${isSearchExpanded ? 'hidden' : ''}`}>
          <Link to="/all-books">Books</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/about">About</Link>
        </div>
        </div>
        <div className="nav-actions">
          <form onSubmit={handleSearch} className={`search-form ${isSearchExpanded ? 'expanded' : ''}`}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Inkwell"
              className={`search-input ${!isSearchExpanded ? 'collapsed' : ''}`}
            />
            <button type="button" className="icon-button" onClick={toggleSearch}>
              <Search size={20} />
            </button>
          </form>
          {auth ? (
            <>
              <Link to={`/profile/${username}`} className="profile-link">
                <User size={20} />
                <span>{firstName || 'User'}</span>
              </Link>
              <button onClick={handleLogout} className="icon-button">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="sign-in-button">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;