import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/', { replace: true });
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `client-button px-4 py-2 text-sm ${
      isActive(path) ? 'client-button' : 'client-button-secondary'
    }`;

  return (
    <nav className="client-topbar">
      <div className="client-topbar-inner">
        <div className="flex justify-between items-center gap-4 w-full">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="client-brand">
            <span className="client-brand-mark">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span>Community Platform</span>
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/donation" className={navLinkClass('/donation')}>
                Donate
              </Link>
              <Link to="/needy" className={navLinkClass('/needy')}>
                Need Help?
              </Link>
              <Link to="/tracking" className={navLinkClass('/tracking')}>
                Track Aid
              </Link>
              {user?.role === 'needy' && (
                <Link to="/needy/individual" className={navLinkClass('/needy/individual')}>
                  My Profile
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/verification" className={navLinkClass('/admin/verification')}>
                  Admin Panel
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-white/75 capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="client-button client-button-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden client-button client-button-secondary px-3 py-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>
        </div>

        {isMenuOpen && isAuthenticated && user && (
          <div className="md:hidden mt-4 space-y-3">
            <div className="client-panel client-card-tight">
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/75 capitalize">{user.role}</p>
            </div>
            <Link to="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/donation" className={navLinkClass('/donation')} onClick={() => setIsMenuOpen(false)}>
              Donate
            </Link>
            <Link to="/needy" className={navLinkClass('/needy')} onClick={() => setIsMenuOpen(false)}>
              Need Help?
            </Link>
            <Link to="/tracking" className={navLinkClass('/tracking')} onClick={() => setIsMenuOpen(false)}>
              Track Aid
            </Link>
            {user?.role === 'needy' && (
              <Link
                to="/needy/individual"
                className={navLinkClass('/needy/individual')}
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin/verification"
                className={navLinkClass('/admin/verification')}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className="client-button client-button-secondary w-full">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
