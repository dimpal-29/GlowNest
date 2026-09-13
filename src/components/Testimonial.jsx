import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    quote: "GlowNest transformed my look completely for my wedding day. The bridal makeup was absolutely flawless and lasted the entire celebration. I couldn't have asked for a better experience!",
    name: "Priya Sharma",
    role: "Bride, December 2025"
  },
  {
    quote: "I've been coming to GlowNest for over two years now. The consistency in quality and the warm, welcoming atmosphere keeps me coming back. My skin has never looked better!",
    name: "Ananya Patel",
    role: "Regular Client"
  },
  {
    quote: "The spa treatments at GlowNest are truly world-class. After every session, I feel completely rejuvenated. The staff is incredibly professional and attentive to detail.",
    name: "Meera Reddy",
    role: "Wellness Enthusiast"
  },
  {
    quote: "Best hair coloring I've ever had! The stylist understood exactly what I wanted and the results exceeded my expectations. The color is vibrant and healthy-looking.",
    name: "Riya Kapoor",
    role: "Fashion Blogger"
  }
];

export default function Testimonial() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < testimonials.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  return (
    <div className="testimonial-slider reveal" id="testimonialSlider">
      <div 
        className="testimonial-track" 
        id="testimonialTrack"
        style={{ transform: `translateX(-${currentSlide * 100}%)`, display: 'flex', transition: 'transform 0.5s ease' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {testimonials.map((t, idx) => (
          <div key={idx} className="testimonial-card" style={{ flex: '0 0 100%', maxWidth: '100%' }}>
            <p className="quote">{t.quote}</p>
            <div className="client-name">{t.name}</div>
            <div className="client-role">{t.role}</div>
          </div>
        ))}
      </div>
      
      <div className="testimonial-dots" id="testimonialDots">
        {testimonials.map((_, idx) => (
          <span 
            key={idx} 
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          ></span>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <Link className="btn btn-feedback" to="/feedback">
          Share Your Feedback <i className="fa-solid fa-comment-dots" style={{ marginLeft: '8px' }}></i>
        </Link>
      </div>
    </div>
  );
}
