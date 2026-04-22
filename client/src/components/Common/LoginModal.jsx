import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LoginForm from '../Auth/LoginForm';
import RegisterForm from '../Auth/RegisterForm';

export default function LoginModal({ isOpen, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="client-modal-shell">
      <div className="client-modal-backdrop" onClick={onClose}>
        <div
          className={`client-modal-card ${isRegistering ? 'is-registering' : 'is-login'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="client-modal-header">
            <button type="button" onClick={onClose} className="client-modal-close" aria-label="Close auth modal">
              &times;
            </button>
            <h2 className="text-xl font-bold mb-1 text-white">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-white/80">
              {isRegistering ? 'Join our community' : 'Sign in to your account'}
            </p>
          </div>

          <div className="client-modal-body">
            {isRegistering ? (
              <>
                <RegisterForm onSuccess={onClose} />
                <p className="mt-4 text-center text-sm client-muted">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsRegistering(false)} className="client-button-ghost p-0">
                    Login here
                  </button>
                </p>
              </>
            ) : (
              <>
                <LoginForm onSuccess={onClose} />
                <p className="mt-4 text-center text-sm client-muted">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setIsRegistering(true)} className="client-button-ghost p-0">
                    Register here
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
