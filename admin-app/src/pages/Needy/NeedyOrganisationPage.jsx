import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import NeedyForm from '../../components/Needy/NeedyForm';
import { needyService } from '../../services';
import { useNavigate } from 'react-router-dom';

export default function NeedyOrganisationPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await needyService.registerOrganization(data);
    navigate('/dashboard');
  };

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Organisation Registration</h1>
        <p className="text-gray-600 mb-8">Register your organisation to receive assistance from our donors</p>

        <NeedyForm type="organisation" onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}
