import React from 'react';

export default function Loading({ fullScreen = false }) {
  const loadingSpinner = (
    <div className="flex justify-center items-center gap-3 client-muted">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <span>Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50 client-modal-shell">
        {loadingSpinner}
      </div>
    );
  }

  return (
    <div className="p-8 client-panel client-card-tight">
      {loadingSpinner}
    </div>
  );
}
