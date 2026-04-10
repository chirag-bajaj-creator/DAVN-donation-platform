import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DonationForm from '../../components/Donation/DonationForm';
import ImageUpload from '../../components/Common/ImageUpload';
import donationService from '../../services/donationService';

const DONATION_TYPES = {
  cash: { name: 'Cash Donation', icon: '💰', color: 'bg-green-100' },
  food: { name: 'Food Donation', icon: '🍔', color: 'bg-orange-100' },
  shelter: { name: 'Shelter/Housing', icon: '🏠', color: 'bg-blue-100' },
  medical: { name: 'Medical Supplies', icon: '🏥', color: 'bg-red-100' },
  basic_needs: { name: 'Basic Needs', icon: '🛍️', color: 'bg-purple-100' },
};

export default function DonationFormPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const donationType = DONATION_TYPES[type] || DONATION_TYPES.cash;

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Data is already structured with type and amount from DonationForm
      const response = await donationService.createDonation(data);
      toast.success('Donation created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className={`${donationType.color} rounded-lg shadow-md p-6 mb-8`}>
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{donationType.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {donationType.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Make a difference by donating {donationType.name.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <DonationForm type={type || 'cash'} onSubmit={handleSubmit} />

          {/* Image Upload */}
          <div className="mt-8 pt-8 border-t">
            <ImageUpload
              onImageUpload={setUploadedImage}
              disabled={isLoading}
              folder="donations"
            />
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/donation')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Donation Types
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
