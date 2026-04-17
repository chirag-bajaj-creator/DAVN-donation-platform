import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Community Platform
          </Link>
          <p className="text-gray-600 text-sm">Donation Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page may have been removed or the URL might be incorrect.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isAuthenticated ? 'Back to Dashboard' : 'Back to Login'}
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Create Account
              </Link>
            )}
          </div>

          {/* Help Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Need help?{' '}
              <a href="mailto:support@example.com" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-600">
          <span>© 2026 Community Platform. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
