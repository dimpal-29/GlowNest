import React from 'react';
import { Link } from 'react-router-dom';

export default function PackageCard({ 
  title, 
  subtitle, 
  originalPrice, 
  currentPrice, 
  savings, 
  features, 
  isPopular = false 
}) {
  const selectUrl = `/booking?package=${encodeURIComponent(title)}&price=${currentPrice}`;

  return (
    <div className={`package-card ${isPopular ? 'popular' : ''}`}>
      {isPopular && <div className="popular-badge">⭐ Most Popular</div>}
      <div className="package-header">
        <h3>{title}</h3>
        <p className="package-subtitle">{subtitle}</p>
      </div>
      <div className="package-price">
        <div className="original-price">₹{originalPrice.toLocaleString('en-IN')}</div>
        <div className="current-price">₹{currentPrice.toLocaleString('en-IN')}<span>/session</span></div>
        <div className="savings">Save {savings}%</div>
      </div>
      <div className="package-features">
        <ul>
          {features.map((feature, idx) => (
            <li key={idx} className={feature.enabled ? '' : 'disabled'}>
              <span className={feature.enabled ? 'check' : 'cross'}>
                <i className={`fa-solid ${feature.enabled ? 'fa-check' : 'fa-xmark'}`}></i>
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="package-footer">
        <Link 
          to={selectUrl} 
          className={`btn ${isPopular ? 'btn-primary' : 'btn-secondary'}`}
        >
          Select Package
        </Link>
      </div>
    </div>
  );
}
