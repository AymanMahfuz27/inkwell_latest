import React from 'react';
import '../css/AboutPage.css';
import { Navigate } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1>About Inkwell</h1>
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          Inkwell is dedicated to fostering a vibrant community of readers and writers. 
          We believe in the power of stories to connect, inspire, and transform lives. 
          Our platform aims to make literature accessible to everyone, anywhere, anytime.
        </p>
      </section>
      
      <section className="features">
        <h2>What We Offer</h2>
        <ul>
          <li>A vast library of diverse books across genres</li>
          <li>User-friendly reading experience on any device</li>
          <li>Community features to connect with fellow book lovers</li>
          <li>Opportunity for writers to share their work with a global audience</li>
          <li>Personalized book recommendations</li>
        </ul>
      </section>
      
      <section className="story">
        <h2>Our Story</h2>
        <p>
          Founded in 2024, Inkwell grew from a simple idea: to create a digital space 
          where the joy of reading meets the convenience of modern technology. What started 
          as a small project has blossomed into a thriving community of bookworms, aspiring 
          authors, and literary enthusiasts from all walks of life.
        </p>
      </section>
      
      <section className="values">
        <h2>Our Values</h2>
        <ul>
          <li>Accessibility: Making literature available to everyone</li>
          <li>Diversity: Celebrating a wide range of voices and perspectives</li>
          <li>Innovation: Constantly improving our platform for the best user experience</li>
          <li>Community: Fostering connections through the love of reading</li>
          <li>Creativity: Encouraging and supporting new literary voices</li>
        </ul>
      </section>
      
      <section className="join-us">
        <h2>Join Our Community</h2>
        <p>
          Whether you're an avid reader, a budding writer, or someone rediscovering the 
          joy of books, there's a place for you at Inkwell. Sign up today and start your 
          literary journey with us!
        </p>
        <button className="cta-button" onClick={Navigate('/')}>Sign Up Now</button>
      </section>
    </div>
  );
};

export default AboutPage;

