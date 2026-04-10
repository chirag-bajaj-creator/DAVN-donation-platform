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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 40px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '360px',
          overflow: 'hidden',
          animation: 'slideIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div style={{
          background: 'linear-gradient(to bottom, #0284c7 0%, #0ea5e9 50%, #a855f7 100%)',
          color: '#fff',
          padding: '24px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '8px',
              color: '#fff',
              fontSize: '28px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          >
            ×
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>
            {isRegistering ? 'Join our community' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form Content */}
        <div style={{ padding: '24px' }}>
          {isRegistering ? (
            <>
              <RegisterForm onSuccess={onClose} />
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegistering(false)}
                  style={{
                    color: '#0284c7',
                    fontWeight: '600',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 'inherit'
                  }}
                >
                  Login here
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onSuccess={onClose} />
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsRegistering(true)}
                  style={{
                    color: '#0284c7',
                    fontWeight: '600',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 'inherit'
                  }}
                >
                  Register here
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}