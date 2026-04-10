import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import QRDisplay from '../../components/QR/QRDisplay';
import PaymentTimer from '../../components/QR/PaymentTimer';
import PaymentStatus from '../../components/QR/PaymentStatus';
import { paymentService } from '../../services';
import Loading from '../../components/Common/Loading';

export default function QRPaymentPage() {
  const { orderId } = useParams();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPayment();
    const interval = setInterval(checkPaymentStatus, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const loadPayment = async () => {
    try {
      setIsLoading(true);
      const data = await paymentService.getPaymentDetails(orderId);
      setPayment(data);
    } catch (err) {
      setError(err.message || 'Failed to load payment details');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const data = await paymentService.checkStatus(orderId);
      setPayment(data);
    } catch (err) {
      console.error('Error checking status:', err);
    }
  };

  if (isLoading) return <MainLayout><Loading /></MainLayout>;

  if (error) {
    return (
      <MainLayout>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Payment</h1>

        {payment && (
          <div className="max-w-2xl mx-auto space-y-6">
            <PaymentTimer duration={payment.expiresIn || 300} />

            {payment.status === 'pending' && (
              <QRDisplay
                qrData={payment.qrData}
                amount={payment.amount}
                orderId={payment.orderId}
              />
            )}

            {payment.status !== 'pending' && (
              <PaymentStatus status={payment.status} orderId={payment.orderId} />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
