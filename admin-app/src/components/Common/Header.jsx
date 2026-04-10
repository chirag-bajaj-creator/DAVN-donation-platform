import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Hravinder
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link></li>
              <li><Link to="/donation" className="text-gray-600 hover:text-primary-600">Donate</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
