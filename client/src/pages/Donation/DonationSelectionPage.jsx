import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DonationCard from '../../components/Donation/DonationCard';

export default function DonationSelectionPage() {
  const donations = [
    {
      type: 'cash',
      title: 'Verified Cash',
      description: 'Fund verified requests with a clear payment and admin review trail.',
      icon: 'C',
      link: '/donation/cash',
      meta: 'Proof-linked',
    },
    {
      type: 'food',
      title: 'Surplus Food',
      description: 'Share cooked meals, dry ration, or packed food with pickup-safe details.',
      icon: 'F',
      link: '/donation/food',
      meta: 'Pickup ready',
    },
    {
      type: 'shelter',
      title: 'Emergency Shelter',
      description: 'Offer rooms, temporary stays, rent support, or safe short-term shelter.',
      icon: 'S',
      link: '/donation/shelter',
      meta: 'Time bound',
    },
    {
      type: 'emergency',
      title: 'Emergency Relief',
      description: 'Route urgent relief items for floods, fire, heatwaves, or local disasters.',
      icon: 'R',
      link: '/donation/emergency',
      meta: 'Rapid response',
    },
    {
      type: 'medical',
      title: 'Medical Aid',
      description: 'Contribute medicines, equipment, or treatment support with proof notes.',
      icon: 'M',
      link: '/donation/medical',
      meta: 'Documented',
    },
    {
      type: 'basic_needs',
      title: 'Clothes & Basics',
      description: 'Provide clothes, blankets, hygiene kits, school items, and essentials.',
      icon: 'B',
      link: '/donation/basic_needs',
      meta: 'Sorted items',
    },
  ];

  return (
    <MainLayout>
      <div className="client-responsive-shell donation-selection-shell">
        <section className="client-panel client-shell-section donation-selection-hero">
          <span className="client-kicker">Real aid operations V1</span>
          <div>
            <h1 className="client-page-title">Choose the aid route that matches what you can give.</h1>
            <p className="client-page-copy">
              Festival-impact giving starts with operational details: pickup windows, item condition,
              proof links, and verification notes that help volunteers move faster.
            </p>
          </div>
          <div className="donation-proof-flow" aria-label="Donation proof flow">
            {['Submit details', 'Volunteer verifies', 'Admin reviews', 'Impact tracked'].map((step) => (
              <span key={step}>
                <i aria-hidden="true">V</i>
                {step}
              </span>
            ))}
          </div>
        </section>

        <div className="donation-card-grid">
          {donations.map((donation) => (
            <DonationCard
              key={donation.type}
              type={donation.type}
              title={donation.title}
              description={donation.description}
              icon={donation.icon}
              link={donation.link}
              meta={donation.meta}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
