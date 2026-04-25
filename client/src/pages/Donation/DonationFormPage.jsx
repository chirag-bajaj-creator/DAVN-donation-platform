import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DonationForm from '../../components/Donation/DonationForm';
import MainLayout from '../../components/layout/MainLayout';
import donationService from '../../services/donationService';

const DONATION_TYPES = {
  cash: { name: 'Verified Cash Donation', label: 'Cash', icon: 'C' },
  food: { name: 'Surplus Food Donation', label: 'Food', icon: 'F' },
  shelter: { name: 'Emergency Shelter Support', label: 'Relief', icon: 'S' },
  emergency: { name: 'Emergency Relief Donation', label: 'Disaster', icon: 'R' },
  medical: { name: 'Medical Aid Support', label: 'Medical', icon: 'M' },
  basic_needs: { name: 'Clothes & Basic Needs', label: 'Basics', icon: 'B' },
};

export default function DonationFormPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const normalizedType = type === 'basics' ? 'basic_needs' : type;
  const donationType = DONATION_TYPES[normalizedType] || DONATION_TYPES.cash;

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      await donationService.createDonation(data);
      toast.success('Donation created successfully!');
      navigate('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="client-responsive-shell">
        <section className="client-panel client-shell-section">
          <span className="client-kicker">{donationType.label}</span>
          <div className="donation-form-heading">
            <span className="donation-form-heading__icon">
              {donationType.icon}
            </span>
            <div>
              <h1 className="client-page-title">{donationType.name}</h1>
              <p className="client-page-copy">
                Add the operational details volunteers need: location, pickup timing,
                item readiness, verification notes, and proof attachments.
              </p>
            </div>
          </div>
          <div className="client-info-banner donation-form-proof">
            <span className="donation-proof-icon" aria-hidden="true">V</span>
            Donation proof is collected before routing so admins can verify intent without changing the service API.
          </div>
        </section>

        <section className="client-panel client-shell-section client-form">
          <DonationForm type={normalizedType || 'cash'} onSubmit={handleSubmit} />

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate('/donation')}
              className="client-button client-button-secondary"
            >
              Back to Donation Types
            </button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
