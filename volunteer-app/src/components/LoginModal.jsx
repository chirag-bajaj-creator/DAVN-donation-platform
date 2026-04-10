import { useEffect } from 'react';
import LoginPage from '../pages/LoginPage';

export default function LoginModal({ isOpen, onClose }) {
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
          padding: '32px',
          animation: 'slideIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
          <button
            onClick={onClose}
            style={{
              color: '#9ca3af',
              fontSize: '24px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        <LoginPage onSuccess={onClose} />
      </div>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(-16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}
