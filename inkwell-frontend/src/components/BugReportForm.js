// src/components/BugReportForm.js
import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';
import '../css/BugReportForm.css';

const BugReportForm = ({ onClose }) => {
  const [type, setType] = useState('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post('/api/feedback/', { type, title, description });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="bug-report-form">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Thank You!</h2>
        <p>Your {type} report has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="bug-report-overlay">
      <div className="bug-report-form">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Report a Bug / Suggest a Feature</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <input
                type="radio"
                value="bug"
                checked={type === 'bug'}
                onChange={() => setType('bug')}
              />
              Report a Bug
            </label>
            <label>
              <input
                type="radio"
                value="feature"
                checked={type === 'feature'}
                onChange={() => setType('feature')}
              />
              Suggest a Feature
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BugReportForm;

