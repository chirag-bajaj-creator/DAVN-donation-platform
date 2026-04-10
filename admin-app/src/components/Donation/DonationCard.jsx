import React from 'react';
import { Link } from 'react-router-dom';

export default function DonationCard({ type, title, description, icon, link }) {
  return (
    <Link to={link} className="block">
      <div className="bg-white rounded-lg shadow-medium hover:shadow-large transition-shadow duration-300 p-6 h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <button className="text-primary-600 font-semibold hover:text-primary-700">
          Learn More →
        </button>
      </div>
    </Link>
  );
}
