import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../../components/Common/LoginModal';
import Toast from '../../components/Common/Toast';

export default function AdminHomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show a message if logged in but not as admin
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'admin') {
      navigate('/panel', { replace: true });
    } else if (isAuthenticated && user && user.role !== 'admin') {
      setError(`Access Denied: Admin account required. Your role is '${user.role}'`);
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.reload();
      }, 2000);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 40,
        transition: 'all 0.3s',
        backgroundColor: isScrolled ? '#fff' : 'transparent',
        boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        borderBottom: isScrolled ? '1px solid #e5e7eb' : 'none'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', backgroundImage: 'linear-gradient(135deg, #0ea5e9, #a855f7)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Portal
          </div>
          <button onClick={() => setIsLoginModalOpen(true)} style={{ backgroundColor: '#0284c7', color: '#fff', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>
            Admin Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '128px', paddingBottom: '80px', background: 'linear-gradient(to bottom, #0284c7, #0ea5e9, #a855f7)', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>Admin Control Panel</h1>
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>Manage donations, verify volunteers, and oversee all platform activities</p>
          <button onClick={() => setIsLoginModalOpen(true)} style={{ backgroundColor: '#fff', color: '#0284c7', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
            Admin Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', padding: '80px 16px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '48px', textAlign: 'center' }}>Admin Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          {[
            { title: 'Dashboard', desc: 'Monitor platform statistics and metrics' },
            { title: 'Donations', desc: 'Track and manage all donations' },
            { title: 'Volunteers', desc: 'Verify and manage volunteer registrations' },
            { title: 'Needy Verification', desc: 'Review and assign verification tasks' },
            { title: 'User Management', desc: 'Control user roles and access' }
          ].map((feature, i) => (
            <div key={i} style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: '#666' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Error Toast */}
      {error && <Toast message={error} type="error" />}
    </div>
  );
}
