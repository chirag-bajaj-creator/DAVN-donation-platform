import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading && user?.role === 'volunteer') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, user]);

  useEffect(() => {
    if (isAuthenticated && !loading && user && user.role !== 'volunteer') {
      logout();
    }
  }, [isAuthenticated, loading, logout, user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            Volunteer Network
          </div>
          <button onClick={() => setIsLoginOpen(true)} style={{ backgroundColor: '#0284c7', color: '#fff', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '128px', paddingBottom: '80px', background: 'linear-gradient(to bottom, #0284c7, #0ea5e9, #a855f7)', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>Make a Real Impact as a Volunteer</h1>
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>Help verify needy individuals and organizations, and be part of making charitable giving transparent and impactful.</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsLoginOpen(true)} style={{ backgroundColor: '#fff', color: '#0284c7', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
              Sign In
            </button>
            <button onClick={() => navigate('/register-type')} style={{ backgroundColor: 'transparent', color: '#fff', padding: '12px 32px', borderRadius: '8px', border: '2px solid #fff', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
              Register
            </button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '80px 16px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '64px' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 16px' }}>1</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Register</h3>
              <p style={{ color: '#6b7280' }}>Create a volunteer account and provide your details.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 16px' }}>2</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Get Tasks</h3>
              <p style={{ color: '#6b7280' }}>Receive verification tasks and assignments.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 16px' }}>3</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Submit Reports</h3>
              <p style={{ color: '#6b7280' }}>Submit verification reports and help the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 16px', backgroundColor: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Ready to Help Others?</h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>Start your volunteer journey and make a real impact today.</p>
          <button onClick={() => navigate('/register-type')} style={{ backgroundColor: '#0284c7', color: '#fff', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
            Register Now
          </button>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '32px', textAlign: 'center', fontSize: '14px' }}>
            <p>&copy; 2024 Volunteer Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
