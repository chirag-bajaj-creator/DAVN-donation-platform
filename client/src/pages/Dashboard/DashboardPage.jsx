import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DonationHistory from '../../components/Donation/DonationHistory';
import NeedyList from '../../components/Needy/NeedyList';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('donation');

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="flex space-x-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('donation')}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'donation'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Donations
          </button>
          <button
            onClick={() => setActiveTab('needy')}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'needy'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Needy People
          </button>
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'volunteer'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Volunteer
          </button>
        </div>

        <div>
          {activeTab === 'donation' && <DonationHistory />}
          {activeTab === 'needy' && <NeedyList />}
          {activeTab === 'volunteer' && (
            <div className="p-8 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800">Volunteer section coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
