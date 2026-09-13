import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [newsletterStatus, setNewsletterStatus] = useState('Join');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('✓ Joined!');
    setNewsletterEmail('');
    setTimeout(() => {
      setNewsletterStatus('Join');
    }, 2500);
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-about">
            <Link to="/" className="footer-logo-link">
              <span className="footer-brand-text">GlowNest</span>
            </Link>
            <p>Your premier destination for beauty and wellness. We combine expertise, luxury, and care to deliver an unforgettable experience.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/packages">Packages</Link></li>
              <li><Link to="/mybooking">My Bookings</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Hair Styling</Link></li>
              <li><Link to="/services">Facial Treatments</Link></li>
              <li><Link to="/services">Nail Art & Care</Link></li>
              <li><Link to="/services">Bridal Makeup</Link></li>
              <li><Link to="/services">Spa & Massage</Link></li>
              <li><Link to="/services">Skin Care</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="footer-contact-item">
              <span className="icon"><i className="fa-solid fa-location-dot"></i></span>
              <span>123 Beauty Lane, Rose District,<br />Mumbai, MH 400001</span>
            </div>
            <div className="footer-contact-item">
              <span className="icon"><i class="fa-solid fa-phone"></i></span>
              <span>+91 98765 43210</span>
            </div>
            <div className="footer-contact-item">
              <span className="icon"><i class="fa-solid fa-envelope"></i></span>
              <span>hello@glownest.com</span>
            </div>
            
            <div className="footer-newsletter">
              <p>Subscribe for offers & updates</p>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  required 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button 
                  type="submit" 
                  style={newsletterStatus === '✓ Joined!' ? { background: 'var(--color-success)' } : {}}
                >
                  {newsletterStatus}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 GlowNest. Crafted with <i className="fa-solid fa-heart heart heart-icon-footer"></i> for beauty lovers.</p>
        </div>
      </div>
    </footer>
  );
}
