import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '../../components/Common/LoginModal';
import '../../styles/landing.css';

const aidLanes = [
  {
    title: 'Surplus food rescue',
    copy: 'Capture safe pickup windows, serving counts, packaging, and storage details before food is routed.',
    icon: 'F',
  },
  {
    title: 'Clothes & basic needs',
    copy: 'List sorted clothes, blankets, hygiene kits, school items, sizes, condition, and packed-readiness.',
    icon: 'B',
  },
  {
    title: 'Emergency relief',
    copy: 'Flag floods, fires, heatwaves, and urgent local needs with priority, affected location, and required-by time.',
    icon: 'R',
  },
  {
    title: 'Verified cash',
    copy: 'Route money through documented requests, references, proof uploads, and admin-visible review steps.',
    icon: 'C',
  },
];

const proofSteps = [
  'Donor submits operational details',
  'Photo, bill, inventory, or transaction proof is attached',
  'Volunteer checks location and condition',
  'Admin approves routing and impact follow-up',
];

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(location.pathname === '/login');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
          <button className="landing-nav-button" type="button" onClick={() => setIsLoginModalOpen(true)}>
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
              <span className="eyebrow">Festival-impact aid operations</span>
              <h1>Turn festive giving into verified food, relief, clothes, and cash support.</h1>
              <p>
                A bright, proof-first donation flow for real-world aid: pickup-ready surplus food,
                sorted basic needs, urgent relief, and verified cash requests.
              </p>

              <div className="hero-actions">
                <button className="primary-cta" type="button" onClick={() => setIsLoginModalOpen(true)}>
                  Sign In / Register
                  <span aria-hidden="true">-&gt;</span>
                </button>
                <button className="secondary-cta" type="button" onClick={() => navigate('/donation')}>
                  Start a Donation
                </button>
              </div>

              <div className="metric-strip">
                {['Pickup details', 'Proof uploads', 'Volunteer checks'].map((label) => (
                  <div className="metric-card" key={label}>
                    <strong>{label.split(' ')[0]}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual glass-panel donation-card festival-card">
              <div className="visual-header">
                <span>Live Aid Packet</span>
                <span className="landing-icon" aria-hidden="true">V</span>
              </div>
              <div className="cause-card">
                <span>Surplus food + blankets</span>
                <h3>Ready for volunteer pickup before 8:30 PM</h3>
                <p>Photo proof attached, quantity listed, location verified after submission.</p>
              </div>
              <div className="donation-meter">
                <div>
                  <span>Proof readiness</span>
                  <strong>4/4</strong>
                </div>
                <i />
              </div>
              <div className="quick-actions">
                <span>Food</span>
                <span>Basics</span>
                <span>Relief</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="aid-lanes">
          <div className="landing-shell section-heading">
            <span className="eyebrow">Aid lanes</span>
            <h2>Designed for what donors can actually give today.</h2>
            <p>Each lane collects the details needed to reduce back-and-forth and improve verification.</p>
          </div>

          <div className="landing-shell pathway-grid aid-lane-grid">
            {aidLanes.map(({ title, copy, icon }) => (
              <article className="glass-panel pathway-card aid-lane-card" key={title}>
                <span className="landing-icon" aria-hidden="true">{icon}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section split-section">
          <div className="landing-shell split-grid">
            <div className="glass-panel insight-card">
              <span className="eyebrow">Proof flow</span>
              <h2>Impact is easier to trust when the proof path is visible.</h2>
              <p>
                Donors submit useful evidence, volunteers validate the field reality, and admins keep final routing accountable.
              </p>
              <button className="secondary-cta proof-cta" type="button" onClick={() => navigate('/needy')}>
                Request Help
              </button>
            </div>
            <div className="journey-list">
              {proofSteps.map((step, index) => (
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
            <span className="landing-icon is-large" aria-hidden="true">H</span>
            <h2>Give with operational clarity, not guesswork.</h2>
            <p>Sign in to submit a donation, register a need, or track your verified aid activity.</p>
            <button className="primary-cta" type="button" onClick={() => setIsLoginModalOpen(true)}>
              Get Started Today
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2026 Community Platform. All rights reserved.</p>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
