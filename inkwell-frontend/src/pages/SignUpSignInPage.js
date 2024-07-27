import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus, LogIn, FileText } from 'lucide-react';
import api from "../services/api";
import { login as authLogin } from "../services/authService";
import WatercolorBackground from '../components/WatercolorBackground';
import '../css/SignUpSignInPage.css';

const SignUpSignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        const response = await api.post("/api/users/register/", {
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          bio,
        });
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        navigate("/");
      } else {
        await authLogin(username, password);
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setError("Authentication failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="inkwell-signup-signin-page-container">
      <WatercolorBackground />
      <div className="inkwell-signup-signin-page-content">
        <h1 className="inkwell-signup-signin-page-title">
          {isSignUp ? "Join Inkwell" : "Welcome Back"}
        </h1>
        <form onSubmit={handleSubmit} className="inkwell-signup-signin-page-form">
          <div className="inkwell-signup-signin-page-input-group">
            <label htmlFor="username" className="inkwell-signup-signin-page-label">
              <User size={20} />
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="inkwell-signup-signin-page-input"
            />
          </div>
          {isSignUp && (
            <>
              <div className="inkwell-signup-signin-page-input-group">
                <label htmlFor="email" className="inkwell-signup-signin-page-label">
                  <Mail size={20} />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="inkwell-signup-signin-page-input"
                />
              </div>
              <div className="inkwell-signup-signin-page-input-group">
                <label htmlFor="firstName" className="inkwell-signup-signin-page-label">
                  <User size={20} />
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="inkwell-signup-signin-page-input"
                />
              </div>
              <div className="inkwell-signup-signin-page-input-group">
                <label htmlFor="lastName" className="inkwell-signup-signin-page-label">
                  <User size={20} />
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="inkwell-signup-signin-page-input"
                />
              </div>
              <div className="inkwell-signup-signin-page-input-group">
                <label htmlFor="bio" className="inkwell-signup-signin-page-label">
                  <FileText size={20} />
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="inkwell-signup-signin-page-textarea"
                />
              </div>
            </>
          )}
          <div className="inkwell-signup-signin-page-input-group">
            <label htmlFor="password" className="inkwell-signup-signin-page-label">
              <Lock size={20} />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="inkwell-signup-signin-page-input"
            />
          </div>
          {isSignUp && (
            <div className="inkwell-signup-signin-page-input-group">
              <label htmlFor="confirmPassword" className="inkwell-signup-signin-page-label">
                <Lock size={20} />
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="inkwell-signup-signin-page-input"
              />
            </div>
          )}
          {error && <p className="inkwell-signup-signin-page-error">{error}</p>}
          <button type="submit" className="inkwell-signup-signin-page-submit-button">
            {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="inkwell-signup-signin-page-toggle-button"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignUpSignInPage;