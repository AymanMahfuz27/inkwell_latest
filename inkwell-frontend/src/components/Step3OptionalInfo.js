import React from 'react';
import { FileText, Image } from 'lucide-react';

const Step3OptionalInfo = ({ formData, handleChange, handleFileChange, handleSubmit, prevStep }) => {
  return (
    <div className="step-container">
      <h2>Personalize your account</h2>
      <div className="input-group">
        <label htmlFor="bio">
          <FileText size={20} />
          Short Bio
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={handleChange('bio')}
          placeholder="Tell us about yourself (optional)"
        />
      </div>
      <div className="input-group">
        <label htmlFor="profilePicture">
          <Image size={20} />
          Profile Picture
        </label>
        <input
          type="file"
          id="profilePicture"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      <div className="button-group">
        <button onClick={prevStep} className="back-button">
          Back
        </button>
        <button onClick={handleSubmit} className="submit-button">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Step3OptionalInfo;