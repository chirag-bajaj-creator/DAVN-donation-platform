import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import '../styles/landing.css';

const volunteerStats = [
  { value: '3-step', label: 'field verification flow' },
  { value: 'Live', label: 'task assignments' },
  { value: 'Clear', label: 'report submission' }
];

const volunteerSteps = [
  {
    title: 'Register your profile',
    copy: 'Choose your volunteer type, share the right details, and enter the approval queue.'
  },
  {
    title: 'Accept assigned cases',
    copy: 'See verification work clearly, then accept or reject based on your availability.'
  },
  {
    title: 'Submit field reports',
    copy: 'Send structured reports that help admins approve genuine needy cases with confidence.'
  }
];

const taskCards = [
  ['Individual verification', '2.4 km away', 'Ready'],
  ['Organization visit', 'Assigned today', 'New'],
  ['Report follow-up', 'Evidence needed', 'Open']
];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

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
    <div className="landing-page volunteer-landing">
      <nav className={`landing-nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <span className="landing-brand-mark">V</span>
            Volunteer Network
          </div>
          <button className="landing-nav-button" onClick={() => openAuth('login')}>
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
              <span className="eyebrow">Field verification network</span>
              <h1>Turn local visits into trusted reports for real community support.</h1>
              <p>
                A bold volunteer portal for receiving assignments, verifying needy profiles, and submitting reports that make donations safer and more transparent.
              </p>

              <div className="hero-actions">
                <button className="primary-cta" onClick={() => openAuth('register')}>
                  Become a Volunteer
                </button>
                <button className="secondary-cta" onClick={() => openAuth('login')}>
                  Volunteer Sign In
                </button>
              </div>

              <div className="metric-strip">
                {volunteerStats.map((stat) => (
                  <div className="metric-card" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual glass-panel field-board">
              <div className="visual-header">
                <span>Today&apos;s Field Board</span>
                <div className="pulse-dot" />
              </div>
              <div className="map-card">
                <span className="map-pin pin-one" />
                <span className="map-pin pin-two" />
                <span className="map-pin pin-three" />
              </div>
              <div className="task-list">
                {taskCards.map(([name, detail, status]) => (
                  <div className="task-row" key={name}>
                    <div>
                      <strong>{name}</strong>
                      <span>{detail}</span>
                    </div>
                    <em>{status}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="volunteer-flow">
          <div className="landing-shell section-heading">
            <span className="eyebrow">How it works</span>
            <h2>Simple enough for the field. Structured enough for admins.</h2>
            <p>Every volunteer action supports a clean path from registration to verified evidence.</p>
          </div>

          <div className="landing-shell step-grid">
            {volunteerSteps.map((step, index) => (
              <article className="glass-panel step-card" key={step.title}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section split-section">
          <div className="landing-shell split-grid">
            <div className="glass-panel insight-card">
              <span className="eyebrow">Report clarity</span>
              <h2>Capture the visit, submit the facts, close the loop.</h2>
              <p>
                Volunteers help the platform separate genuine needs from incomplete claims by submitting consistent field reports.
              </p>
            </div>
            <div className="report-preview glass-panel">
              <div>
                <span>Report status</span>
                <strong>Draft ready</strong>
              </div>
              <div>
                <span>Evidence</span>
                <strong>Photos + notes</strong>
              </div>
              <div>
                <span>Admin review</span>
                <strong>Next step</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-final">
          <div className="landing-shell glass-panel final-card">
            <h2>Ready to verify what matters?</h2>
            <p>Register as a volunteer or sign in to continue your assigned work.</p>
            <div className="hero-actions final-actions">
              <button className="primary-cta" onClick={() => openAuth('register')}>
                Register Now
              </button>
              <button className="secondary-cta" onClick={() => openAuth('login')}>
                Sign In
              </button>
            </div>
          </div>
        </section>
      </main>

      <LoginModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />

      <footer className="landing-footer">
        <p>&copy; 2024 Volunteer Network. All rights reserved.</p>
      </footer>
    </div>
  );
}
