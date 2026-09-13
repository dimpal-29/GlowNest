import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    badge: 'Premium Hair Care',
    title: 'Transform Your Look',
    desc: 'Experience the art of styling with our expert team and premium products.',
    btn1Text: 'Book Appointment',
    btn1Link: '/services',
    btn2Text: 'Explore Services',
    btn2Link: '/services',
    bgClass: 'hero-slide-1'
  },
  {
    badge: 'Rejuvenating Facials',
    title: 'Unleash Your Natural Glow',
    desc: 'Revitalize your skin with our signature spa and facial treatments.',
    btn1Text: 'Book Appointment',
    btn1Link: '/services',
    btn2Text: 'Explore Services',
    btn2Link: '/services',
    bgClass: 'hero-slide-2'
  },
  {
    badge: 'Bridal Makeovers',
    title: 'Your Special Day',
    desc: 'Look absolutely flawless with our custom bridal and pre-bridal packages.',
    btn1Text: 'Book Appointment',
    btn1Link: '/services',
    btn2Text: 'View Packages',
    btn2Link: '/packages',
    bgClass: 'hero-slide-3'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-slider" id="heroSlider">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`hero-slide ${index === currentSlide ? 'active' : ''} ${slide.bgClass}`}
          >
            <div className="hero-bg"></div>
            <div className="hero-overlay"></div>
            <div className="container hero-content">
              <div className="hero-text text-white">
                <span className="hero-badge">
                  <i className="fa-solid fa-wand-magic-sparkles"></i> {slide.badge}
                </span>
                <h1>{slide.title}</h1>
                <p>{slide.desc}</p>
                <div className="hero-btns">
                  <Link to={slide.btn1Link} className="btn btn-primary btn-lg">{slide.btn1Text}</Link>
                  <Link to={slide.btn2Link} className="btn btn-secondary btn-lg hero-btn-outline-white">
                    {slide.btn2Text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <div className="slider-controls">
        <button className="slider-arrow" id="heroPrev" onClick={handlePrev} aria-label="Previous Slide">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className="slider-arrow" id="heroNext" onClick={handleNext} aria-label="Next Slide">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div className="slider-dots" id="heroDots">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
}
