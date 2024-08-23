// Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  isAuthenticated,
  getUserFirstName,
  getUsername,
  logout,
} from "../services/authService";
import useAuth from "../hooks/useAuth";
import { Search, User, LogOut, Menu, X } from "lucide-react";
import "../css/Navbar.css";

const Navbar = () => {
  const { auth, username, firstName } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const inkwellLogo = "inkwell-logo.svg";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}>

      <div className="navbar-content">
        <Link to="/" className="logo" onClick={handleNavClick}>
          <img src={inkwellLogo} alt="Inkwell" className="navbar-logo" />
        </Link>
        <div className={`nav-center ${isMenuOpen ? "mobile-menu-visible" : ""}`}>
          <div className="nav-links">
            <Link to="/all-books" onClick={handleNavClick}>Books</Link>
            <Link to="/upload" onClick={handleNavClick}>Upload</Link>
            <Link to="/about" onClick={handleNavClick}>About</Link>
            {auth && (
              <>
                <Link to={`/profile/${username}`} onClick={handleNavClick} className="mobile-only">
                  Profile
                </Link>
                <button onClick={handleLogout} className="mobile-only mobile-logout-button">
                  Logout
                </button>
              </>
            )}
            {!auth && (
              <Link to="/login" onClick={handleNavClick} className="mobile-only">
                Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="nav-actions">
          <form onSubmit={handleSearch} className={`search-form-navbar ${isSearchExpanded ? "expanded" : ""}`}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Inkwell"
              className="search-input"
            />
          </form>
          <button type="button" className="icon-button search-toggle" onClick={toggleSearch}>
            <Search size={20} />
          </button>

          {auth ? (
            <>
              <Link to={`/profile/${username}`} className="profile-link desktop-only">
                <User size={20} />
                <span>{firstName || "User"}</span>
              </Link>
              <button onClick={handleLogout} className="icon-button desktop-only">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="sign-in-button desktop-only">
              Sign In
            </Link>
          )}
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;