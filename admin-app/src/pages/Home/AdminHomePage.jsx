import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../../components/Common/LoginModal';
import Toast from '../../components/Common/Toast';
import '../../styles/landing.css';

const modules = [
  ['Donations', 'Review submitted aid and routing status.'],
  ['Volunteers', 'Approve field teams and monitor activity.'],
  ['Needy Cases', 'Assign verification and check reports.'],
  ['Reports', 'Download proof and close the loop.'],
];

const flow = ['Donation Submitted', 'Volunteer Assigned', 'Field Report', 'Admin Approved', 'Impact Closed'];

const adminUseCases = [
  ['Surplus food triage', 'Review freshness, pickup windows, serving count, and proof before routing.'],
  ['Volunteer approval', 'Approve field volunteers with clear status and accountability records.'],
  ['Needy verification', 'Assign visits, compare reports, and decide verified support faster.'],
  ['Impact closure', 'Track proof, reports, and final case status from one operational path.'],
];

const adminTrust = [
  ['Case visibility', 'Every active case has owner, status, and next action.'],
  ['Proof-first review', 'Reports and documents stay connected to each decision.'],
  ['Role control', 'Only admin accounts can enter protected operational areas.'],
];

export default function AdminHomePage() {
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(location.pathname === '/login');
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/login') setIsLoginModalOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      setError(`Access Denied: Admin account required. Your role is '${user.role}'`);
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.reload();
      }, 2000);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="landing-page admin-landing calm-landing">
      <nav className={`landing-nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-brand"><span className="landing-brand-mark">A</span>Admin Portal</div>
          <div className="landing-nav-links"><a href="#modules">Modules</a><a href="#trust">Trust</a><a href="#track">Tracking</a></div>
          <button className="landing-nav-button" type="button" onClick={() => setIsLoginModalOpen(true)}>Admin Sign In</button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-shell hero-grid">
            <div className="hero-copy">
              <h1>Manage every donation with calm, clear <span>control.</span></h1>
              <p>A minimal admin landing page for approvals, volunteer assignment, proof review, and transparent case progress.</p>
              <div className="hero-actions">
                <button className="primary-cta" type="button" onClick={() => setIsLoginModalOpen(true)}>Enter Admin Panel</button>
                <a className="secondary-cta" href="#modules">View Modules</a>
              </div>
            </div>
            <div className="calm-hero-art admin-art">
              <div className="aid-illustration">
                <div className="admin-screen"><strong>96%</strong><span>Platform readiness</span></div>
                <div className="admin-pill">Reports ready</div>
                <div className="admin-pill second">Cases synced</div>
              </div>
              <div className="flow-card">{['Donor', 'Volunteer', 'Admin'].map((item) => <div className="flow-step" key={item}><span>{item[0]}</span><strong>{item}</strong></div>)}</div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="modules">
          <div className="landing-shell section-heading"><h2>Admin Modules</h2><p>Everything stays readable, accountable, and easy to act on.</p></div>
          <div className="landing-shell calm-card-grid">
            {modules.map(([title, copy]) => <article className="calm-card category-card" key={title}><span className="calm-icon">{title[0]}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="landing-shell calm-impact-strip">
          {['24/7 Oversight', 'Live Case Updates', '4 Core Modules', 'PDF Proof Reports'].map((stat) => <div key={stat}><strong>{stat.split(' ')[0]}</strong><span>{stat.replace(stat.split(' ')[0], '')}</span></div>)}
        </section>

        <section className="landing-section" id="trust">
          <div className="landing-shell section-heading"><h2>Trust & Safety</h2></div>
          <div className="landing-shell calm-step-row">
            {adminTrust.map(([title, copy], index) => <article className="calm-card how-card" key={title}><span className="calm-number">{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>Real Admin Use Cases</h2><p>Built around the operational work that admins actually repeat every day.</p></div>
          <div className="landing-shell calm-use-grid">
            {adminUseCases.map(([title, copy]) => <article className="calm-use-card" key={title}><span /> <div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className="landing-section calm-band-section">
          <div className="landing-shell calm-split">
            <div>
              <span className="calm-kicker">Decision clarity</span>
              <h2>Move from pending to verified without losing context.</h2>
              <p>Admin teams can check volunteer readiness, needy case evidence, donation details, and report proof before closing the loop.</p>
            </div>
            <div className="calm-review-card">
              <div><strong>18</strong><span>Reports waiting</span></div>
              <div><strong>7</strong><span>Assignments live</span></div>
              <div><strong>4</strong><span>Urgent cases</span></div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="track">
          <div className="landing-shell section-heading"><h2>Operational Timeline</h2></div>
          <div className="landing-shell calm-timeline">{flow.map((item) => <div className="timeline-node" key={item}><span /><strong>{item}</strong></div>)}</div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>What Admins Can Monitor</h2></div>
          <div className="landing-shell calm-testimonial-grid">
            {['Donations by status', 'Volunteer approval queue', 'Needy verification reports'].map((item) => <article className="calm-quote-card" key={item}><strong>{item}</strong><p>Clear cards and tables help the admin team scan, compare, and act quickly.</p></article>)}
          </div>
        </section>

        <section className="landing-shell calm-final">
          <h2>Run the platform with focus.</h2>
          <button className="primary-cta" type="button" onClick={() => setIsLoginModalOpen(true)}>Admin Sign In</button>
        </section>
      </main>

      <footer className="calm-footer">
        <div className="landing-shell calm-footer-grid">
          <div><strong>Admin Portal</strong><p>Operational control for verified community aid.</p></div>
          <div><span>Review</span><a href="#modules">Modules</a><a href="#track">Timeline</a></div>
          <div><span>Safety</span><a href="#trust">Trust controls</a><button type="button" onClick={() => setIsLoginModalOpen(true)}>Sign in</button></div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      {error && <Toast message={error} type="error" />}
    </div>
  );
}
