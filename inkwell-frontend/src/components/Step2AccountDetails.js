import React, { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import api from '../services/api';

const Step2AccountDetails = ({ formData, handleChange, nextStep, prevStep }) => {
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length > 0) {
        setIsCheckingUsername(true);
        try {
          const response = await api.get(`/api/users/check-username/?username=${formData.username}`);
          if (response.data.is_taken) {
            setUsernameError('This username is already taken');
          } else {
            setUsernameError('');
          }
        } catch (error) {
          console.error('Error checking username:', error);
        }
        setIsCheckingUsername(false);
      }
    };

    const debounceTimer = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.username]);

  const isValid = () => {
    return formData.username && formData.password && formData.confirmPassword &&
           formData.password === formData.confirmPassword && !usernameError;
  };

  return (
    <div className="step-container">
      <h2>Set your username and password</h2>
      <div className="input-group">
        <label htmlFor="username">
          <User size={20} />
          Username
        </label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange('username')}
          required
        />
        {isCheckingUsername && <p className="checking-message">Checking username...</p>}
        {usernameError && <p className="error-message">{usernameError}</p>}
      </div>
      <div className="input-group">
        <label htmlFor="password">
          <Lock size={20} />
          Password
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange('password')}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="confirmPassword">
          <Lock size={20} />
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
        />
      </div>
      <div className="button-group">
        <button onClick={prevStep} className="back-button">
          Back
        </button>
        <button onClick={nextStep} disabled={!isValid()} className="next-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2AccountDetails;