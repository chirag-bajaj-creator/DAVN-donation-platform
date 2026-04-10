import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import DonationHistory from '../../components/Donation/DonationHistory';
import NeedyList from '../../components/Needy/NeedyList';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('donation');

  return (
    <MainLayout>
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="flex space-x-2 border-b" style={{ borderColor: '#e5e7eb' }}>
          <button
            onClick={() => setActiveTab('donation')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'donation'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Donations
          </button>
          <button
            onClick={() => setActiveTab('needy')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'needy'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Needy People
          </button>
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'volunteer'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Volunteer
          </button>
        </div>

        <div className="mt-8">
          {activeTab === 'donation' && <DonationHistory />}
          {activeTab === 'needy' && <NeedyList />}
          {activeTab === 'volunteer' && (
            <div className="p-8 rounded-lg border transition-colors" style={{ backgroundColor: '#f0f9ff', borderColor: '#0284c7' }}>
              <p style={{ color: '#0284c7' }} className="font-medium">Volunteer section coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
