import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Users, Sparkles, Heart, Globe, Feather, Target, Zap, Lightbulb, Leaf, DollarSign, Bookmark, FileText, Camera, Coffee, BookOpen, Briefcase } from 'lucide-react';
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
      <div className="inkwell-about-page-content">
        
        <AnimatedSection delay={100}>
          <h1 className="inkwell-about-page-title">Welcome to Inkwell</h1>
          <p className="inkwell-about-page-tagline">Changing the World, One Book at a Time</p>
        </AnimatedSection>
        
        <AnimatedSection delay={300}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Book size={24} />
              Our Story
            </h2>
            <p>
              Inkwell was born from a simple yet revolutionary question: What if all books were free online? This spark of inspiration led to the creation of a platform that not only provides readers with unlimited access to literature but also empowers authors to monetize their creativity in innovative ways.
            </p>
            <p>
              Drawing inspiration from the success of platforms like YouTube and Spotify, we set out to transform the publishing industry. Our goal? To make literature accessible to all while ensuring fair compensation for creators.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={500}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Lightbulb size={24} />
              How Inkwell Works
            </h2>
            <p>
              Inkwell operates on a unique ad-supported model, reimagining how books are consumed and monetized in the digital age:
            </p>
            <ul className="inkwell-about-page-list">
              <li><FileText size={18} /> Writers upload their stories to our platform</li>
              <li><Leaf size={18} /> Non-intrusive leaflet ads are integrated within the pages</li>
              <li><Zap size={18} /> Readers enjoy free access to all books</li>
              <li><DollarSign size={18} /> Authors earn revenue through ad impressions</li>
            </ul>
            <p>
              Our leaflet ads are designed to be easily skippable, maintaining a smooth reading experience while still providing value. Studies show that these ads are more effective and engaging than traditional video ads, as they seamlessly blend with the reading flow.
            </p>
            <p>
              For those who prefer an uninterrupted experience, we offer a small subscription fee option for ad-free reading.
            </p>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={700}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Target size={24} />
              Why Choose Inkwell?
            </h2>
            <div className="inkwell-about-page-columns">
              <div className="inkwell-about-page-column">
                <h3><Users size={20} /> For Readers</h3>
                <ul className="inkwell-about-page-list">
                  <li><Book size={18} /> Access a vast library of books for free</li>
                  <li><Sparkles size={18} /> Discover new authors and genres</li>
                  <li><Globe size={18} /> Enjoy a seamless reading experience across devices</li>
                  <li><Heart size={18} /> Support your favorite writers through engagement</li>
                </ul>
              </div>
              <div className="inkwell-about-page-column">
                <h3><Feather size={20} /> For Writers</h3>
                <ul className="inkwell-about-page-list">
                  <li><DollarSign size={18} /> Monetize your work through ad revenue</li>
                  <li><Users size={18} /> Reach a global audience without barriers</li>
                  <li><Zap size={18} /> Gain valuable insights through analytics</li>
                  <li><Bookmark size={18} /> Retain creative control and rights to your work</li>
                </ul>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={900}>
  <section className="inkwell-about-page-section">
    <h2 className="inkwell-about-page-subtitle">
      <Sparkles size={24} />
      Empowering All Authors
    </h2>
    <p>
      Currently, established authors face challenges with traditional publishing models. They typically receive 10-15% royalties on book sales, often after earning out their advance. This model can lead to unpredictable income and limited insight into reader engagement.
    </p>
    <p>
      With Inkwell, authors gain:
    </p>
    <ul className="inkwell-about-page-list">
      <li><DollarSign size={18} /> Continuous revenue based on reader engagement, not just one-time sales</li>
      <li><Target size={18} /> Detailed analytics on reader behavior and preferences</li>
      <li><Users size={18} /> Direct access to a global audience without geographical limitations</li>
      <li><Zap size={18} /> The ability to update and improve their work based on real-time feedback</li>
    </ul>
    <p>
      This model ensures more consistent revenue and deeper insights into book performance and audience demographics, empowering authors to make data-driven decisions about their work and career.
    </p>
    <h3> Inkwell can benefit both aspiring and established authors:</h3>
    <div className="inkwell-about-page-columns">
      <div className="inkwell-about-page-column">
        <h3><Feather size={20} /> Aspiring Authors</h3>
        <ul className="inkwell-about-page-list">
          <li><Leaf size={18} /> Publish without financial barriers</li>
          <li><Users size={18} /> Build a loyal readership from day one</li>
          <li><Zap size={18} /> Earn based on reader engagement</li>
          <li><Target size={18} /> Access powerful marketing tools and analytics</li>
        </ul>
      </div>
      <div className="inkwell-about-page-column">
        <h3><DollarSign size={20} /> Established Authors</h3>
        <ul className="inkwell-about-page-list">
          <li><Globe size={18} /> Expand your global reach beyond traditional publishing</li>
          <li><Bookmark size={18} /> Diversify income streams with continuous ad revenue</li>
          <li><Sparkles size={18} /> Experiment with new genres without financial risk</li>
          <li><Heart size={18} /> Deepen connections with your fan base through direct interaction</li>
        </ul>
      </div>
    </div>
  </section>
</AnimatedSection>

<AnimatedSection delay={1100}>
  <section className="inkwell-about-page-section">
    <h2 className="inkwell-about-page-subtitle">
      <Book size={24} />
      Specialized Author Opportunities
    </h2>
    <p className="inkwell-about-page-intro">
      Inkwell caters to a diverse range of authors, each benefiting uniquely from our platform. Here's how different author groups can thrive:
    </p>
    <div className="inkwell-author-groups">
      <div className="inkwell-author-group">
        <h3><FileText size={20} /> Textbook Authors</h3>
        <p>Revolutionize education with free access to your materials. As students engage with your content nightly for homework, you generate consistent income. This model addresses the high costs of traditional textbooks while ensuring fair compensation for your expertise.</p>
      </div>
      <div className="inkwell-author-group">
        <h3><BookOpen size={20} /> Fiction Authors</h3>
        <p>Create immersive worlds and series that readers revisit frequently. Popular series like Percy Jackson could generate constant revenue long after initial release, as fans reread and new readers discover your work. Experiment with serialized content to keep readers engaged.</p>
      </div>
      <div className="inkwell-author-group">
        <h3><Coffee size={20} /> Non-Fiction Authors</h3>
        <p>Share your expertise with a global audience. Your books become go-to resources, generating revenue each time readers reference your work. Easily update content to stay current, ensuring long-term relevance and engagement.</p>
      </div>
      <div className="inkwell-author-group">
        <h3><Feather size={20} /> Poets and Short Story Writers</h3>
        <p>Find dedicated audiences for your craft. Monetize shorter works effectively, with readers returning to favorite pieces repeatedly. Compile collections easily and gauge popularity to inform future works.</p>
      </div>
      <div className="inkwell-author-group">
        <h3><Heart size={20} /> Self-Help and Personal Development Authors</h3>
        <p>Build interactive communities around your content. As readers revisit your work for guidance and motivation, you earn consistently. Create companion workbooks or journals to enhance reader engagement.</p>
      </div>
      <div className="inkwell-author-group">
        <h3><Briefcase size={20} /> Business and Entrepreneurship Authors</h3>
        <p>Establish authority by sharing actionable insights and real-world strategies. Use Inkwell to create interactive business guides that engage readers and drive ongoing income. Promote workshops, courses, and consulting services to expand your impact.</p>
      </div>
    </div>
  </section>
</AnimatedSection>



<AnimatedSection delay={1300}>
  <section className="inkwell-about-page-section">
    <h2 className="inkwell-about-page-subtitle">
      <Zap size={24} />
      Innovative Features
    </h2>
    <ul className="inkwell-about-page-list">
      <li><Users size={18} /> Community-building tools for reader engagement and discussion</li>
      <li><Target size={18} /> Advanced analytics for data-driven decision making</li>
      <li><Bookmark size={18} /> Customizable author profiles and book pages</li>
      <li><Leaf size={18} /> Non-intrusive, skippable leaflet ads for a smooth reading experience</li>
      <li><DollarSign size={18} /> Flexible monetization options including ad revenue and optional subscriptions</li>
    </ul>
    <p>
      These features are designed to enhance the experience for both readers and authors, fostering a vibrant literary community while providing sustainable income for creators.
    </p>
  </section>
</AnimatedSection>

        <AnimatedSection delay={1500}>
          <section className="inkwell-about-page-section">
            <h2 className="inkwell-about-page-subtitle">
              <Heart size={24} />
              Join Our Literary Revolution
            </h2>
            <p>
              Inkwell is more than just a platform; it's a movement to democratize literature and empower creators. Whether you're an avid reader, an aspiring writer, or an established author, you have a place in our community.
            </p>
            <p>
              Together, we're creating a world where great stories are accessible to all, and authors are justly rewarded for their creativity and hard work. Join us in shaping the future of publishing, one page at a time.
            </p>
            <button className="inkwell-about-page-cta-button" onClick={() => navigate('/')}>
              Begin Your Inkwell Journey
            </button>
          </section>
        </AnimatedSection>
        
      </div>
    </div>
  );
};

export default AboutPage;