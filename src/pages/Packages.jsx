import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../css/services.css';
import '../css/packages.css';

const COMPARISON_DATA = [
  { feature: 'Facial Treatment', values: ['Classic Cleansing', '24K Gold', 'Anti-Aging', '3 Custom Sessions'] },
  { feature: 'Hair Services', values: ['Cut + Blow Dry', 'Cut + Styling', 'Cut + Color', 'Hair Botox / Keratin'] },
  { feature: 'Nail Care', values: ['Basic Manicure', 'Spa Mani-Pedi', 'Gel Mani-Pedi', 'Acrylic Extensions'] },
  { feature: 'Hair Spa', values: ['✗', 'Moroccan Spa', 'Spa + Frizz Control', 'Scalp Detox Course'] },
  { feature: 'Body Massage', values: ['✗', '✗', '60m Swedish', '90m Hot Stone'] },
  { feature: 'Body Grooming', values: ['✗', '✗', '✗', 'Full Body Polish'] },
  { feature: 'Duration', values: ['~2 hours', '~3.5 hours', '~5 hours', 'Multiple Sessions'] },
  { feature: 'Price', values: ['₹1,499', '₹2,999', '₹4,999', '₹12,499'], bold: true },
];

export default function Packages() {
  const navigate = useNavigate();
  const [packagesData, setPackagesData] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await api.get('/packages');
        setPackagesData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPackages();
  }, []);

  const handleSelectPackage = async (pkg) => {
    const isLoggedIn = localStorage.getItem('glowNest_isLoggedIn') === 'true';
    if (!isLoggedIn) {
      const confirmed = await window.showAppConfirm('Please login first, then book packages');
      if (confirmed) {
        localStorage.setItem('glowNest_redirectAfterLogin', '/booking');
        navigate('/login');
      }
      return;
    }
    navigate(`/booking?package=${encodeURIComponent(pkg.name)}&price=${pkg.numericPrice}`);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80') center/cover", position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(62, 39, 35, 0.75)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1>Curated Beauty Packages</h1>
          <p>Save more with our expertly bundled packages designed for complete beauty transformations.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span><i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', margin: '0 8px' }}></i></span>
            <span>Packages</span>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="packages-section">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Perfect Package</h2>
            <p>From essential grooming to complete luxury makeovers — we have a package for every occasion.</p>
          </div>

          <div className="packages-grid">
            {packagesData.map((pkg) => (
              <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                {pkg.popular && <div className="popular-badge">⭐ Most Popular</div>}
                <div className="package-header">
                  <h3>{pkg.name}</h3>
                  <p className="package-subtitle">{pkg.subtitle}</p>
                </div>
                <div className="package-price">
                  <div className="original-price">{pkg.originalPrice}</div>
                  <div className="current-price">{pkg.currentPrice}<span>{pkg.priceSuffix}</span></div>
                  <div className="savings">{pkg.savings}</div>
                </div>
                <div className="package-features">
                  <ul>
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className={f.included ? '' : 'disabled'}>
                        <span className={f.included ? 'check' : 'cross'}>
                          <i className={`fa-solid ${f.included ? 'fa-check' : 'fa-xmark'}`}></i>
                        </span>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="package-footer">
                  <button
                    className={`btn ${pkg.popular ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSelectPackage(pkg)}
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison-section">
        <div className="container">
          <div className="section-header">
            <h2>Compare Packages</h2>
            <p>A detailed comparison to help you choose the perfect beauty regimen.</p>
          </div>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Essential</th>
                  <th>Signature</th>
                  <th>Premium</th>
                  <th>Pre-Bridal</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.bold ? <strong>{row.feature}</strong> : row.feature}</td>
                    {row.values.map((val, i) => (
                      <td key={i}>
                        {val === '✗' ? (
                          <span className="cross-mark">✗</span>
                        ) : row.bold ? (
                          <strong>{val}</strong>
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
