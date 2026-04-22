import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../../components/Common/LoginModal';
import Toast from '../../components/Common/Toast';
import '../../styles/landing.css';

const adminMetrics = [
  { value: '24/7', label: 'platform oversight' },
  { value: '4', label: 'core admin modules' },
  { value: 'Live', label: 'case updates' }
];

const adminModules = [
  {
    title: 'Donation intelligence',
    copy: 'Track contribution flow, donor activity, and category movement from one focused command view.'
  },
  {
    title: 'Volunteer verification',
    copy: 'Review volunteer registrations, approve trusted profiles, and keep field teams accountable.'
  },
  {
    title: 'Needy case control',
    copy: 'Assign verification work, monitor reports, and move cases forward with clear operational context.'
  },
  {
    title: 'User governance',
    copy: 'Protect access with role-aware administration across donors, volunteers, needy users, and admins.'
  }
];

const activityRows = [
  ['Verification report', 'Ready for review', 'High'],
  ['Volunteer approval', 'Pending decision', 'Medium'],
  ['Donation ledger', 'Synced recently', 'Stable']
];

export default function AdminHomePage() {
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(location.pathname === '/login');
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

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLoginModalOpen(true);
    }
  }, [location.pathname]);

  // Show a message if logged in but not as admin
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      setError(`Access Denied: Admin account required. Your role is '${user.role}'`);
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.reload();
      }, 2000);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="landing-page admin-landing">
      <nav className={`landing-nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <span className="landing-brand-mark">A</span>
            Admin Portal
          </div>
          <button className="landing-nav-button" onClick={() => setIsLoginModalOpen(true)}>
            Admin Sign In
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-orb landing-orb-one" />
          <div className="landing-orb landing-orb-two" />

          <div className="landing-shell hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Operations command center</span>
              <h1>Run every donation, volunteer, and verification flow from one calm control room.</h1>
              <p>
                A focused admin landing experience for overseeing cases, reports, approvals, users, and donation activity without visual noise.
              </p>

              <div className="hero-actions">
                <button className="primary-cta" onClick={() => setIsLoginModalOpen(true)}>
                  Enter Admin Panel
                </button>
                <a className="secondary-cta" href="#admin-modules">
                  View Modules
                </a>
              </div>

              <div className="metric-strip">
                {adminMetrics.map((metric) => (
                  <div className="metric-card" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual glass-panel">
              <div className="visual-header">
                <span>Admin Console</span>
                <div className="visual-dots">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="command-score">
                <span>Platform Readiness</span>
                <strong>96%</strong>
              </div>
              <div className="visual-bars">
                <span style={{ '--bar': '88%' }} />
                <span style={{ '--bar': '64%' }} />
                <span style={{ '--bar': '76%' }} />
              </div>
              <div className="activity-list">
                {activityRows.map(([name, status, priority]) => (
                  <div className="activity-row" key={name}>
                    <div>
                      <strong>{name}</strong>
                      <span>{status}</span>
                    </div>
                    <em>{priority}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="admin-modules">
          <div className="landing-shell section-heading">
            <span className="eyebrow">Admin workflows</span>
            <h2>Designed for decisions, not clutter.</h2>
            <p>Each module supports a clear operational task: verify, assign, review, approve, and govern.</p>
          </div>

          <div className="landing-shell module-grid">
            {adminModules.map((module, index) => (
              <article className="glass-panel module-card" key={module.title}>
                <span className="module-index">0{index + 1}</span>
                <h3>{module.title}</h3>
                <p>{module.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section split-section">
          <div className="landing-shell split-grid">
            <div className="glass-panel insight-card">
              <span className="eyebrow">Live review loop</span>
              <h2>Reports, assignments, and role access stay visible.</h2>
              <p>
                The admin experience is positioned around accountability: every approval, rejection, report download, and case assignment has a clear place.
              </p>
            </div>
            <div className="timeline-card">
              {['Volunteer submits report', 'Admin reviews evidence', 'Case status updates', 'Dashboard reflects progress'].map((step) => (
                <div className="timeline-step" key={step}>
                  <span />
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-final">
          <div className="landing-shell glass-panel final-card">
            <h2>Ready to manage the platform with focus?</h2>
            <p>Sign in with an admin account to access the protected panel.</p>
            <button className="primary-cta" onClick={() => setIsLoginModalOpen(true)}>
              Admin Sign In
            </button>
          </div>
        </section>
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      {error && <Toast message={error} type="error" />}
    </div>
  );
}
