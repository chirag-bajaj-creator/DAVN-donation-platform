import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Link } from 'react-router-dom';

export default function NeedySelectionPage() {
  const needyTypes = [
    {
      type: 'individual',
      title: 'Individual Registration',
      description: 'I need personal assistance and support',
      icon: '👤',
      link: '/needy/individual',
    },
    {
      type: 'organisation',
      title: 'Organisation Registration',
      description: 'Our organisation needs help for those we serve',
      icon: '🏢',
      link: '/needy/organisation',
    },
  ];

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Register as Needy</h1>
        <p className="text-gray-600 mb-8">
          Select whether you are registering as an individual or on behalf of an organisation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {needyTypes.map((needy) => (
            <Link
              key={needy.type}
              to={needy.link}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-5xl mb-4">{needy.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{needy.title}</h2>
              <p className="text-gray-600">{needy.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">⚠️ Important Information</h3>
          <ul className="text-sm text-amber-800 space-y-2">
            <li>✓ Your registration will be reviewed by our admin team</li>
            <li>✓ A volunteer will be assigned to verify your information</li>
            <li>✓ Only verified registrations will be visible to donors</li>
            <li>✓ This helps us prevent fraud and ensure genuine assistance</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
