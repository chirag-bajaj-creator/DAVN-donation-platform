import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '../../components/Common/LoginModal';
import '../../styles/landing.css';

const clientStats = [
  { value: 'Verified', label: 'needy profiles' },
  { value: 'Secure', label: 'donation flow' },
  { value: 'Direct', label: 'community support' }
];

const pathways = [
  {
    title: 'For donors',
    copy: 'Browse verified people and organizations, choose a cause, and contribute through a guided payment flow.'
  },
  {
    title: 'For needy users',
    copy: 'Create a profile, submit required details, and move through volunteer-backed verification.'
  },
  {
    title: 'For transparency',
    copy: 'Verification reports and admin oversight help keep support focused on genuine needs.'
  }
];

const givingSteps = [
  'Create or sign in to your account',
  'Choose donation or needy registration',
  'Follow verified profiles and payment steps',
  'Track impact through your dashboard'
];

export default function HomePage() {
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(location.pathname === '/login');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLoginModalOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="landing-page client-landing">
      <nav className={`landing-nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <span className="landing-brand-mark">C</span>
            Community Platform
          </div>
          <button className="landing-nav-button" onClick={() => setIsLoginModalOpen(true)}>
            Sign In
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-orb landing-orb-one" />
          <div className="landing-orb landing-orb-two" />

          <div className="landing-shell hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Transparent giving platform</span>
              <h1>Give with confidence to people and organizations that have been verified.</h1>
              <p>
                A modern community platform connecting donors with verified needy individuals and organizations through clear registration, review, and donation flows.
              </p>

              <div className="hero-actions">
                <button className="primary-cta" onClick={() => setIsLoginModalOpen(true)}>
                  Sign In / Register
                </button>
                <button className="secondary-cta" onClick={() => navigate('/dashboard')}>
                  Explore Dashboard
                </button>
              </div>

              <div className="metric-strip">
                {clientStats.map((stat) => (
                  <div className="metric-card" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual glass-panel donation-card">
              <div className="visual-header">
                <span>Impact Preview</span>
                <strong>Rs</strong>
              </div>
              <div className="cause-card">
                <span>Verified profile</span>
                <h3>Family support request</h3>
                <p>Documents reviewed, field verification pending admin decision.</p>
              </div>
              <div className="donation-meter">
                <div>
                  <span>Support progress</span>
                  <strong>68%</strong>
                </div>
                <i />
              </div>
              <div className="quick-actions">
                <span>Donate</span>
                <span>Register need</span>
                <span>Track</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="pathways">
          <div className="landing-shell section-heading">
            <span className="eyebrow">One platform, two journeys</span>
            <h2>Built for people who want to help and people who need help.</h2>
            <p>Clear pathways reduce confusion while verification keeps the platform accountable.</p>
          </div>

          <div className="landing-shell pathway-grid">
            {pathways.map((pathway) => (
              <article className="glass-panel pathway-card" key={pathway.title}>
                <h3>{pathway.title}</h3>
                <p>{pathway.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section split-section">
          <div className="landing-shell split-grid">
            <div className="glass-panel insight-card">
              <span className="eyebrow">Giving journey</span>
              <h2>Every action has a clear next step.</h2>
              <p>
                Donors, needy users, volunteers, and admins each have a defined role, so support can move from request to verification to contribution.
              </p>
            </div>
            <div className="journey-list">
              {givingSteps.map((step, index) => (
                <div className="journey-step" key={step}>
                  <span>0{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-final">
          <div className="landing-shell glass-panel final-card">
            <h2>Start with a verified giving experience.</h2>
            <p>Sign in or create an account to donate, register a need, or view your dashboard.</p>
            <button className="primary-cta" onClick={() => setIsLoginModalOpen(true)}>
              Get Started Today
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2024 Community Platform. All rights reserved.</p>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
