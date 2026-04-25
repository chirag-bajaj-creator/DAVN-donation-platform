import { useEffect, useState } from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterTypePage from '../pages/RegisterTypePage';
import SpecializedRegisterPage from '../pages/SpecializedRegisterPage';
import UnspecializedRegisterPage from '../pages/UnspecializedRegisterPage';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (mode === 'register') {
      return (
        <RegisterTypePage
          embedded
          onSelectSpecialized={() => setMode('specialized')}
          onSelectGeneral={() => setMode('general')}
          onLogin={() => setMode('login')}
        />
      );
    }

    if (mode === 'specialized') {
      return (
        <SpecializedRegisterPage
          embedded
          onSuccess={onClose}
          onLogin={() => setMode('login')}
        />
      );
    }

    if (mode === 'general') {
      return (
        <UnspecializedRegisterPage
          embedded
          onSuccess={onClose}
          onLogin={() => setMode('login')}
        />
      );
    }

    return (
      <LoginPage
        embedded
        onSuccess={onLoginSuccess || onClose}
        onRegister={() => setMode('register')}
      />
    );
  };

  return (
    <div className="volunteer-auth-backdrop" onClick={onClose}>
      <div className={`volunteer-auth-card ${mode === 'login' ? '' : 'is-compact'}`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="volunteer-modal-close"
          onClick={onClose}
          aria-label="Close authentication popup"
        >
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
}
