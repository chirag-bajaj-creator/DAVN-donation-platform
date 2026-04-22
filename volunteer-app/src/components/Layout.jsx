import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Layout({ children }) {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logout successful!');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
      toast.success('Logout successful!');
    }
  };

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="volunteer-app-shell">
      <nav className="volunteer-nav">
        <div className="volunteer-shell">
          <div className="volunteer-nav-inner">
            <button type="button" className="volunteer-brand volunteer-nav-button" onClick={() => navigate('/dashboard')}>
              <span className="volunteer-brand-mark">V</span>
              Volunteer Network
            </button>

            <div className="volunteer-nav-actions">
              <div className="volunteer-nav-links">
                <button type="button" className="volunteer-nav-link" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </button>
                <button type="button" className="volunteer-nav-link" onClick={() => navigate('/my-tasks')}>
                  My Tasks
                </button>
              </div>

              <span className="volunteer-chip">Hi, <strong>{user?.name || 'Volunteer'}</strong></span>
              <button
                type="button"
                className="volunteer-chip volunteer-menu-toggle"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                Menu
              </button>
              <button type="button" className="volunteer-nav-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className={`volunteer-menu-panel ${mobileMenuOpen ? 'is-open' : ''}`}>
            <div className="volunteer-menu-panel-inner">
              <button type="button" className="volunteer-nav-link" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button type="button" className="volunteer-nav-link" onClick={() => navigate('/my-tasks')}>
                My Tasks
              </button>
              <button type="button" className="volunteer-nav-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="volunteer-main">
        <div className="volunteer-shell">
          {children}
        </div>
      </main>

      <footer className="volunteer-footer">
        <div className="volunteer-shell">
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '24px' }}>
            <p>&copy; 2026 Volunteer Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
