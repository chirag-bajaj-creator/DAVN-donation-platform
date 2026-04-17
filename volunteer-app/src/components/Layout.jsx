import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Layout({ children }) {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logout successful!');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
      toast.success('Logout successful!');
    }
  };

  // For unauthenticated pages (login, register), don't show nav/footer
  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: 0, cursor: 'pointer' }}>Volunteer Portal</h1>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '500', opacity: 0.9, transition: 'all 0.2s', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => (e.target.style.opacity = '1')}
              onMouseLeave={(e) => (e.target.style.opacity = '0.9')}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/my-tasks')}
              style={{ background: 'none', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '500', opacity: 0.9, transition: 'all 0.2s', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => (e.target.style.opacity = '1')}
              onMouseLeave={(e) => (e.target.style.opacity = '0.9')}
            >
              My Tasks
            </button>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500', opacity: 0.9 }}>Hi, {user?.name || 'Volunteer'}</span>
            <button
              onClick={handleLogout}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ padding: '32px 16px', minHeight: 'calc(100vh - 200px)', background: 'linear-gradient(to bottom, #f0f9ff 0%, #f9fafb 100%)', flex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '32px', textAlign: 'center', fontSize: '14px' }}>
            <p>&copy; 2026 Volunteer Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
