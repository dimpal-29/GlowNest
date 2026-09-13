import React, { useState, useEffect } from 'react';

// Import local assets so Vite processes them correctly
import img1 from '../assets/home/gallary/Bridal_Makeup.jpg';
import img2 from '../assets/home/gallary/Hair_Styling.jpg';
import img3 from '../assets/home/gallary/Nail_Art.jpg';
import img4 from '../assets/home/gallary/Facial_Treatments.jpg';
import img5 from '../assets/home/gallary/Professional_Makeup.jpg';
import img6 from '../assets/home/gallary/spa&massage.jpg';
import img8 from '../assets/home/gallary/Pedicure_Care.jpg';
import img9 from '../assets/home/gallary/Makeup_Glow.jpg';
import img10 from '../assets/engagement-makeup.png';

const categories = ['All', 'Hair', 'Skin', 'Nails', 'Makeup', 'Spa', 'Bridal'];

const items = [
  { img: img1, title: 'Bridal Makeover', category: 'Bridal', sizeClass: 'portfolio-large' },
  { img: img2, title: 'Sculpted Waves', category: 'Hair', sizeClass: 'portfolio-small' },
  { img: img3, title: 'Gel Artistry', category: 'Nails', sizeClass: 'portfolio-tall' },
  { img: img4, title: 'Derma Hydration', category: 'Skin', sizeClass: 'portfolio-wide' },
  { img: img5, title: 'Editorial Vogue', category: 'Makeup', sizeClass: 'portfolio-tall' },
  { img: img6, title: 'Therapeutic Hot Stone', category: 'Spa', sizeClass: 'portfolio-small' },
  { img: img9, title: 'Vibrant Glow', category: 'Makeup', sizeClass: 'portfolio-small' },
  { img: img8, title: 'Aroma Foot Therapy', category: 'Nails', sizeClass: 'portfolio-wide' },
  { img: img10, title: 'Bridal Radiance', category: 'Bridal', sizeClass: 'portfolio-small' }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState({ isOpen: false, currentIndex: 0 });

  // Filter items based on active category
  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  // Manage body scroll lock
  useEffect(() => {
    if (lightbox.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox.isOpen]);

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, lightbox.currentIndex, filteredItems.length]);

  const openLightbox = (index) => {
    setLightbox({ isOpen: true, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, currentIndex: 0 });
  };

  const goToNext = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % filteredItems.length
    }));
  };

  const goToPrev = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + filteredItems.length) % filteredItems.length
    }));
  };

  return (
    <div className="portfolio-section-wrapper">
      {/* Category Filter Tabs */}
      <div className="portfolio-filter-tabs reveal">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`portfolio-filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              closeLightbox(); // Close lightbox if open during category change
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid Layout */}
      <div className="portfolio-grid reveal">
        {filteredItems.map((item, idx) => (
          <div
            key={item.title}
            className={`portfolio-item ${item.sizeClass}`}
            onClick={() => openLightbox(idx)}
          >
            <div className="portfolio-image-wrapper">
              <img src={item.img} alt={item.title} loading="lazy" />
            </div>
            
            {/* Elegant Inner Frame Border */}
            <div className="portfolio-frame-border"></div>

            {/* Premium Text Overlay */}
            <div className="portfolio-hover-overlay">
              <div className="portfolio-details">
                <h3 className="portfolio-item-title">{item.title}</h3>
                <span className="portfolio-view-text">
                  View Work <i className="fa-solid fa-arrow-right-long"></i>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lightbox Modal */}
      {lightbox.isOpen && filteredItems[lightbox.currentIndex] && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close details">
            <i className="fa-solid fa-xmark"></i>
          </button>

          <button 
            className="lightbox-nav-btn lightbox-prev-btn" 
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            aria-label="Previous image"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="lightbox-content-container" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img-wrapper">
              <img
                src={filteredItems[lightbox.currentIndex].img}
                alt={filteredItems[lightbox.currentIndex].title}
                className="lightbox-img"
              />
            </div>
            <div className="lightbox-info-bar">
              <div className="lightbox-text">
                <h4 className="lightbox-title-text">{filteredItems[lightbox.currentIndex].title}</h4>
              </div>
              <div className="lightbox-pagination">
                <span className="current-num">{lightbox.currentIndex + 1}</span>
                <span className="divider">/</span>
                <span className="total-num">{filteredItems.length}</span>
              </div>
            </div>
          </div>

          <button 
            className="lightbox-nav-btn lightbox-next-btn" 
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label="Next image"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
