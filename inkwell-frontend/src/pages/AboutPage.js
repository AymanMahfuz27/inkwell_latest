import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Users, Sparkles, Heart } from 'lucide-react';
import WatercolorBackground from '../components/WatercolorBackground';
import '../css/AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="inkwell-about-page-container">
      <WatercolorBackground />
      <div className="inkwell-about-page-content">
        <h1 className="inkwell-about-page-title">About Inkwell</h1>
        
        <section className="inkwell-about-page-section">
          <h2 className="inkwell-about-page-subtitle">
            <Sparkles size={24} />
            Our Mission
          </h2>
          <p>
            Inkwell is dedicated to fostering a vibrant community of readers and writers. 
            We believe in the power of stories to connect, inspire, and transform lives. 
            Our platform aims to make literature accessible to everyone, anywhere, anytime.
          </p>
        </section>
        
        <section className="inkwell-about-page-section">
          <h2 className="inkwell-about-page-subtitle">
            <Book size={24} />
            What We Offer
          </h2>
          <ul className="inkwell-about-page-list">
            <li>A vast library of diverse books across genres</li>
            <li>User-friendly reading experience on any device</li>
            <li>Community features to connect with fellow book lovers</li>
            <li>Opportunity for writers to share their work with a global audience</li>
            <li>Personalized book recommendations</li>
          </ul>
        </section>
        
        <section className="inkwell-about-page-section">
          <h2 className="inkwell-about-page-subtitle">
            <Heart size={24} />
            Our Story
          </h2>
          <p>
            Founded in 2024, Inkwell grew from a simple idea: to create a digital space 
            where the joy of reading meets the convenience of modern technology. What started 
            as a small project has blossomed into a thriving community of bookworms, aspiring 
            authors, and literary enthusiasts from all walks of life.
          </p>
        </section>
        
        <section className="inkwell-about-page-section">
          <h2 className="inkwell-about-page-subtitle">
            <Users size={24} />
            Join Our Community
          </h2>
          <p>
            Whether you're an avid reader, a budding writer, or someone rediscovering the 
            joy of books, there's a place for you at Inkwell. Sign up today and start your 
            literary journey with us!
          </p>
          <button className="inkwell-about-page-cta-button" onClick={() => navigate('/signup')}>
            Join Inkwell
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;