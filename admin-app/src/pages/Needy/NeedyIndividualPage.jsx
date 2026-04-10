import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import NeedyForm from '../../components/Needy/NeedyForm';
import { needyService } from '../../services';
import { useNavigate } from 'react-router-dom';

export default function NeedyIndividualPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      console.log('NeedyIndividualPage received data:', data);
      await needyService.registerIndividual(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      throw error;
    }
  };

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Individual Needy Registration</h1>
        <p className="text-gray-600 mb-8">Please fill in your information to register for assistance</p>

        <NeedyForm type="individual" onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}
