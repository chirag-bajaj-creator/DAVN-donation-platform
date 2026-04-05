import React from 'react';

export default function Loading({ fullScreen = false }) {
  const loadingSpinner = (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        {loadingSpinner}
      </div>
    );
  }

  return (
    <div className="p-8">
      {loadingSpinner}
    </div>
  );
}
