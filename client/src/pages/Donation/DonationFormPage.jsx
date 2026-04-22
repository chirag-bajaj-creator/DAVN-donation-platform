import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageUpload from '../../components/Common/ImageUpload';
import DonationForm from '../../components/Donation/DonationForm';
import MainLayout from '../../components/layout/MainLayout';
import donationService from '../../services/donationService';

const DONATION_TYPES = {
  cash: { name: 'Cash Donation', label: 'Cash' },
  food: { name: 'Food Donation', label: 'Food' },
  shelter: { name: 'Shelter/Housing', label: 'Home' },
  medical: { name: 'Medical Supplies', label: 'Aid' },
  basic_needs: { name: 'Basic Needs', label: 'Care' },
};

export default function DonationFormPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [, setUploadedImage] = useState(null);

  const donationType = DONATION_TYPES[type] || DONATION_TYPES.cash;

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      await donationService.createDonation(data);
      toast.success('Donation created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="client-responsive-shell">
        <section className="client-panel client-shell-section">
          <span className="client-kicker">{donationType.label}</span>
          <h1 className="client-page-title">{donationType.name}</h1>
          <p className="client-page-copy">
            Make a difference by donating {donationType.name.toLowerCase()} through a secure community request flow.
          </p>
        </section>

        <section className="client-panel client-shell-section client-form">
          <DonationForm type={type || 'cash'} onSubmit={handleSubmit} />

          <div className="mt-8 pt-8 border-t client-shell-divider">
            <ImageUpload
              onImageUpload={setUploadedImage}
              disabled={isLoading}
              folder="donations"
            />
          </div>

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
