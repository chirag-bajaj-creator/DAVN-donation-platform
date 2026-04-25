import React from 'react';
import { Link } from 'react-router-dom';

export default function DonationCard({ title, description, icon, link, meta }) {
  return (
    <Link to={link} className="donation-card-link">
      <article className="donation-type-card">
        <div className="donation-type-card__top">
          <span className="donation-type-card__icon">
            {icon}
          </span>
          {meta ? <span className="donation-type-card__meta">{meta}</span> : null}
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="donation-type-card__action">
          Start aid form
          <span aria-hidden="true">-&gt;</span>
        </span>
      </article>
    </Link>
  );
}
