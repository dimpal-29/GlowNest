import React from 'react';

export default function ServiceCard({ image, title, desc, price }) {
  return (
    <div className="service-card glass-card reveal">
      <div className="service-image">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="service-card-body">
        <h3>{title}</h3>
        <p>{desc}</p>
        <span className="price">{price}</span>
      </div>
    </div>
  );
}
