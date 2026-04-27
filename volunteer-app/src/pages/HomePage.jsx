import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import '../styles/landing.css';

const steps = [
  ['1', 'Register Profile', 'Share your volunteer type and availability.'],
  ['2', 'Accept Nearby Tasks', 'Pick assigned verification work you can complete.'],
  ['3', 'Submit Field Report', 'Upload notes, proof, and recommendations.'],
];

const safety = ['Verified ID', 'Location Tasks', 'Proof Capture', 'Admin Review'];
const timeline = ['Assigned', 'Accepted', 'Visited', 'Reported', 'Closed'];
const useCases = [
  ['Food pickup checks', 'Confirm freshness, packaging, and handover timing.'],
  ['Needy profile visits', 'Validate address, contact, and actual support need.'],
  ['Emergency routing', 'Share live location while handling urgent cases.'],
  ['Report follow-up', 'Submit evidence, issues, and next-step recommendations.'],
];
const stories = [
  ['Field clarity', 'Tasks show what to verify before the visit starts.'],
  ['Safer handover', 'Proof and notes keep donation delivery accountable.'],
  ['Faster review', 'Admin teams receive structured reports instead of scattered messages.'],
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

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    navigate('/dashboard');
  };

  useEffect(() => {
    if (isAuthenticated && !loading && user && user.role !== 'volunteer') logout();
  }, [isAuthenticated, loading, logout, user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page volunteer-landing calm-landing">
      <nav className={`landing-nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-brand"><span className="landing-brand-mark">V</span>Volunteer Network</div>
          <div className="landing-nav-links"><a href="#how">How It Works</a><a href="#safety">Safety</a><a href="#track">Tasks</a></div>
          <button className="landing-nav-button" type="button" onClick={() => openAuth('login')}>Sign In</button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-shell hero-grid">
            <div className="hero-copy">
              <h1>Give your time. Help support reach the right <span>people.</span></h1>
              <p>A calm volunteer landing page for nearby verification tasks, live location support, and structured field reports.</p>
              <div className="hero-actions">
                <button className="primary-cta" type="button" onClick={() => openAuth('register')}>Become a Volunteer</button>
                <button className="secondary-cta" type="button" onClick={() => openAuth('login')}>Volunteer Sign In</button>
              </div>
            </div>
            <div className="calm-hero-art volunteer-art">
              <div className="aid-illustration">
                <div className="map-route" />
                <div className="route-dot one" />
                <div className="route-dot two" />
                <div className="route-dot three" />
              </div>
              <div className="flow-card">{['Task', 'Visit', 'Report'].map((item) => <div className="flow-step" key={item}><span>{item[0]}</span><strong>{item}</strong></div>)}</div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="how">
          <div className="landing-shell section-heading"><h2>How It Works</h2></div>
          <div className="landing-shell calm-step-row">
            {steps.map(([num, title, copy]) => <article className="calm-card how-card" key={title}><span className="calm-number">{num}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="landing-shell calm-impact-strip">
          {['Live Tasks', 'Safe Reports', 'GPS Updates', 'Admin Review'].map((stat) => <div key={stat}><strong>{stat.split(' ')[0]}</strong><span>{stat.replace(stat.split(' ')[0], '')}</span></div>)}
        </section>

        <section className="landing-section" id="safety">
          <div className="landing-shell section-heading"><h2>Volunteer Trust & Safety</h2></div>
          <div className="landing-shell calm-card-grid safety-grid">
            {safety.map((item) => <article className="calm-card safety-card" key={item}><span className="calm-icon">OK</span><h3>{item}</h3><p>Each field step stays clear and accountable.</p></article>)}
          </div>
        </section>

        <section className="landing-section" id="track">
          <div className="landing-shell section-heading"><h2>Task Journey</h2></div>
          <div className="landing-shell calm-timeline">{timeline.map((item) => <div className="timeline-node" key={item}><span /><strong>{item}</strong></div>)}</div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>Volunteer Use Cases</h2><p>Designed for real field work, not vague volunteering.</p></div>
          <div className="landing-shell calm-use-grid">
            {useCases.map(([title, copy]) => <article className="calm-use-card" key={title}><span /> <div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className="landing-section calm-band-section">
          <div className="landing-shell calm-split">
            <div>
              <span className="calm-kicker">Field-ready workflow</span>
              <h2>Know where to go, what to check, and what proof to submit.</h2>
              <p>The volunteer portal supports assigned cases, live location sharing, and report submission with less confusion.</p>
            </div>
            <div className="calm-review-card">
              <div><strong>2.4km</strong><span>Nearby task</span></div>
              <div><strong>3</strong><span>Open checks</span></div>
              <div><strong>Live</strong><span>Location support</span></div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>Why Volunteers Like It</h2></div>
          <div className="landing-shell calm-testimonial-grid">
            {stories.map(([title, copy]) => <article className="calm-quote-card" key={title}><strong>{title}</strong><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="landing-shell calm-final">
          <h2>Small visits. Real <span>impact.</span></h2>
          <div className="hero-actions final-actions">
            <button className="primary-cta" type="button" onClick={() => openAuth('register')}>Register Now</button>
            <button className="secondary-cta" type="button" onClick={() => openAuth('login')}>Sign In</button>
          </div>
        </section>
      </main>

      <LoginModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} initialMode={authMode} />
      <footer className="calm-footer">
        <div className="landing-shell calm-footer-grid">
          <div><strong>Volunteer Network</strong><p>Verify real needs and help aid reach safely.</p></div>
          <div><span>Volunteer</span><button type="button" onClick={() => openAuth('register')}>Register</button><button type="button" onClick={() => openAuth('login')}>Sign in</button></div>
          <div><span>Workflow</span><a href="#how">How it works</a><a href="#track">Task journey</a></div>
        </div>
      </footer>
    </div>
  );
}
