import React, { useState, useEffect } from 'react';
import { donationService } from '../../services';
import Loading from '../Common/Loading';
import { formatDistanceToNow } from 'date-fns';

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await donationService.getHistory();
      setDonations(data);
    } catch (err) {
      setError(err.message || 'Failed to load donation history');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {donations.length === 0 ? (
        <p className="text-gray-600">No donations yet.</p>
      ) : (
        <div className="space-y-2">
          {donations.map((donation) => (
            <div key={donation._id} className="bg-white p-4 rounded border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{donation.type}</p>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <span className="text-lg font-bold text-primary-600">
                  {donation.amount ? `$${donation.amount}` : donation.type}
                </span>
              </div>
              {donation.status && (
                <p className="text-sm text-gray-500 mt-2">Status: {donation.status}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
