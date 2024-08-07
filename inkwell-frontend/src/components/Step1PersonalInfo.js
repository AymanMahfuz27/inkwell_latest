import React from 'react';
import { User, Mail } from 'lucide-react';

const Step1PersonalInfo = ({ formData, handleChange, nextStep }) => {
  const isValid = () => {
    return formData.firstName && formData.lastName && formData.email;
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
      </div>
      <button onClick={nextStep} disabled={!isValid()} className="next-button">
        Next
      </button>
    </div>
  );
};

export default Step1PersonalInfo;