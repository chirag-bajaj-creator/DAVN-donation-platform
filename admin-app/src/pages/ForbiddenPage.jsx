import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function ForbiddenPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to={isAuthenticated ? '/panel' : '/'} className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Hravinder
          </Link>
          <p className="text-gray-600 text-sm">Donation Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          {/* 403 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this resource. Your account role may not have the required access level.
          </p>

          {/* Action Button */}
          <div className="flex gap-4 justify-center">
            <Link
              to="/panel"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
              </svg>
              Go to Panel
            </Link>
          </div>

          {/* Help Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              If you believe this is an error, please{' '}
              <a href="mailto:support@hravinder.com" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-600">
          <span>© 2026 Hravinder. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
