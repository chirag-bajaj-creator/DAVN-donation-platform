import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-gray-400 mt-12" style={{ backgroundColor: '#111827' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Community Platform</h3>
            <p className="text-gray-400">Supporting charitable giving and helping those in need.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link to="/donation" className="hover:text-white">Donate</Link></li>
              <li><Link to="/needy/individual" className="hover:text-white">Get Help</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8" style={{ borderColor: '#374151' }}>
          <p className="text-center text-gray-400">
            &copy; {currentYear} Community Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
