import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../components/Common/LoginModal';

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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
            Community Platform
          </div>
          <button onClick={() => setIsLoginModalOpen(true)} style={{ backgroundColor: '#0284c7', color: '#fff', padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '128px', paddingBottom: '80px', background: 'linear-gradient(to bottom, #0284c7, #0ea5e9, #a855f7)', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>Making Charitable Giving Simple and Transparent</h1>
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>A simple platform connecting generous donors with verified needy individuals and organizations, making every contribution count.</p>
          <button onClick={() => setIsLoginModalOpen(true)} style={{ backgroundColor: '#fff', color: '#0284c7', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
            Sign In / Register
          </button>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '80px 16px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '64px' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 16px' }}>1</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Create Account</h3>
              <p style={{ color: '#6b7280' }}>Sign up in just a few steps with unified login for donors and needy.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 16px' }}>2</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Browse & Choose</h3>
              <p style={{ color: '#6b7280' }}>Explore verified profiles and choose who to support.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 16px' }}>3</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Make Impact</h3>
              <p style={{ color: '#6b7280' }}>Donate securely and track your contribution directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 16px', backgroundColor: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Ready to Make a Difference?</h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>Join thousands of donors helping verified needy individuals.</p>
          <button onClick={() => setIsLoginModalOpen(true)} style={{ backgroundColor: '#0284c7', color: '#fff', padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '32px', textAlign: 'center', fontSize: '14px' }}>
            <p>&copy; 2024 Community Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
