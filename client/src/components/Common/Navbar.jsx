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
      // Use replace to prevent back button returning to dashboard
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigate even if logout fails
      navigate('/', { replace: true });
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    const baseClass =
      'px-3 py-2 rounded-md text-sm font-medium transition-colors';
    const activeClass = isActive(path)
      ? 'bg-primary-700 text-white'
      : 'text-gray-100 hover:bg-primary-700 hover:text-white';
    return `${baseClass} ${activeClass}`;
  };

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center space-x-2 text-2xl font-bold text-white"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Community Platform</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/donation" className={navLinkClass('/donation')}>
                Donate
              </Link>
              <Link to="/needy" className={navLinkClass('/needy')}>
                Need Help?
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

          {/* Right Section - User Menu or Auth Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Desktop User Info & Logout */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-200 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 text-sm font-medium">
                  <p>{user.name}</p>
                  <p className="text-xs text-gray-200 capitalize">{user.role}</p>
                </div>
                <Link
                  to="/dashboard"
                  className={`block ${navLinkClass('/dashboard')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/donation"
                  className={`block ${navLinkClass('/donation')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donate
                </Link>
                <Link
                  to="/needy"
                  className={`block ${navLinkClass('/needy')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Need Help?
                </Link>

                {user?.role === 'needy' && (
                  <Link
                    to="/needy/individual"
                    className={`block ${navLinkClass('/needy/individual')}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/verification"
                    className={`block ${navLinkClass('/admin/verification')}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-primary-700 hover:bg-primary-800 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}
