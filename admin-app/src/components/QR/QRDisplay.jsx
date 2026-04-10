import React from 'react';

export default function QRDisplay({ qrData, amount, orderId }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-medium">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Scan to Pay</h2>

      {qrData && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <img
            src={qrData}
            alt="QR Code"
            className="w-64 h-64"
          />
        </div>
      )}

      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-gray-800">
          Amount: <span className="text-primary-600">₹{amount}</span>
        </p>
        <p className="text-sm text-gray-600">Order ID: {orderId}</p>
      </div>

      <p className="mt-6 text-sm text-gray-600 max-w-md text-center">
        Use your payment app to scan this QR code and complete the transaction.
      </p>
    </div>
  );
}
