import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="client-footer mt-12">
      <div className="client-panel client-panel-soft px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Community Platform</h3>
            <p className="client-muted">Supporting charitable giving and helping those in need.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 client-muted">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/donation">Donate</Link></li>
              <li><Link to="/needy/individual">Get Help</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4 text-white">Support</h4>
            <ul className="space-y-2 client-muted">
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4 text-white">Follow Us</h4>
            <ul className="space-y-2 client-muted">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 client-shell-divider">
          <p className="text-center client-muted">
            &copy; {currentYear} Community Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
