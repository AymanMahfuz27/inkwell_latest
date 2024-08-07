import React, { useState, useEffect } from 'react';
import { User, Mail } from 'lucide-react';
import api from '../services/api';

const Step1PersonalInfo = ({ formData, handleChange, nextStep }) => {
  const [emailError, setEmailError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email.length > 0) {
        setIsCheckingEmail(true);
        try {
          const response = await api.get(`/api/users/check-email/?email=${formData.email}`);
          if (response.data.is_taken) {
            setEmailError('This email is already registered');
          } else {
            setEmailError('');
          }
        } catch (error) {
          console.error('Error checking email:', error);
        }
        setIsCheckingEmail(false);
      }
    };

    const debounceTimer = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.email]);

  const isValid = () => {
    return formData.firstName && formData.lastName && formData.email && !emailError;
  };

  return (
    <div className="step-container">
      <h2>First, fill out some basic information</h2>
      <div className="input-group">
        <label htmlFor="firstName">
          <User size={20} />
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="lastName">
          <User size={20} />
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="email">
          <Mail size={20} />
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
        />
        {isCheckingEmail && <p className="checking-message">Checking email...</p>}
        {emailError && <p className="error-message">{emailError}</p>}
      </div>
      <button onClick={nextStep} disabled={!isValid()} className="next-button">
        Next
      </button>
    </div>
  );
};

export default Step1PersonalInfo;