import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Bug } from 'lucide-react';
import '../css/Footer.css';
import BugReportForm from './BugReportForm';
import { isAuthenticated } from '../services/authService';



const Footer = () => {
  const [showBugReport, setShowBugReport] = useState(false);
  const navigate = useNavigate();
  const handleBugReportClick = () => {
    if (isAuthenticated()) {
      setShowBugReport(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <footer className="inkwell-footer">
      <div className="inkwell-footer-content">
        <div className="inkwell-footer-section">
          <h3>About Inkwell</h3>
          <p>Inkwell is a modern platform for book lovers {"\n"}to discover, read, and share their favorite stories.</p>
        </div>
        <div className="inkwell-footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/books">All Books</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/genres">All Genres</Link></li>
          </ul>
        </div>
        <div className="inkwell-footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@inkwell.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Book Street, Literary City, 12345</p>
        </div>
        <div className="inkwell-footer-section">
          <h3>Follow Us</h3>
          <div className="inkwell-footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
            <a href="mailto:support@inkwell.com"><Mail size={20} /></a>
          </div>
        </div>
        <div className="inkwell-footer-section inkwell-footer-bug-report">
          <button className="report-bug-button" onClick={handleBugReportClick}>
            <Bug size={24} />
            Report a Bug / Suggest a Feature
          </button>
        </div>
      </div>
      
      <div className="inkwell-footer-bottom">
        <p>&copy; 2024 Inkwell. All rights reserved.</p>
        <div>
          <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
      
      {showBugReport && <BugReportForm onClose={() => setShowBugReport(false)} />}
    </footer>

  );
};

export default Footer;