import React, { useState, useEffect } from 'react';
import { needyService } from '../../services';
import Loading from '../Common/Loading';

export default function NeedyList() {
  const [needyList, setNeedyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNeedyList();
  }, []);

  const loadNeedyList = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await needyService.getVerifiedNeedy();
      setNeedyList(response.data?.needy || []);
    } catch (err) {
      setError(err.message || 'Failed to load needy list');
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

      {needyList.length === 0 ? (
        <p className="text-gray-600">No needy individuals or organizations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {needyList.map((needy) => (
            <div key={needy.id} className="bg-white rounded-lg shadow-medium p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{needy.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{needy.type}</p>
              <p className="text-gray-700 mb-4 line-clamp-3">{needy.description}</p>
              <p className="text-sm text-gray-500 mb-4">Location: {needy.address}</p>
              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded font-medium hover:bg-primary-700">
                Learn More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
