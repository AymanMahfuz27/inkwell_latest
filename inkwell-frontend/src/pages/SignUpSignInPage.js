import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Mail, Lock } from 'lucide-react';
import { login as authLogin } from "../services/authService";
import WatercolorBackground from '../components/WatercolorBackground';
import MultiStepSignupForm from '../components/MultiStepSignupForm';
import '../css/SignUpSignInPage.css';
import api from '../services/api';
const SignUpSignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/api/users/login/", {
        username: usernameOrEmail,  // This field name should match what the backend expects
        password: password
      });
      
      // Handle successful login (e.g., store tokens, redirect)
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/");
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
        {isSignUp ? (
          <MultiStepSignupForm />
        ) : (
          <form onSubmit={handleSignIn} className="inkwell-signup-signin-page-form">
            <div className="inkwell-signup-signin-page-input-group">
              <label htmlFor="usernameOrEmail" className="inkwell-signup-signin-page-label">
                <User size={20} />
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                className="inkwell-signup-signin-page-input"
              />
            </div>
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
            {error && <p className="inkwell-signup-signin-page-error">{error}</p>}
            <button type="submit" className="inkwell-signup-signin-page-submit-button">
              <LogIn size={20} />
              Sign In
            </button>
          </form>

        )}
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