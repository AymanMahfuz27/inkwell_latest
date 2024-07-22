import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUserFirstName, getUsername, logout } from "../services/authService";
import useAuth from "../hooks/useAuth";


const Navbar = () => {
  const { auth, username, firstName } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // handleStorageChange();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.centerLink}>
        <Link to="/" style={styles.link}>
          INKWELL
        </Link>
        <Link to="/upload" style={styles.link}>
          Upload
        </Link>
        <Link to="/about" style={styles.link}>
          About
        </Link>
        {auth ? (
          <>
            {username ? (
              <Link to={`/profile/${username}`} style={styles.link}>
                Hello, {firstName || 'User'}
              </Link>
            ) : (
              <span style={styles.link}>Hello, {firstName || 'User'}</span>
            )}
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>
            Sign Up / Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};


const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "rgba(51, 51, 51, 0.8)", // Translucent background
    color: "#fff",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 1000,
  },
  leftLinks: {
    display: "flex",
    gap: "15px",
    cursor: "pointer",
  },
  centerLink: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "0 20px",
  },
  centerText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
  },
  rightLinks: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    padding: "0 10px",
  },
  button: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  logoutButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 10px",
  }
};





export default Navbar;
