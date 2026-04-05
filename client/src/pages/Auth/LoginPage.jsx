import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-2xl font-bold text-primary-600">Hravinder</div>
          <p className="text-gray-600 text-sm">Donation Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your Hravinder account</p>
          </div>

          <LoginForm />

          <div className="mt-6 space-y-4">
            <div className="text-center text-gray-600">
              <span>Don't have an account? </span>
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Register here
              </Link>
            </div>

            <div className="text-center">
              <Link to="/password-reset" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                Forgot your password?
              </Link>
            </div>
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
