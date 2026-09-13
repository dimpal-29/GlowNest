import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ServiceDetailCard({ category, image, title, desc, duration, price }) {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const modeParam = mode ? `&mode=${mode}` : '';

  // Generate URL query matching original format: service=Advanced Hair Styling&price=₹899
  const selectUrl = `/booking?service=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}${modeParam}`;

  // Helper to get category text
  const categoryLabels = {
    hair: 'Hair Care',
    skin: 'Skin & Facials',
    nails: 'Nails',
    makeup: 'Makeup',
    spa: 'Spa & Massage',
    bridal: 'Bridal'
  };

  return (
    <div className="service-detail-card" data-category={category}>
      <div className="card-image">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="card-body">
        <span className="card-category">{categoryLabels[category] || category}</span>
        <h3>{title}</h3>
        <p className="card-desc">{desc}</p>
        <div className="card-meta">
          <span className="duration">⏱ {duration}</span>
          <span className="price">{price}</span>
        </div>
        <Link to={selectUrl} className="btn btn-primary book-service-btn">Book Appointment</Link>
      </div>
    </div>
  );
}
