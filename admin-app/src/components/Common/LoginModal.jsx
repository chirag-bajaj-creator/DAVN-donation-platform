import { useEffect, useState } from 'react';
import LoginForm from '../Auth/LoginForm';
import RegisterForm from '../Auth/RegisterForm';

export default function LoginModal({ isOpen, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsRegistering(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="auth-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div className="auth-modal-glow" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="auth-modal-close"
          >
            &times;
          </button>

          <div className="auth-modal-header-content">
            <div className="auth-modal-badge">
              Admin Portal
            </div>
            <h2 className="auth-modal-title">
              {isRegistering ? 'Create your admin account' : 'Sign in to the admin panel'}
            </h2>
            <p className="auth-modal-subtitle">
              {isRegistering
                ? 'Register with your details and admin secret to access the control panel.'
                : 'Use your admin credentials to manage users, volunteers, donations, and reports.'}
            </p>
          </div>
        </div>

        <div className="auth-modal-body">
          {isRegistering ? (
            <>
              <RegisterForm onSuccess={onClose} />
              <p className="auth-modal-switch-text">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="auth-modal-switch-button"
                >
                  Sign in here
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onSuccess={onClose} />
              <p className="auth-modal-switch-text">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="auth-modal-switch-button"
                >
                  Register here
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
