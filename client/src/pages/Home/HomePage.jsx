import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '../../components/Common/LoginModal';
import '../../styles/landing.css';

const howSteps = [
  ['1', 'List Your Donation', 'Add food, clothes, relief, or cash support with pickup details.'],
  ['2', 'Volunteer Picks Up', 'A nearby verified volunteer accepts and coordinates the pickup.'],
  ['3', 'Donation Reaches Safely', 'Delivery is tracked, confirmed, and closed with proof.'],
];

const categories = [
  ['Food Donation', 'Fresh meals and grocery packs.', 'FD'],
  ['Clothes Donation', 'Clean clothes, blankets, and basics.', 'CD'],
  ['Medicine Support', 'Healthcare essentials and aid.', 'MS'],
  ['Emergency Relief', 'Urgent support during local crises.', 'ER'],
];

const safety = ['Verified Volunteers', 'Safe Food Checklist', 'Pickup Tracking', 'Donation Proof'];
const timeline = ['Donation Listed', 'Volunteer Assigned', 'Picked Up', 'Delivered', 'Confirmed'];
const useCases = [
  ['Wedding surplus meals', 'Route safe packed food before it goes waste.'],
  ['Family clothes drive', 'Donate sorted clothes with sizes and condition.'],
  ['Emergency local relief', 'Flag urgent help with proof and affected location.'],
  ['Medicine support', 'Share healthcare essentials with verification consent.'],
];
const testimonials = [
  ['Priya S.', 'Food Donor', 'Extra food reached nearby people quickly and every step was visible.'],
  ['Rohan M.', 'Volunteer', 'The flow is simple and helps me know what to verify.'],
  ['Anita K.', 'NGO Partner', 'Proof and tracking make coordination much easier.'],
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
    if (location.pathname === '/login') setIsLoginModalOpen(true);
  }, [location.pathname]);

  return (
    <div className="landing-page client-landing calm-landing">
      <nav className={`landing-nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <button className="landing-brand landing-brand-button" type="button" onClick={() => navigate('/')}>
            <span className="landing-brand-mark">K</span>
            <span>Community Platform</span>
          </button>
          <div className="landing-nav-links">
            <a href="#how">Home</a>
            <button type="button" onClick={() => navigate('/donation')}>Donate</button>
            <button type="button" onClick={() => setIsLoginModalOpen(true)}>Track Donation</button>
          </div>
          <button className="landing-nav-button" type="button" onClick={() => setIsLoginModalOpen(true)}>
            Donate Now
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-shell hero-grid">
            <div className="hero-copy">
              <h1>Give what you can. Reach those who need it <span>most.</span></h1>
              <p>A simple platform connecting donors, volunteers, and NGOs for safe, fast, and transparent donation delivery.</p>
              <div className="hero-actions">
                <button className="primary-cta" type="button" onClick={() => navigate('/donation')}>Donate Now</button>
                <button className="secondary-cta" type="button" onClick={() => setIsLoginModalOpen(true)}>Sign In / Register</button>
              </div>
            </div>

            <div className="calm-hero-art">
              <div className="aid-illustration">
                <div className="person donor" />
                <div className="aid-box">FOOD</div>
                <div className="person receiver" />
                <div className="route-dot one" />
                <div className="route-dot two" />
              </div>
              <div className="flow-card">
                {['Donor', 'Volunteer', 'NGO'].map((item) => (
                  <div className="flow-step" key={item}>
                    <span>{item[0]}</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="how">
          <div className="landing-shell section-heading"><h2>How It Works</h2></div>
          <div className="landing-shell calm-step-row">
            {howSteps.map(([num, title, copy]) => (
              <article className="calm-card how-card" key={title}>
                <span className="calm-number">{num}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>Donation Categories</h2></div>
          <div className="landing-shell calm-card-grid">
            {categories.map(([title, copy, icon]) => (
              <article className="calm-card category-card" key={title}>
                <span className="calm-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <button type="button" onClick={() => navigate('/donation')}>Donate this</button>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-shell calm-impact-strip">
          {['12,400+ Meals Delivered', '3,200+ Clothes Donated', '850+ Volunteers', '120+ NGO Partners'].map((stat) => (
            <div key={stat}><strong>{stat.split(' ')[0]}</strong><span>{stat.replace(stat.split(' ')[0], '')}</span></div>
          ))}
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>Trust & Safety</h2></div>
          <div className="landing-shell calm-card-grid safety-grid">
            {safety.map((item) => <article className="calm-card safety-card" key={item}><span className="calm-icon">OK</span><h3>{item}</h3><p>Clear checks keep every donation accountable.</p></article>)}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>Track Donation</h2></div>
          <div className="landing-shell calm-timeline">
            {timeline.map((item) => <div className="timeline-node" key={item}><span /> <strong>{item}</strong></div>)}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>Real Use Cases</h2><p>Practical giving situations that need quick routing and trust.</p></div>
          <div className="landing-shell calm-use-grid">
            {useCases.map(([title, copy]) => <article className="calm-use-card" key={title}><span /> <div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </section>

        <section className="landing-section calm-band-section">
          <div className="landing-shell calm-split">
            <div>
              <span className="calm-kicker">Proof-first giving</span>
              <h2>Every donation keeps a visible path from listing to confirmation.</h2>
              <p>Donors can add pickup details, attach proof, request help, and track aid movement with a simple flow.</p>
            </div>
            <div className="calm-review-card">
              <div><strong>4/4</strong><span>Proof readiness</span></div>
              <div><strong>18m</strong><span>Pickup estimate</span></div>
              <div><strong>Live</strong><span>Route status</span></div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-shell section-heading"><h2>What People Say</h2></div>
          <div className="landing-shell calm-testimonial-grid">
            {testimonials.map(([name, role, quote]) => <article className="calm-quote-card" key={name}><strong>{name}</strong><span>{role}</span><p>{quote}</p></article>)}
          </div>
        </section>

        <section className="landing-shell calm-final">
          <h2>Small donations. Real <span>impact.</span></h2>
          <div className="hero-actions">
            <button className="primary-cta" type="button" onClick={() => navigate('/donation')}>Donate Now</button>
            <button className="secondary-cta" type="button" onClick={() => setIsLoginModalOpen(true)}>Track My Donation</button>
          </div>
        </section>
      </main>

      <footer className="calm-footer">
        <div className="landing-shell calm-footer-grid">
          <div><strong>Community Platform</strong><p>Give, track, and verify community support.</p></div>
          <div><span>Donate</span><button type="button" onClick={() => navigate('/donation')}>Food donation</button><button type="button" onClick={() => navigate('/donation')}>Emergency relief</button></div>
          <div><span>Trust</span><a href="#how">How it works</a><button type="button" onClick={() => setIsLoginModalOpen(true)}>Track donation</button></div>
        </div>
      </footer>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
