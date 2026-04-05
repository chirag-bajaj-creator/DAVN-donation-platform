import React, { useState, useEffect } from 'react';

export default function PaymentTimer({ duration = 300 }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 60;

  return (
    <div className={`p-4 rounded-lg text-center ${isWarning ? 'bg-yellow-100' : 'bg-blue-100'}`}>
      <p className={`text-sm font-medium ${isWarning ? 'text-yellow-800' : 'text-blue-800'}`}>
        {isWarning ? 'Payment expires in:' : 'Time remaining:'}
      </p>
      <p className={`text-3xl font-bold ${isWarning ? 'text-yellow-600' : 'text-blue-600'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
    </div>
  );
}
