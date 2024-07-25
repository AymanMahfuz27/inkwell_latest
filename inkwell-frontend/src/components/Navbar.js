// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUserFirstName, getUsername, logout } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { Search, User, LogOut } from 'lucide-react';
import '../css/Navbar.css';

const Navbar = () => {
  const { auth, username, firstName } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="logo">Inkwell</Link>
        <div className="nav-links">
          <Link to="/books">Books</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="nav-actions">
          <button className="icon-button"><Search size={20} /></button>
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
