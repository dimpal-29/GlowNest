import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import '../css/services.css';

const FILTER_TABS = [
  { key: 'all', label: 'All Services' },
  { key: 'hair', label: 'Hair Care' },
  { key: 'skin', label: 'Skin & Facials' },
  { key: 'nails', label: 'Nails' },
  { key: 'makeup', label: 'Makeup' },
  { key: 'spa', label: 'Spa & Massage' },
  { key: 'bridal', label: 'Bridal' },
];

export default function Services() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get('/services');
        setServicesData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  // Filter logic
  const filteredServices = servicesData.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || service.title.toLowerCase().includes(term) || service.desc.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  const handleBookService = async (service) => {
    const isLoggedIn = localStorage.getItem('glowNest_isLoggedIn') === 'true';
    if (!isLoggedIn) {
      const confirmed = await window.showAppConfirm('Please login first, then book services');
      if (confirmed) {
        localStorage.setItem('glowNest_redirectAfterLogin', '/booking');
        navigate('/login');
      }
      return;
    }
    // Build URL
    const modeParam = mode ? `&mode=${mode}` : '';
    const paramKey = service.isPackage ? 'package' : 'service';
    navigate(`/booking?${paramKey}=${encodeURIComponent(service.title)}&price=${encodeURIComponent(service.price)}${modeParam}`);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(62, 39, 35, 0.75)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1>Premium Beauty Services</h1>
          <p>Discover our comprehensive range of expert beauty treatments tailored to bring out your natural glow.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span><i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', margin: '0 8px' }}></i></span>
            <span>Services</span>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-wrapper">
            <div className="filter-tabs" id="filterTabs">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`filter-tab ${activeCategory === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                id="serviceSearch"
                placeholder="Search for hair, skin, bridal..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-listing">
        <div className="container">
          <div className="services-full-grid" id="servicesGrid">
            {filteredServices.length === 0 ? (
              <div className="no-results" id="noResults">
                <div className="icon">🔍</div>
                <h3>No services found</h3>
                <p>We couldn't find any services matching your search criteria. Please try another term.</p>
              </div>
            ) : (
              filteredServices.map((service, idx) => (
                <div key={idx} className="service-detail-card" data-category={service.category}>
                  <div className="card-image">
                    <img src={service.image} alt={service.title} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <span className="card-category">
                      {{ hair: 'Hair Care', skin: 'Skin & Facials', nails: 'Nails', makeup: 'Makeup', spa: 'Spa & Massage', bridal: 'Bridal' }[service.category]}
                    </span>
                    <h3>{service.title}</h3>
                    <p className="card-desc">{service.desc}</p>
                    <div className="card-meta">
                      <span className="duration">⏱ {service.duration}</span>
                      <span className="price">{service.price}</span>
                    </div>
                    <button
                      className="btn btn-primary book-service-btn"
                      onClick={() => handleBookService(service)}
                    >
                      {service.isPackage ? 'Book Package' : 'Book Appointment'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Packages Promo Banner */}
      <section id="packagesBanner" style={{ background: '#fcf6f2', padding: '100px 0', overflow: 'hidden', position: 'relative', borderTop: '1px solid rgba(109,76,65,0.05)', borderBottom: '1px solid rgba(109,76,65,0.05)' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,230,220,0.4), transparent)', borderRadius: '50%', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(255,230,220,0.4), transparent)', borderRadius: '50%', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xl)', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ flex: '1.2', minWidth: '300px' }}>
              <span style={{ background: '#f0e6dd', padding: '6px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 800, color: '#5a4634', letterSpacing: '1px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <i className="fa-solid fa-gem" style={{ fontSize: '0.65rem' }}></i> BETTER VALUE
              </span>
              <h2 style={{ color: '#3e2723', fontSize: '3rem', fontFamily: 'var(--font-heading)', fontWeight: 700, lineHeight: 1.1, marginBottom: '20px' }}>
                Want to Save More? <br /><span style={{ color: '#c19b45' }}>Try Our Packages!</span>
              </h2>
              <p style={{ color: '#6d4c41', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: 0, maxWidth: '480px' }}>
                Bundle multiple treatments together and save up to <strong style={{ color: '#c19b45' }}>33%</strong>. Our curated packages are designed for maximum results at the best price.
              </p>
            </div>
            
            <div style={{ background: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', flex: '1', minWidth: '320px', maxWidth: '450px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#3e2723' }}>
                    <i className="fa-solid fa-medal" style={{ color: '#d97d4a', fontSize: '1.2rem' }}></i>
                    <span>Essential Grooming</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#c19b45' }}>₹1,499</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#3e2723' }}>
                    <i className="fa-solid fa-medal" style={{ color: '#b5b5b5', fontSize: '1.2rem' }}></i>
                    <span>Signature Radiance</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#c19b45' }}>₹2,999</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#3e2723' }}>
                    <i className="fa-solid fa-medal" style={{ color: '#ffb300', fontSize: '1.2rem' }}></i>
                    <span>Premium Transformation</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#c19b45' }}>₹4,999</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#3e2723' }}>
                    <i className="fa-solid fa-gem" style={{ color: '#a0e4f1', fontSize: '1.2rem' }}></i>
                    <span>Ultimate Pre-Bridal</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#c19b45' }}>₹12,499</span>
                </div>
              </div>
              
              <Link to="/packages" className="btn" style={{ background: '#4b3832', color: '#ffffff', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', transition: 'all 0.3s' }}>
                Explore All Packages <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
