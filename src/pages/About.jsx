import React from 'react';
import { Link } from 'react-router-dom';

// Import images
import founderImg from '../assets/about/founder.jpg';
import anikaImg from '../assets/about/Experts/Anika_Desai.jpg';
import meeraImg from '../assets/about/Experts/Dr._Meera_Joshi.jpg';
import priyaImg from '../assets/about/Experts/Priya_Nair.jpg';
import kavyaImg from '../assets/about/Experts/Kavya_Rao.jpg';

import galHair from '../assets/about/Gallery/Hair_Transformations.jpg';
import galMakeup from '../assets/about/Gallery/Makeup_Artistry.jpg';
import galSpa from '../assets/about/Gallery/Spa_Serenity.jpg';
import galBridal from '../assets/about/Gallery/Bridal_Magic.jpg';
import galNail from '../assets/about/Gallery/Nail_Art_Gallery.jpg';
import galStudio from '../assets/about/Gallery/Our_Studio.jpg';

// CSS imports
import '../css/services.css';
import '../css/about.css';

export default function About() {
  const milestones = [
    { year: '2014', title: 'The Beginning', desc: 'GlowNest opens its doors as a small beauty studio with 3 stylists and a vision.' },
    { year: '2016', title: 'First Award', desc: 'Won "Best New Salon" award from the Mumbai Beauty Association.' },
    { year: '2018', title: 'Expansion', desc: 'Relocated to our flagship 3,000 sq ft studio with 15 service stations.' },
    { year: '2020', title: 'Digital Launch', desc: 'Launched our online booking platform for seamless appointment scheduling.' },
    { year: '2023', title: 'Spa & Wellness Wing', desc: 'Added a dedicated spa and wellness wing with international therapists.' },
    { year: '2026', title: 'Premium Excellence', desc: 'Serving 15,000+ clients with 35 experts and 28 awards to our name.' }
  ];

  const team = [
    { name: 'Anika Desai', role: 'Creative Director & Lead Stylist', desc: '15+ years of experience in international hair styling and color techniques.', img: anikaImg },
    { name: 'Dr. Meera Joshi', role: 'Skin Care Specialist', desc: 'Dermatology expert with advanced certifications in aesthetic treatments.', img: meeraImg },
    { name: 'Priya Nair', role: 'Bridal Makeup Artist', desc: 'Renowned bridal artist featured in top wedding magazines across India.', img: priyaImg },
    { name: 'Kavya Rao', role: 'Spa & Wellness Therapist', desc: 'Internationally trained in Swedish, Thai, and Ayurvedic massage techniques.', img: kavyaImg }
  ];

  const values = [
    { icon: 'fa-gem', title: 'Excellence', desc: 'We strive for perfection in every service, using only the finest products and techniques.' },
    { icon: 'fa-handshake', title: 'Personal Care', desc: 'Every client is unique. We customize every treatment to match your individual needs.' },
    { icon: 'fa-leaf', title: 'Sustainability', desc: 'We choose organic, cruelty-free products and eco-friendly practices for a better tomorrow.' },
    { icon: 'fa-wand-magic-sparkles', title: 'Innovation', desc: 'We stay ahead with the latest beauty trends, tools, and international techniques.' },
    { icon: 'fa-shield-halved', title: 'Trust & Safety', desc: 'Your safety is our priority. We maintain impeccable hygiene and sterilization standards.' },
    { icon: 'fa-heart', title: 'Empowerment', desc: 'We believe in empowering you to feel beautiful, confident, and unstoppable.' }
  ];

  const galleryItems = [
    { img: galHair, label: 'Hair Transformations' },
    { img: galMakeup, label: 'Makeup Artistry' },
    { img: galSpa, label: 'Spa Serenity' },
    { img: galBridal, label: 'Bridal Magic' },
    { img: galNail, label: 'Nail Art Gallery' },
    { img: galStudio, label: 'Our Studio' }
  ];

  return (
    <div className="about-page-wrapper">
      {/* Page Header */}
      <section 
        className="page-header" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(62, 39, 35, 0.75)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1>About GlowNest</h1>
          <p>Where beauty meets expertise — discover our story, passion, and the team behind your glow.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span><i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', margin: '0 8px' }}></i></span>
            <span>About</span>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="story-section">
        <div class="container">
          <div className="story-grid">
            <div className="story-image reveal-left">
              <img src={founderImg} alt="GlowNest Studio Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="img-fluid-cover" />
            </div>
            <div className="story-content reveal-right">
              <h2>Our <span className="highlight">Story</span></h2>
              <p>Founded in 2014, GlowNest began as a small beauty studio with a big dream — to create a space where every person could feel truly beautiful. What started as a passion project has blossomed into Mumbai's most trusted beauty destination.</p>
              <p>Over the past 12 years, we've served over 15,000 happy clients, earned 28 industry awards, and built a team of 35 certified beauty experts. But our proudest achievement? The smiles we see every single day.</p>
              <div className="story-highlights">
                <div className="highlight-item"><span className="icon"><i className="fa-solid fa-check"></i></span> Premium organic products</div>
                <div className="highlight-item"><span className="icon"><i className="fa-solid fa-check"></i></span> Internationally certified team</div>
                <div className="highlight-item"><span className="icon"><i className="fa-solid fa-check"></i></span> Award-winning services</div>
                <div className="highlight-item"><span className="icon"><i className="fa-solid fa-check"></i></span> 15,000+ happy clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Journey</h2>
            <p>Key milestones that shaped GlowNest into what it is today.</p>
          </div>
          <div className="timeline">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="timeline-item reveal">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-year">{milestone.year}</span>
                  <h4>{milestone.title}</h4>
                  <p>{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Meet Our Experts</h2>
            <p>Our talented team of certified professionals who bring artistry and care to every appointment.</p>
          </div>
          <div className="team-grid">
            {team.map((member, idx) => (
              <div key={idx} className="team-card reveal">
                <div className="team-avatar">
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="img-fluid-cover" />
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <div className="role">{member.role}</div>
                  <p>{member.desc}</p>
                  <div className="team-social">
                    <a href="#"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#"><i className="fa-solid fa-briefcase"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="values-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do at GlowNest.</p>
          </div>
          <div className="values-grid">
            {values.map((val, idx) => (
              <div key={idx} className="value-card reveal">
                <div className="value-icon"><i className={`fa-solid ${val.icon}`}></i></div>
                <h4>{val.title}</h4>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Our Gallery</h2>
            <p>A glimpse into the world of GlowNest — our work, our space, our passion.</p>
          </div>
          <div className="gallery-grid reveal">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="gallery-item">
                <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="img-fluid-cover" />
                <span className="gallery-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section about-cta-premium" id="ctaSection">
        <div className="about-cta-overlay-circle"></div>
        <div className="container">
          <div className="reveal about-cta-content">
            <h2 className="about-cta-heading">Become Part of the <span className="text-primary">GlowNest</span> Family</h2>
            <p className="about-cta-text">Join thousands of happy clients who trust us with their beauty transformations. Experience premium care and luxury treatments tailored just for you.</p>
            <div className="cta-btns about-cta-btns">
              <Link to="/services" className="btn about-cta-btn-primary">Book Appointment</Link>
              <Link to="/contact" className="btn about-cta-btn-outline">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
