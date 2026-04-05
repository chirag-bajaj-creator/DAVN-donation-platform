import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSuccess = () => {
    setIsSuccess(true);
    toast.success('Account created successfully!');
  };

  // Handle countdown and redirect
  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-2xl font-bold text-primary-600">Hravinder</div>
          <p className="text-gray-600 text-sm">Donation Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          {isSuccess ? (
            // Success Message
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Created!</h2>
              <p className="text-gray-600 mb-4">Your account has been successfully created.</p>
              <p className="text-gray-600 mb-6">
                Redirecting to login in <span className="font-bold text-primary-600">{countdown}</span> seconds...
              </p>
              <Link
                to="/login"
                className="inline-block bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Go to Login Now
              </Link>
            </div>
          ) : (
            // Registration Form
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-600 mt-2">Join Hravinder to start making a difference</p>
              </div>

              <RegisterForm onSuccess={handleSuccess} />

              <div className="mt-6 text-center text-gray-600">
                <span>Already have an account? </span>
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Sign in here
                </Link>
              </div>
            </>
          )}
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
