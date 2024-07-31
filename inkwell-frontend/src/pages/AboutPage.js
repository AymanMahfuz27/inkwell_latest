import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Users, Sparkles, Heart, Globe, Feather, Target, Zap } from 'lucide-react';
import WatercolorBackground from '../components/WatercolorBackground';
import '../css/AboutPage.css';

const AnimatedSection = ({ children, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`animated-section ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="inkwell-about-page-container">
      <WatercolorBackground />
      <div className="inkwell-about-page-content">
        <AnimatedSection delay={100}>
          <h1 className="inkwell-about-page-title">About Inkwell</h1>
          <p className="inkwell-about-page-tagline">Empowering voices, connecting worlds through literature</p>
        </AnimatedSection>
        
        <AnimatedSection delay={300}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Sparkles size={24} />
              Our Vision
            </h2>
            <p>
              Inkwell envisions a world where stories know no boundaries, where every voice has the power to resonate across cultures and continents. We believe in the transformative power of literature to foster empathy, spark innovation, and bridge divides in our global community.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={500}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Target size={24} />
              Our Mission
            </h2>
            <p>
              Our mission is to democratize storytelling and create a vibrant, inclusive ecosystem where writers and readers from all walks of life can connect, create, and grow. Inkwell is more than a platform; it's a movement to make literature accessible, diverse, and impactful on a global scale.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={700}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Globe size={24} />
              Global Impact
            </h2>
            <p>
              Inkwell is committed to breaking down linguistic and cultural barriers. By providing tools for translation and cultural exchange, we're fostering a truly global literary community. Our platform enables stories from diverse backgrounds to reach audiences they never could before, promoting cross-cultural understanding and appreciation.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={900}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Zap size={24} />
              Empowering Creators
            </h2>
            <p>
              We believe every story deserves a chance to be heard. Inkwell provides aspiring authors with the tools, resources, and audience they need to hone their craft and share their unique perspectives. From intuitive writing interfaces to community feedback systems, we're empowering the next generation of literary voices.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={1100}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Users size={24} />
              Community-Driven
            </h2>
            <p>
              At the heart of Inkwell is our vibrant community of readers, writers, and literature enthusiasts. We foster meaningful connections, encourage constructive feedback, and create spaces for collaborative storytelling. Our community events, writing challenges, and book clubs bring people together in celebration of the written word.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={1300}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Feather size={24} />
              Innovation in Literature
            </h2>
            <p>
              Inkwell is at the forefront of integrating technology with traditional storytelling. From AI-assisted writing tools to immersive reading experiences, we're constantly exploring new ways to enhance the creation and consumption of literature. Our platform is a testing ground for the future of digital storytelling.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={1500}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Heart size={24} />
              Join Our Story
            </h2>
            <p>
              Whether you're a seasoned author, an aspiring writer, or a passionate reader, there's a place for you in the Inkwell community. Join us in our mission to change the world, one story at a time.
            </p>
            <button className="inkwell-about-page-cta-button" onClick={() => navigate('/signup')}>
              Become Part of Inkwell
            </button>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default AboutPage;