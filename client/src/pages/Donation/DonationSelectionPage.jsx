import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DonationCard from '../../components/Donation/DonationCard';

export default function DonationSelectionPage() {
  const donations = [
    {
      type: 'cash',
      title: 'Cash Donation',
      description: 'Donate money directly to help those in need',
      icon: '💰',
      link: '/donation/cash',
    },
    {
      type: 'food',
      title: 'Food Donation',
      description: 'Contribute food items to feed the hungry',
      icon: '🍎',
      link: '/donation/food',
    },
    {
      type: 'shelter',
      title: 'Shelter Donation',
      description: 'Help provide safe shelter for the homeless',
      icon: '🏠',
      link: '/donation/shelter',
    },
    {
      type: 'medical',
      title: 'Medical Aid',
      description: 'Support medical care and treatment',
      icon: '⚕️',
      link: '/donation/medical',
    },
    {
      type: 'basics',
      title: 'Basic Needs',
      description: 'Provide clothes, hygiene items, and essentials',
      icon: '👕',
      link: '/donation/basics',
    },
  ];

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Donation Type</h1>
        <p className="text-gray-600 mb-8">Select the type of donation you'd like to make</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard
              key={donation.type}
              type={donation.type}
              title={donation.title}
              description={donation.description}
              icon={donation.icon}
              link={donation.link}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
