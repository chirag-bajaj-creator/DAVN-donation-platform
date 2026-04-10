import React from 'react';

export default function PaymentStatus({ status, orderId }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⏳' },
    completed: { color: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '✓' },
    failed: { color: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '✗' },
    expired: { color: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: '⚠' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`${config.color} border ${config.border} rounded-lg p-6`}>
      <div className="flex items-center justify-center mb-4">
        <span className="text-4xl">{config.icon}</span>
      </div>
      <p className={`text-center font-semibold ${config.text} mb-2`}>
        {status === 'completed' && 'Payment Completed Successfully!'}
        {status === 'pending' && 'Payment Pending...'}
        {status === 'failed' && 'Payment Failed'}
        {status === 'expired' && 'Payment Link Expired'}
      </p>
      <p className="text-sm text-gray-600 text-center">
        Order ID: {orderId}
      </p>
    </div>
  );
}
