import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="client-topbar">
      <div className="client-topbar-inner">
        <div className="flex justify-between items-center">
          <Link to="/" className="client-brand">
            <span className="client-brand-mark">C</span>
            Community Platform
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/donation">Donate</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
