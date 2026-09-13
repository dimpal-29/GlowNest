import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import Testimonial from '../components/Testimonial.jsx';
import Gallery from '../components/Gallery.jsx';

// Import images
import hsImg from '../assets/home/services/hairstyling.jpg';
import ftImg from '../assets/home/services/Facial Treatments (1).jpg';
import naImg from '../assets/home/services/Nail Art & Care.jpg';
import bmImg from '../assets/home/services/Bridal Makeup.jpg';
import smImg from '../assets/home/services/Spa & Massage.jpg';
import scImg from '../assets/home/services/Skin Care.jpg';

// CSS imports
import '../css/home.css';

// Subcomponent for stats counting animation
function CounterItem({ target, label, icon }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16); // 16ms per frame (~60fps)
    
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [target]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num;
  };

  return (
    <div className="stat-item">
      <div className="stat-icon"><i className={`fa-solid ${icon}`}></i></div>
      <div className="stat-number">{formatNumber(count)}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Home() {
  const featuredServices = [
    { image: hsImg, title: 'Hair Styling', desc: 'From cuts and colors to styling and treatments for all hair types.', price: 'From ₹499' },
    { image: ftImg, title: 'Facial Treatments', desc: 'Rejuvenating treatments tailored to your skin type for a healthy glow.', price: 'From ₹899' },
    { image: naImg, title: 'Nail Art & Care', desc: 'Beautiful manicures, pedicures, and creative nail art designs.', price: 'From ₹399' },
    { image: bmImg, title: 'Bridal Makeup', desc: 'Make your special day unforgettable with our expert bridal packages.', price: 'From ₹4,999' },
    { image: smImg, title: 'Spa & Massage', desc: 'Relax and unwind with our therapeutic massage and spa treatments.', price: 'From ₹999' },
    { image: scImg, title: 'Skin Care', desc: 'Advanced skin treatments for acne, pigmentation, and anti-aging.', price: 'From ₹699' }
  ];

  return (
    <div className="home-page-wrapper">
      {/* Hero Slider */}
      <Hero />

      {/* Featured Services */}
      <section className="section featured-services" id="featuredServices">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Premium Services</h2>
            <p>Discover our range of beauty and wellness services designed to make you look and feel your absolute best.</p>
          </div>
          <div className="services-grid">
            {featuredServices.map((service, idx) => (
              <ServiceCard 
                key={idx}
                image={service.image}
                title={service.title}
                desc={service.desc}
                price={service.price}
              />
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/services" className="btn btn-secondary">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* Packages Promo Banner */}
      <section className="section packages-promo-banner" id="packagesBanner"
        style={{
          background: '#fdf6f2',
          padding: '100px 0',
          overflow: 'hidden',
          position: 'relative',
          borderTop: '1px solid rgba(109,76,65,0.05)',
          borderBottom: '1px solid rgba(109,76,65,0.05)'
        }}
      >
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, #fceae2, transparent)', opacity: 0.6, borderRadius: '50%', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, #fceae2, transparent)', opacity: 0.6, borderRadius: '50%', zIndex: 1 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xl)', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ flex: '1.2', minWidth: '300px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0e4db', color: '#5d4037', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(109,76,65,0.1)' }}>
                <i className="fa-solid fa-gem" style={{ fontSize: '0.8rem' }}></i> BETTER VALUE
              </div>
              <h2 style={{ color: '#3e2723', fontSize: '3rem', fontFamily: 'var(--font-heading)', fontWeight: 700, lineHeight: 1.1, marginBottom: '20px' }}>
                Want to Save More? <br /><span style={{ color: 'var(--color-gold)' }}>Try Our Packages!</span>
              </h2>
              <p style={{ color: '#6d4c41', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: 0, maxWidth: '480px' }}>
                Bundle multiple treatments together and save up to <strong style={{ color: 'var(--color-primary)' }}>33%</strong>. Our curated packages are designed for maximum results at the best price.
              </p>
            </div>

            <div style={{ flex: 1, minWidth: '320px', maxWidth: '550px', background: '#ffffff', padding: '40px', borderRadius: '30px', boxShadow: '0 30px 60px -12px rgba(93,64,55,0.15)', border: '1px solid rgba(255,255,255,0.8)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', marginBottom: '35px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px dotted rgba(93,64,55,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <i className="fa-solid fa-medal" style={{ color: '#cd7f32', fontSize: '1.5rem' }}></i>
                    <span style={{ fontWeight: 600, color: '#3e2723', fontSize: '1.15rem' }}>Essential Grooming</span>
                  </div>
                  <strong style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>₹1,499</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px dotted rgba(93,64,55,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <i className="fa-solid fa-medal" style={{ color: '#c0c0c0', fontSize: '1.5rem' }}></i>
                    <span style={{ fontWeight: 600, color: '#3e2723', fontSize: '1.15rem' }}>Signature Radiance</span>
                  </div>
                  <strong style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>₹2,999</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px dotted rgba(93,64,55,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <i className="fa-solid fa-medal" style={{ color: '#ffd700', fontSize: '1.5rem' }}></i>
                    <span style={{ fontWeight: 600, color: '#3e2723', fontSize: '1.15rem' }}>Premium Transformation</span>
                  </div>
                  <strong style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>₹4,999</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <i className="fa-solid fa-gem" style={{ color: '#b9f2ff', fontSize: '1.5rem' }}></i>
                    <span style={{ fontWeight: 600, color: '#3e2723', fontSize: '1.15rem' }}>Ultimate Pre-Bridal</span>
                  </div>
                  <strong style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>₹12,499</strong>
                </div>
              </div>

              <Link to="/packages" className="btn btn-primary btn-lg" style={{ display: 'flex', justifyContent: 'center' }}>
                Explore All Packages <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-us" id="whyUs">
        <div className="container">
          <div className="section-header reveal">
            <h2>Why Choose GlowNest</h2>
            <p>We are committed to delivering exceptional beauty experiences with passion and expertise.</p>
          </div>
          <div className="stats-grid reveal">
            <CounterItem target={12} label="Years of Experience" icon="fa-trophy" />
            <CounterItem target={15000} label="Happy Clients" icon="fa-face-smile" />
            <CounterItem target={35} label="Expert Stylists" icon="fa-palette" />
            <CounterItem target={28} label="Awards Won" icon="fa-medal" />
          </div>
          
          <div className="features-grid">
            <div className="feature-item reveal">
              <div className="icon"><i className="fa-solid fa-leaf"></i></div>
              <div>
                <h4>Organic Products</h4>
                <p>We use only premium, organic products that are gentle on your skin.</p>
              </div>
            </div>
            <div className="feature-item reveal">
              <div className="icon"><i className="fa-solid fa-clock"></i></div>
              <div>
                <h4>Flexible Timing</h4>
                <p>Book at your convenience with our extended working hours.</p>
              </div>
            </div>
            <div className="feature-item reveal">
              <div className="icon"><i className="fa-solid fa-gem"></i></div>
              <div>
                <h4>Luxury Experience</h4>
                <p>Every visit is designed to be a premium, relaxing experience.</p>
              </div>
            </div>
            <div className="feature-item reveal">
              <div className="icon"><i className="fa-solid fa-graduation-cap"></i></div>
              <div>
                <h4>Certified Experts</h4>
                <p>Our team holds international certifications in beauty and wellness.</p>
              </div>
            </div>
            <div className="feature-item reveal">
              <div className="icon"><i className="fa-solid fa-handshake"></i></div>
              <div>
                <h4>Personalized Care</h4>
                <p>Customized treatments tailored to your unique needs and preferences.</p>
              </div>
            </div>
            <div className="feature-item reveal">
              <div className="icon"><i className="fa-solid fa-shield-halved"></i></div>
              <div>
                <h4>Hygiene First</h4>
                <p>We maintain the highest standards of cleanliness and sterilization.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials" id="testimonials">
        <div className="container">
          <div className="section-header reveal">
            <h2>What Our Clients Say</h2>
            <p>Real stories from our valued clients who trust us with their beauty journey.</p>
          </div>
          <Testimonial />
        </div>
      </section>

      {/* Gallery */}
      <section className="section gallery" id="gallery">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Recent Work</h2>
            <p>Take a look at some of the stunning transformations we've created for our beautiful clients.</p>
          </div>
          <Gallery />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section" id="ctaSection">
        <div className="container reveal">
          <h2>Ready to <span className="text-primary">Glow</span>?</h2>
          <p>Book your appointment today and let our experts bring out the best version of you. Your beauty journey starts here.</p>
          <div className="cta-btns">
            <Link to="/services" className="btn btn-primary btn-lg">Book Appointment</Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
